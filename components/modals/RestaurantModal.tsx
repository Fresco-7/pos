"use client";
import { useState } from "react";
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
import { COUNTRYS } from "@/config/index";
import { CheckIcon, Key, Mail } from "lucide-react";
import useRestaurantModal from "../hooks/useRestaurantModal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";
import { useFieldArray, useForm } from "react-hook-form";
import { createRestaurant } from "@/actions/restaurant/createRestaurant";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

enum STEPS {
  DESCRIPTION = 0,
  EMPLOYEES = 1,
}

const restaurantFormSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name." })
    .min(3, { message: "Name must be at least 3 chracters" }),
  country: z.string({ required_error: "Please enter a country." }),
  city: z
    .string({ required_error: "Please enter a city" })
    .min(3, { message: "City must be at least 3 chracters" }),
  address: z
    .string({ required_error: "Please enter a address." })
    .min(3, { message: "Address must be at least 3 chracters" }),
  zipCode: z
    .string({ required_error: "Please provide a zipCode" })
    .min(3, { message: "ZipCode must be at least 3 chracters" }),
});

//TODO:
//Add a refine for the zip Codes to see if they are valid.
//Maybe address and city

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

const RestaurantModal = () => {
  const [restaurantId, setRestaurantId] = useState("");
  const restaurantModal = useRestaurantModal();

  const pathname = usePathname();

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    mode: "onChange",
    defaultValues: {
      country: "pt",
    },
  });

  const [step, setStep] = useState(STEPS.DESCRIPTION);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    form.reset();
    form.clearErrors();
    setStep(STEPS.DESCRIPTION);
    restaurantModal.onClose();
  };

  let bodyConent = (
    <div className="flex flex-col gap-1">
      <Heading title={`Give us information about your Restaurant`} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={`Restaurant Name`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-row gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex w-1/2 flex-col">
                  <FormLabel>Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-start",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {COUNTRYS.map((country) => {
                            if (field.value === country.value) {
                              return (
                                <span className="w-8">
                                  {" "}
                                  <country.icon
                                    className="mr-2 rounded-sm "
                                    key={country.value}
                                  />{" "}
                                </span>
                              );
                            }
                            return null;
                          })}
                          {field.value
                            ? COUNTRYS.find(
                                (country) => country.value === field.value,
                              )?.label
                            : "Select a country"}
                          <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" style={{ zIndex: 100 }}>
                      <Command>
                        <CommandGroup>
                          {COUNTRYS.map((country) => (
                            <div key={country.label}>
                              <CommandItem
                                value={country.label}
                                key={country.value}
                                onSelect={() => {
                                  form.setValue("country", country.value);
                                }}
                              >
                                <span className="w-8">
                                  {" "}
                                  <country.icon
                                    className="mr-2 rounded-sm "
                                    key={country.value}
                                  />{" "}
                                </span>
                                {country.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-2 h-4 w-4",
                                    country.value === field.value
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
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-1/2 space-y-0">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`City`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-row gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-3/4 space-y-0">
                  <FormLabel>Adress</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`Address`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="w-1/4 space-y-0">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`Zip Code`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-row items-center gap-4 pt-2 ">
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
              type="submit"
            >
              Create Restaurant
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  async function onSubmit(data: RestaurantFormValues) {
    setIsLoading(true);
    const restaurant = await createRestaurant(data, pathname);
    if (restaurant.error) {
      toast.error(restaurant.error);
    } else if (restaurant.restaurant?.id) {
      toast.success("Restaurant Created");
      setRestaurantId(restaurant.restaurant.id);
      onClose(); 
    }
    setIsLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={restaurantModal.isOpen}
        onSubmit={() => null}
        onClose={onClose}
        actionLabel={undefined}
        secondaryActionLabel={""}
        secondaryAction={() => null}
        body={bodyConent}
        title="Create Restaurant"
      />
    </>
  );
};

export default RestaurantModal;
