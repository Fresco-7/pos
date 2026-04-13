"use client";
import { toast } from "react-hot-toast";
import { useState, useMemo, use } from "react";
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
import useProductModal from "../hooks/useProductModal";
import { InputIcon } from "@/components/inputs/inputIcon";
import {
  CATEGORIES,
  MAIN_COURSE_OPTIONS,
  DRIK_OPTIONS,
  DESERT_OPTIONS,
  APETIZER_OPTIONS,
  FAST_FOOD_OPTIONS,
} from "@/config/products/options";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import {  EuroIcon, Percent } from "lucide-react";
import { createProduct } from "@/actions/products/createProduct";
import { Textarea } from "../ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "../inputs/ImageUpload";
import { Side, Stock } from "@prisma/client";
import ComplementBox from "../inputs/SideBox";

enum STEPS {
  CATEGORY = 0,
  INFO = 1,
  SIDES = 2,
  IMAGE = 3,
  DESCRIPTION = 4,
}

const productFormSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, {
      message: "The name of the product must not be longer than 20 characters.",
    }),
  description: z
    .string({ required_error: "Please enter a description." })
    .max(128, { message: "Description must not be longer than 128 characters." })
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
    .string({ required_error: "Please provide a price for your product" })
    .regex(/^(?:\d{1,2}(?:\.\d{1,2})?|\d{1,2})$/, {
      message: "Enter a valid tax",
    }),
  image: z.string(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

const ProductModal = ({ params, sides }: { params: { id: string }, sides: (Side & {Stock : Stock | null})[] },) => {
  const { edgestore } = useEdgeStore();

  const id = params.id;
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    defaultValues: {
      additionalInformation: "",
      image: "https://gdf.coth.com/images/default_image.jpg",
    },
  });

  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      restrictions: [],
      sides: [],
    },
  });

  const [file, setFile] = useState<File>();
  const productModal = useProductModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [minimumError, setMinimumError] = useState<boolean>(false);
  const [infoArray, setInfoArray] = useState<string[]>([]);
  const category = watch("category");
  const restrictions = watch("restrictions");
  const sidesField = watch("sides");
  const [sidesFieldIds, setSidesFieldIds] = useState<number[]>([]);
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const setMultipleValues = (id: string, value: any) => {
    let updatedArray = [...infoArray];
    const index = updatedArray.indexOf(value);
    if (index !== -1) {
      updatedArray.splice(index, 1);
    } else {
      updatedArray.push(value);
    }

    setInfoArray(updatedArray);
    setValue(id, updatedArray, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const setMultipleValues2 = (id: string, value: any, value2: any) => {
    let updatedArray = [...sidesField];
    let updatedArray2 = [...sidesFieldIds];
    const index = sidesFieldIds.indexOf(value);
    if (index !== -1) {
      updatedArray.splice(index, 1);
      updatedArray2.splice(index, 1);
    } else {
      updatedArray.push({ value, value2 });
      updatedArray2.push(value);

    }
    setSidesFieldIds(updatedArray2);
    setValue(id, updatedArray, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    if (step === STEPS.INFO) {
      setInfoArray([""]);
      setValue("restrictions", [""], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    if (step === STEPS.DESCRIPTION) {
      form.reset();
      form.clearErrors();
    }
    if (step === STEPS.IMAGE && category === 4) {
      return setStep((value) => value - 2);
    }
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.CATEGORY) {
      if (category === "") {
        setMinimumError(true);
        return;
      }
      setMinimumError(false);
    }

    setStep((value) => value + 1);
  };

  const onClose = () => {
    form.reset();
    form.clearErrors();
    setValue("category", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("restrictions", [""], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("sides", [], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setSidesFieldIds([]);
    setFile(undefined);
    setInfoArray([]);
    setMinimumError(false);
    setStep(STEPS.CATEGORY);
    productModal.onClose();
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return undefined;
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY || step === STEPS.DESCRIPTION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyConent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Which of this discribe your product?"
        subtitle="Pick your category"
      />
      <div className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 ">
        {CATEGORIES.map((item) => (
          <div key={item.id} className="col-span-1">
            <CategoryInput
              onClick={() => setCustomValue("category", item.id)}
              selected={category === item.id}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
      <div className="mb-1">
        {minimumError && (
          <div className={`'text-red-500' mb-2 font-light text-red-500`}>
            {"For you to be able to product you need to select a category"}
          </div>
        )}
      </div>
    </div>
  );
  if (step === STEPS.INFO) {
    let info;
    if (category === 1) {
      info = MAIN_COURSE_OPTIONS;
    } else if (category === 2) {
      info = FAST_FOOD_OPTIONS;
    } else if (category === 3) {
      info = APETIZER_OPTIONS;
    } else if (category === 5) {
      info = DRIK_OPTIONS;
    } else if (category === 6) {
      info = DESERT_OPTIONS;
    }

    if (info != null) {
      bodyConent = (
        <div className="flex flex-col gap-4">
          <Heading
            title={`Give some information about your product`}
            subtitle="You can select more than one"
          />
          <div className="mb-5 grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
            {info.map((item) => (
              <div key={item.label} className="col-span-1">
                <CategoryInput
                  onClick={() => {
                    setMultipleValues("restrictions", item.id);
                  }}
                  selected={restrictions.includes(item.id)}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      onNext();
    }
  }
  if (step === STEPS.SIDES) {

    bodyConent = (
      <div className="flex flex-col gap-4">
        <Heading
          title={`Give some information about your product`}
          subtitle="You can select more than one"
        />
        <div className="mb-5 grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
          {sides.map((c) => (
            <div key={c.name} className="col-span-1">
              <ComplementBox
                stockValue={1}
                side={c}
                onClick={setMultipleValues2}
                selected={sidesFieldIds.includes(c.id)}
              />
            </div>
          ))}
        </div>
      </div>
    );

  }

  if (step === STEPS.IMAGE) {
    bodyConent = (
      <div className="flex flex-col gap-4">
        <Heading title="Attach a photo to your product" />
        <div className="mb-5 flex w-full flex-col">
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
      </div>
    );
  }
  if (step === STEPS.DESCRIPTION) {
    bodyConent = (
      <div className="flex flex-col gap-1">
        <Heading title={`Give us more information about your product`} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder={"Description"} {...field} />
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
                    <Textarea
                      placeholder="Additional Information"
                      className="resize-none"
                      {...field}
                    />
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
                  <FormItem className="w-1/2 space-y-0">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <InputIcon
                        icon={EuroIcon}
                        placeholder={"9.99"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This price already includes tax!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-0">
                    <FormLabel>Tax</FormLabel>
                    <FormControl>
                      <InputIcon icon={Percent} placeholder={"23"} {...field} />
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
                Create Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    if (file) {
      const res = await edgestore.myPublicImages.upload({
        file,
      });
      if (res.url) {
        data.image = res.url;
      }
    }

    const product = await createProduct(data, id, category, restrictions, sidesField);
    if (product.error) {
      toast.error(product.error);
    } else {
      toast.success(data.name);
    }

    onClose();
    setIsLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={productModal.isOpen}
        onSubmit={step != STEPS.DESCRIPTION ? () => onNext() : () => null}
        onClose={onClose}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        body={bodyConent}
        title="Create Product"
      />
    </>
  );
};

export default ProductModal;
