"use client";

import { useState, useMemo, useEffect } from "react";
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
import Modal from "@/components/modals/Modal";
import { Input } from "@/components/ui/input";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { InputIcon } from "@/components/inputs/inputIcon";
import { useForm } from "react-hook-form";
import { CupSodaIcon, EuroIcon, IceCream, Percent } from "lucide-react";
import { Product } from "@prisma/client";
import ProductBox from "@/components/inputs/ProductInput";
import { createMenu } from "@/actions/menu/createMenu";
import toast from "react-hot-toast";
import React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "@/components/inputs/ImageUpload";
import CategoryInput from "@/components/inputs/CategoryInput";
import useEditMenuModal from "@/components/hooks/useEditMenuModal";
import { updateMenu } from "@/actions/menu/updateMenu";
import { Textarea } from "@/components/ui/textarea";

enum STEPS {
  PRODUCTS_SELECTION = 0,
  PRODUCTS_OPTIONAL = 1,
  IMAGE = 2,
  DESCRIPTION = 3,
}
const menuFormSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, {
      message: "The name of the menu must not be longer than 20 characters.",
    }),
  description: z
    .string({ required_error: "Please enter a description." })
    .max(64, { message: "Description must not be longer than 64 characters." })
    .min(12, {
      message: "Description must be good, enter at least 12 characters ",
    }),
  additionalInformation: z.string().max(64, {
    message: "The additional information mustnt be longer than 64 characters.",
  }),
  price: z
    .string({ required_error: "Please provide a price for your product" })
    .regex(/^\d+([\,]\d+)*([\.]\d+)?$/, { message: "Enter a valid price" }),
  tax: z
    .string({ required_error: "Please provide a price for your menu" })
    .regex(/^(?:\d{1,2}(?:\.\d{1,2})?|\d{1,2})$/, {
      message: "Enter a valid tax",
    }),
  discount: z
    .string({ required_error: "Please provide a price discount for your menu" })
    .regex(/^(?!0(?:\.0{1,2})?$)\d{1,2}(?:\.\d{1,2})?$/, {
      message: "Enter a valid discount",
    }),
  products: z.array(z.number()),
  image: z.string(),
  drink: z.boolean(),
  desert: z.boolean(),
  id: z.number(),
});

export type MenuEditFormValues = z.infer<typeof menuFormSchema>;

