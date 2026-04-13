"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Restaurant } from "@prisma/client";
import { CheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COUNTRYS } from "@/config";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { updateRestaurant } from "@/actions/settings/restaurant/updateRestaurant";
import { SingleImageDropzone } from "@/components/inputs/ImageUpload";
import { useEdgeStore } from "@/lib/edgestore";

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
  image: z.string().nullable(),
});

export type restaurantFormValues = z.infer<typeof restaurantFormSchema>;

export function RestaurantForm({ restaurant }: { restaurant: Restaurant }) {
  const { edgestore } = useEdgeStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [file, setFile] = useState<File | null | string | undefined>(restaurant.image);

  const restaurantDefaultValues: Partial<restaurantFormValues> = {
    name: restaurant.name,
    address: restaurant.address,
    country: restaurant.country,
    zipCode: restaurant.zipCode,
    city: restaurant.city,
    image: restaurant.image,
  };

  const form = useForm<restaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: restaurantDefaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: restaurantFormValues) {
    setIsLoading(true);
    if (typeof file != "string" && file != undefined && file != null) {
      const res = await edgestore.myPublicImages.upload({
        file,
      });
      if (res.url) {
        data.image = res.url;
      }
    }

    if (file === undefined) {
      data.image = null;
    }

    const message = await updateRestaurant(data, restaurant.id);
    if (message.error) {
      toast.error(message.error);
    } else {
      toast.success("Restaurant Updated");
    }

    setIsLoading(false);
  }

  let restaurantForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex w-full justify-center pb-8 md:hidden">
            <SingleImageDropzone
              avatarBig
              width={100}
              height={100}
              value={file}
              className="relative mt-5 h-72 w-72 rounded-full"
              onChange={(file) => {
                setFile(file);
              }}
            />
          </div>
          <div className="w-full space-y-6 pr-5 lg:w-fit">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={`Restaurant Name`} />
                  </FormControl>
                  <FormDescription>
                    This is your restaurant name. It will be displayed on the
                    mobile app , and you can always change it!
                  </FormDescription>
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
                                  <span key={country.value} className="w-8">
                                    {" "}
                                    <country.icon className="mr-2 rounded-sm " />{" "}
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
                      {/* Get from the db the icon if its efuro, dollar etc */}
                      <Input {...field} placeholder={`Zip Code`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full md:w-fit"
              type="submit"
            >
              Update Restaurant
            </Button>
          </div>
          <div className="hidden w-full justify-start pl-10 md:flex md:flex-1">
            <SingleImageDropzone
              avatarBig
              width={100}
              height={100}
              value={file}
              className="relative mt-5 h-72 w-72 rounded-full"
              onChange={(file) => {
                setFile(file);
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );

  return <>{restaurantForm}</>;
}
