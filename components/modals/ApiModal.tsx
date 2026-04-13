"use client";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import Heading from "@/components/Heading";
import { Button } from "../ui/button";
import useApiModal from "../hooks/useApiModal";
import { cn } from "@/lib/utils";
import { CheckIcon, Key } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Restaurant } from "@prisma/client";
import ApiWarning from "../errors/ApiWarning";
import { InputIcon } from "../inputs/inputIcon";
import { createApiKey } from "@/actions/settings/api/createApiKey";

enum STEPS {
  DESCRIPTION = 0,
  KEY = 1,
}

const apiFormSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
});

export type ApiFormValues = z.infer<typeof apiFormSchema>;

const ApiModal = ({ restaurants }: { restaurants: Restaurant[] }) => {
  const apiModal = useApiModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.DESCRIPTION);
  const [key, setKey] = useState("");
  const [id, setId] = useState("");

  const onNext = () => {
    setStep((value) => value + 1);
  };

  useEffect(() => {
    if (restaurants) {
      setId(restaurants[0].id);
    }
  }, []);

  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ApiFormValues) {
    setIsLoading(true);

    const message = await createApiKey(data, id);
    if (message.error) {
      toast.error(message.error);
      handleClose();
    } else if (message.key) {
      setKey(message.key);
    }

    onNext();
    setIsLoading(false);
  }

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    setKey("");
    setStep(STEPS.DESCRIPTION);
    apiModal.onClose();
  };

  let bodyContent = (
    <div className="flex flex-col">
      <Heading title="Add Api Key" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-2.5 space-y-3"
        >
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex w-1/2 flex-col">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="flex w-1/2 flex-col">
              <FormLabel>Restaurant</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("h-full justify-start")}
                  >
                    {
                      restaurants.find((restaurant) => restaurant.id === id)
                        ?.name
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ zIndex: 100 }}>
                  <Command>
                    <CommandGroup>
                      {restaurants.map((restaurant) => (
                        <div key={restaurant.id}>
                          <CommandItem
                            value={restaurant.id}
                            onSelect={() => {
                              setId(restaurant.id);
                            }}
                          >
                            {restaurant.name}
                            <CheckIcon
                              className={cn(
                                "ml-2 h-4 w-4",
                                id == restaurant.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        </div>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </div>
          <div>
            <FormDescription>
              The API Key will be displayed once you create.
            </FormDescription>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              className="mt-1 w-full"
              type="submit"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
  if (step === STEPS.KEY) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="API Key" />
        <ApiWarning />
        <InputIcon
          disabled
          value={key}
          clipboard
          icon={Key}
          className="bg-accent w-full"
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={apiModal.isOpen}
      title="Add API Key"
      actionLabel={undefined}
      onClose={handleClose}
      onSubmit={() => null}
      body={bodyContent}
    />
  );
};

export default ApiModal;