const EditMenuModal = ({
  products,
  params,
}: {
  products: Product[];
  params: { id: string };
}) => {
  const id = params.id;
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | undefined | string>();
  const [minimumError, setMinimumError] = useState<boolean>(false);
  const [minimumError2, setMinimumError2] = useState<boolean>(false);

  const form = useForm<MenuEditFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      products: [],
    },
  });

  const menuModal = useEditMenuModal();
  const menu = menuModal.menu;

  useEffect(() => {
    if (menu != null) {
      form.setValue("additionalInformation", menu.additionalInformation);
      form.setValue("description", menu.description);
      form.setValue("desert", menu.optionalDesert);
      form.setValue("discount", menu.discount.toString());
      form.setValue("drink", menu.optionalDrink);
      form.setValue("name", menu.name);
      form.setValue("price", menu.price.toString());
      form.setValue("image", menu.image);
      form.setValue("tax", menu.tax.toString());
      form.setValue("id", menu.id);
      const arr = menu.Menu_Product.map((m) => m.productId);
      form.setValue("products", arr);
      setFile(menu.image);
    }
  }, [menu]);

  const [step, setStep] = useState(STEPS.PRODUCTS_SELECTION); // MAke selection
  const [isLoading, setIsLoading] = useState(false);

  const productsField = form.watch("products");
  const drinkField = form.watch("drink", false);
  const desertField = form.watch("desert", false);

  const setMultipleValues = (value: number) => {
    let updatedArray = form.getValues("products");
    const index = updatedArray.indexOf(value);

    if (index !== -1) {
      updatedArray.splice(index, 1);
    } else {
      updatedArray.push(value);
    }

    form.setValue("products", updatedArray, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    if (step === STEPS.DESCRIPTION) {
      form.reset();
      form.clearErrors();
    }
    if (
      step === STEPS.IMAGE &&
      (drinkField === false && desertField === false) === true
    ) {
      return setStep((value) => value - 2);
    }
    form.setValue("products", [], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    return setStep((value) => value - 1);
  };

  const nextStepProductSelection = () => {
    setMinimumError(false);
    setStep((value) => value + 1);
  };

  const onNext = () => {
    if (step === STEPS.PRODUCTS_SELECTION) {
      if (drinkField === true && desertField === true) {
        return nextStepProductSelection();
      }

      if (
        (drinkField === true || desertField === true) === true &&
        productsField.length >= 1
      ) {
        return nextStepProductSelection();
      }

      if (productsField.length >= 2) {
        setMinimumError(false);
        setStep((value) => value + 2);
        return;
      }

      setMinimumError(true);
      return;
    }
    if (step === STEPS.PRODUCTS_OPTIONAL) {
      if (drinkField === true) {
        const hasProductWithDrink = products.some((product) => {
          return (
            product.categoryId === 5 &&
            form.getValues("products").includes(product.id)
          );
        });

        if (hasProductWithDrink === false) {
          return setMinimumError2(true);
        }
      }

      if (desertField === true) {
        const hasProductWithDesert = products.some((product) => {
          return (
            product.categoryId === 6 &&
            form.getValues("products").includes(product.id)
          );
        });
        if (!hasProductWithDesert) {
          return setMinimumError2(true);
        }
      }
      setMinimumError2(false);
    }
    setStep((value) => value + 1);
  };

  const onClose = () => {
    setMinimumError(false);
    setMinimumError2(false);
    setFile(undefined);
    form.reset();
    form.clearErrors();
    setStep(STEPS.PRODUCTS_SELECTION);
    menuModal.onClose();
  };

  const actionLabel = useMemo(() => {
    if (
      step === STEPS.IMAGE ||
      step === STEPS.DESCRIPTION ||
      step === STEPS.PRODUCTS_OPTIONAL ||
      products.length < 2
    ) {
      return undefined;
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.PRODUCTS_SELECTION || step === STEPS.DESCRIPTION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="mb-2 flex flex-col gap-4">
      <Heading
        title={`What are the products of your menu`}
        subtitle="You can select more than one"
      />
      {products.length >= 2 ? (
        <>
          <div className="flex w-full justify-center gap-3">
            <div className="w-full">
              <CategoryInput
                onClick={
                  drinkField === true
                    ? () => {
                        form.setValue("drink", false);
                      }
                    : () => {
                        form.setValue("drink", true);
                        form.setValue("products", [], {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }
                }
                selected={drinkField === true}
                label={"Drink"}
                icon={CupSodaIcon}
              />
            </div>
            <div className="w-full">
              <CategoryInput
                onClick={
                  desertField === true
                    ? () => {
                        form.setValue("desert", false);
                      }
                    : () => {
                        form.setValue("desert", true);
                        form.setValue("products", [], {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }
                }
                selected={desertField === true}
                label={"Desert"}
                icon={IceCream}
              />
            </div>
          </div>
          <div className="mb-2 grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto pt-5 md:grid-cols-2 ">
            {products.map((item) => {
              if (item.categoryId === 5 && drinkField === true) {
                return;
              }

              if (item.categoryId === 6 && desertField === true) {
                return;
              }

              return (
                <div key={item.id} className="col-span-1">
                  <ProductBox
                    onClick={(product) => {
                      setMultipleValues(product.id);
                    }}
                    selected={productsField.includes(item.id)}
                    product={item}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          Image ilustrating no products (need more than 2 to create a product)
        </>
      )}
      {minimumError && (
        <div className={`'text-red-500' mb-2 font-light text-red-500`}>
          {
            "For you to be able to create a menu you need at least to select two products"
          }
        </div>
      )}
    </div>
  );
  if (step === STEPS.PRODUCTS_OPTIONAL) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Selectable items"
          subtitle="What items do you want to be selectable"
        />
        {products.map((item) => {
          if (item.categoryId === 5 && drinkField === true) {
            return (
              <div key={item.id} className="col-span-1 flex gap-2">
                <ProductBox
                  onClick={(product) => {
                    setMultipleValues(product.id);
                  }}
                  selected={productsField.includes(item.id)}
                  product={item}
                />
              </div>
            );
          }

          if (item.categoryId === 6 && desertField === true) {
            return (
              <div key={item.id} className="col-span-1">
                <ProductBox
                  onClick={(product) => {
                    setMultipleValues(product.id);
                  }}
                  selected={productsField.includes(item.id)}
                  product={item}
                />
              </div>
            );
          }
        })}
        {minimumError2 && (
          <div className={`'text-red-500' mb-2 font-light text-red-500`}>
            {
              "For you to be able to go next need at least to select a optinal product for each category that you selected before!"
            }
          </div>
        )}
        <div className="flex w-full flex-row items-center gap-4 pt-2 ">
          <Button variant={"outline"} onClick={onBack}>
            Back
          </Button>
          <Button className="w-full" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGE) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Attach a photo to your product" />
        <div className="flex w-full flex-col ">
          <SingleImageDropzone
            width={100}
            height={100}
            value={file}
            className="relative w-full"
            onChange={(file) => {
              setFile(file);
            }}
          />
        </div>
        <div className="flex w-full flex-row items-center gap-4 pt-2 ">
          <Button variant={"outline"} onClick={onBack}>
            Back
          </Button>
          <Button className="w-full" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="gap- flex flex-col">
        <Heading title={`Give us more information about your Menu`} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Menu Name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"This menu has 169kcal ..."}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalInformation"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea placeholder={"Additional Info"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full flex-row gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <InputIcon
                        icon={EuroIcon}
                        placeholder={"26.99"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This price already includes tax and the discount!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Tax</FormLabel>
                    <FormControl>
                      <InputIcon icon={Percent} placeholder={"23"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="w-1/3 space-y-1">
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <InputIcon
                        icon={Percent}
                        placeholder={"17%"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full flex-row items-center gap-4 pt-2 ">
              <Button
                className=""
                disabled={isLoading}
                isLoading={isLoading}
                variant={"outline"}
                onClick={() => onBack()}
              >
                Back
              </Button>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                className="mt-1 w-full"
                type="submit"
              >
                Edit Menu
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  async function onSubmit(data: MenuEditFormValues) {
    setIsLoading(true);
    if (typeof file != "string" && typeof file != "undefined") {
      const res = await edgestore.myPublicImages.upload({
        file,
      });
      if (res.url) {
        data.image = res.url;
      }
    }

    const menu = await updateMenu(data);
    if (menu.error) {
      toast.error(menu.error);
    } else if (menu.menu?.id) {
      toast.success(menu.menu?.name);
    }
    onClose();
    setIsLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={menuModal.isOpen}
        onSubmit={
          step === STEPS.PRODUCTS_SELECTION ? () => onNext() : () => null
        }
        onClose={onClose}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.DESCRIPTION ? onBack : undefined}
        body={bodyContent}
        title="Edit Menu"
      />
    </>
  );
};

export default EditMenuModal;
