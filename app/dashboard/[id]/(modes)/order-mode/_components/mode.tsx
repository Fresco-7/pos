"use client";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow, TableBody, Table } from "@/components/ui/table";
import {
  Category,
  Menu,
  Menu_Product,
  Order,
  Product,
  User,
} from "@prisma/client";
import { LogOut, Plus, Search, X } from "lucide-react";
import { Counter } from "./counter";
import { CardComponent } from "./card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EmptyState from "@/components/emptyStates/EmptyState";
import svgScr from '@/components/emptyStates/svgs/cartEmptyState.svg'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { createOrder } from "@/actions/order/createOrder";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


import { OrderCompenent } from "./orderComponent";

import { CgMenuBoxed } from "react-icons/cg";
import { InputIcon } from "@/components/inputs/inputIcon";
import { InputIconCommand } from "@/components/inputs/InputIconCommand";

const subitemSchema = z.object({
  name: z.string({ required_error: "Please enter a name." }),
  id: z.number({ required_error: "Please enter an id." }),
});

const itemSchema = z.object({
  name: z.string({ required_error: "Please enter a name." }),
  price: z.number({ required_error: "Please enter a price." }),
  id: z.number({ required_error: "Please enter an id." }),
  tax: z.number({ required_error: "Please enter a tax." }),
  type: z.enum(["Product", "Menu"]),
  subitems: z.array(subitemSchema).optional(),
  quantity: z
    .string({ required_error: "Please enter a quantity" })
    .default("0"),
});

const orderFormSchema = z.object({
  table: z.string({ required_error: "Please enter a table." }),
  observations: z.string().optional(),
  tin: z.string().optional(),
  email: z.string().optional(),
  userId: z.string({ required_error: "Provide userId" }),
  restaurantId: z.string({ required_error: "Provide restaurantId" }),
  items: z.array(itemSchema).refine((data) => data.length > 0, {
    message: "Please add at least one item.",
  }),
});

enum STEPS {
  DRINK = 0,
  DESERT = 1,
}

interface SubItemType {
  drink: subItemTypeValues | null;
}
export type subItemTypeValues = z.infer<typeof subitemSchema>;
export type OrderFormValues = z.infer<typeof orderFormSchema>;
export const OrderMode = ({
  menus,
  products,
  params,
  currentUser,
  orders,
}: {
  menus: (Menu & {
    Menu_Product: (Menu_Product & { product: Product & Category })[];
  })[];
  products: Product[];
  currentUser: User;
  params: { id: string };
  orders: Order[];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<SubItemType>({ drink: null });
  const [step, setStep] = useState(STEPS.DRINK);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: "onChange",
    defaultValues: {
      restaurantId: params.id,
      userId: currentUser.id,
      //items: [{ 'id': 1, 'name': 'aa', 'price': 1.1, 'quantity': '1', 'tax': 1.1, 'type': 'Product' }]
    },
  });
  const itemsField = form.watch("items");

  const handleAddProduct = (product: Product) => {
    const currentItems = form.getValues("items") || [];
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      type: "Product" as const,
      tax: product.tax,
      quantity: "1",
    };

    form.setValue("items", [...currentItems, newItem], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleAddMenu = (menu: (Menu & { Menu_Product: (Menu_Product & { product: Product & Category })[]; })) => {
    const currentItems = form.getValues("items") || [];
    const newSubItems = menu.Menu_Product.map((item) => {
      return {
        name: item.product.name,
        id: item.product.id
      }
    });

    const newItem = {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      type: "Menu" as const,
      tax: menu.tax,
      quantity: "1",
      subitems: newSubItems
    };



    form.setValue("items", [...currentItems, newItem], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleAddMenuSubitem = (menu: (Menu & { Menu_Product: (Menu_Product & { product: Product & Category })[]; }), product: Product) => {
    const currentItems = form.getValues("items") || [];
    let newSubItems: ({ id: number, name: string })[] = []
    if (menu.optionalDrink) {
      newSubItems = menu.Menu_Product
        .filter(item => item.product.categoryId != 5)
        .map(item => ({
          name: item.product.name,
          id: item.product.id
        }));
    }

    if (menu.optionalDesert) {
      newSubItems = menu.Menu_Product
        .filter(item => item.product.categoryId != 6)
        .map(item => ({
          name: item.product.name,
          id: item.product.id
        }));
    }

    const newSubItem = {
      name: product.name,
      id: product.id,
    };

    newSubItems.push(newSubItem);

    const newItem = {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      type: "Menu" as const,
      tax: menu.tax,
      quantity: "1",
      subitems: newSubItems,
    };

    form.setValue("items", [...currentItems, newItem], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleAddMenuSubitems = (
    menu: (Menu & { Menu_Product: (Menu_Product & { product: Product & Category })[]; }),
    desert: Product,
    drink: subItemTypeValues | null,
  ) => {
    const currentItems = form.getValues("items") || [];
    if (!drink) {
      toast.error("No drink Selected");
      return;
    }


    const newSubItem = {
      name: desert.name,
      id: desert.id,
    };
    let newSubItems: ({ id: number, name: string })[] = []
    newSubItems = menu.Menu_Product
      .filter(item => item.product.categoryId != 6 && item.product.categoryId != 5)
      .map(item => ({
        name: item.product.name,
        id: item.product.id
      }));

    newSubItems.push(drink)
    newSubItems.push(newSubItem)



    const newItem = {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      type: "Menu" as const,
      tax: menu.tax,
      quantity: "1",
      subitems: newSubItems,
    };

    form.setValue("items", [...currentItems, newItem], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleCounterChange = (index: number, newValue: string) => {
    const currentItems = form.getValues("items") || [];
    currentItems[index].quantity = newValue;
    form.setValue("items", currentItems);
  };

  const handleRemove = (index: number) => {
    const currentItems = form.getValues("items") || [];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    form.setValue("items", updatedItems);
  };

  const calculateTotal = () => {
    if (!itemsField) {
      return { total: 0, tax: 0 };
    }
    const totalBeforeTax = itemsField.reduce(
      (acc, item) => acc + item.price * parseFloat(item.quantity),
      0,
    );
    const total = totalBeforeTax;
    const tax =
      itemsField.reduce((acc, item) => acc + item.tax, 0) / itemsField.length;

    return { total, tax };
  };

  const handleOpen = () => {
    setItems({ drink: null });
    setStep(STEPS.DRINK);
  };
  const handleOpenConfirmModal = () => {
    form.clearErrors("table");
  };

  async function onSubmit(data: OrderFormValues) {
    setIsLoading(true);

    const message = await createOrder(data);
    if (message.error) {
      toast.error(message.error);
    }
    if (message.message?.order) {
      toast.success("Order Created");
      router.push(`/dashboard/${params.id}/order-mode/${message.message.order?.id}`);
    }
    setIsLoading(false);
  }

  const { total, tax } = calculateTotal();
  return (
    <div className="flex h-screen flex-row ">
      <div className="flex w-5/6 flex-col px-1.5 lg:w-4/6 lg:items-center">
        <div className="flex flex-row w-full justify-center gap-1 p-6 xl:gap-3">
          <Button
            variant={"outline"}
            className="w-1/6 shadow-sm"
            onClick={() => router.push(`/dashboard/${params.id}`)}
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="ml-1">Dashboard</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"outline"} className="w-1/6 shadow-sm">
                <CgMenuBoxed className="h-5 w-5" />
                <span className="ml-1">Orders</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              style={{ zIndex: 999 }}
              side={"left"}
              className=" overflow-y-scroll"
            >
              <SheetHeader>
                <SheetTitle>Orders</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 pt-3">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderCompenent
                      params={params}
                      order={order}
                      key={order.id}
                    />
                  ))
                ) : (
                  <span>No orders</span>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant={"outline"}
            onClick={() => form.reset()}
            className="w-1/6 shadow-sm"
          >
            <Plus className="h-4 w-4 text-blue-500" />
            <span className="ml-1">New Order</span>
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 overflow-y-scroll pb-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <button key={product.id} onClick={() => handleAddProduct(product)}>
              <CardComponent product={product} />
            </button>
          ))}
          {menus.map((menu) => {
            if (menu.optionalDesert || menu.optionalDrink) {
              if (menu.optionalDesert && menu.optionalDrink) {
                return (
                  <Dialog key={menu.id} onOpenChange={handleOpen}>
                    <DialogTrigger asChild>
                      <button key={menu.id}>
                        <CardComponent menu={menu} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[425px] overflow-auto bg-white sm:max-w-[630px] xl:max-h-[625px]">
                      {step === STEPS.DRINK && (
                        <div className="grid gap-4 px-1 py-4">
                          <div className="w-full">
                            <h1 className="mb-5 flex items-center justify-center text-3xl font-bold">
                              Drink
                            </h1>
                            <div className="grid grid-cols-3 gap-2">
                              {menu.Menu_Product.map((menu_product) => {
                                if (
                                  menu.optionalDrink &&
                                  menu_product.product.categoryId === 5
                                ) {
                                  return (
                                    <button
                                      onClick={() => {
                                        setItems({
                                          drink: {
                                            id: menu_product.productId,
                                            name: menu_product.product.name,
                                          },
                                        });
                                        setStep(STEPS.DESERT);
                                      }}
                                      key={menu_product.productId}
                                    >
                                      <CardComponent
                                        product={menu_product.product}
                                      />
                                    </button>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      {step === STEPS.DESERT && (
                        <div className="grid gap-4 px-1 py-4">
                          <div className="w-full">
                            <h1 className="mb-5 flex items-center justify-center text-3xl font-bold">
                              Desert
                            </h1>
                            <div className="grid grid-cols-3 gap-2">
                              {menu.Menu_Product.map((menu_product) => {
                                if (
                                  menu.optionalDesert &&
                                  menu_product.product.categoryId === 6
                                ) {
                                  return (
                                    <DialogClose key={menu_product.productId}>
                                      <button
                                        onClick={() => {
                                          handleAddMenuSubitems(
                                            menu,
                                            menu_product.product,
                                            items.drink,
                                          );
                                        }}
                                      >
                                        <CardComponent
                                          product={menu_product.product}
                                        />
                                      </button>
                                    </DialogClose>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                );
              }

              return (
                <Dialog key={menu.id}>
                  <DialogTrigger asChild>
                    <button key={menu.id}>
                      <CardComponent menu={menu} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[425px] overflow-auto bg-white sm:max-w-[630px] xl:max-h-[625px]">
                    <div className="grid gap-4 px-1 py-4">
                      <div className="w-full">
                        <h1 className="mb-5 flex items-center justify-center text-3xl font-bold">
                          {menu.optionalDrink ? "Drink" : "Desert"}
                        </h1>
                        <div className="grid grid-cols-3 gap-2">
                          {menu.Menu_Product.map((menu_product) => {
                            if (
                              (menu.optionalDrink &&
                                menu_product.product.categoryId === 5) ||
                              (menu.optionalDesert &&
                                menu_product.product.categoryId === 6)
                            ) {
                              return (
                                <DialogClose key={menu_product.productId}>
                                  <button
                                    onClick={() =>
                                      handleAddMenuSubitem(
                                        menu,
                                        menu_product.product,
                                      )
                                    }
                                  >
                                    <CardComponent
                                      product={menu_product.product}
                                    />
                                  </button>
                                </DialogClose>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }
            return (
              <button key={menu.id} onClick={() => handleAddMenu(menu)}>
                <CardComponent menu={menu} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex w-2/6 flex-col bg-gray-100">
        <div className="flex h-full flex-col">
          <div className="bg-card flex-grow overflow-y-auto">
            {itemsField && itemsField.length > 0 ? (
              <Table>
                <TableBody>
                  {itemsField.map((item, index) => (
                    <React.Fragment key={index}>
                      <TableRow className="dark:hover:bg-muted-foreground/5 w-full flex-col gap-0 p-0 hover:bg-gray-200 ">
                        <TableCell
                          className={`flex ${item.subitems ? "pb-0" : ""}`}
                        >
                          <div className="flex w-2/5 items-center justify-start">
                            <span>{item.name}</span>
                          </div>
                          <div className="flex w-2/5 items-center justify-center font-medium">
                            <Counter
                              value={item.quantity}
                              onChangeProp={(newValue) =>
                                handleCounterChange(index, newValue)
                              }
                              onRemove={() => handleRemove(index)}
                            />
                          </div>
                          <div className="flex w-1/5 items-center justify-end font-semibold">
                            <span>{item.price.toFixed(2)}€</span>
                          </div>
                          <div className="flex w-2/5 items-center justify-end gap-3">
                            <span
                              className="w-4 cursor-pointer"
                              onClick={() => handleRemove(index)}
                            >
                              <X className="h-5 w-5 text-black/80 transition-all hover:text-black dark:text-white/80 dark:hover:text-white" />
                            </span>
                          </div>
                        </TableCell>
                        {item.subitems?.map((subitem, subIndex) => (
                          <TableCell
                            key={`subitem_${index}_${subIndex}`}
                            className="flex"
                          >
                            <div className="flex w-full items-center pl-10 pt-0">
                              <span>{subitem.name}</span>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="w-full flex flex-col justify-center items-center h-full">
                <div className="w-2/3 ">
                  <EmptyState
                    src={svgScr}
                    title="Oops!"
                    text="Seems the cart is empty!"
                    
                  />
                </div>
              </div>
            )}
          </div>
          {itemsField && itemsField.length > 0 && (
            <>
              <div className="bg-card border-t">
                <Form {...form}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item1">
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <span>Observations</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <FormField
                          control={form.control}
                          name="observations"
                          render={({ field }) => (
                            <FormItem className="">
                              <FormControl>
                                <Textarea
                                  className="bg-background"
                                  placeholder="Observations"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Form>
              </div>
              <div className="bg-card border-t-1 flex flex-col p-4">
                <div className="mb-2 flex justify-between">
                  <p>Tax</p>
                  <p>{tax.toFixed(2)}%</p>
                </div>
                <div className="mb-4 flex justify-between font-bold">
                  <p className=" fontb">Total</p>
                  <p>{total.toFixed(2)}€</p>
                </div>
                <div className="flex space-x-4">
                  <Dialog onOpenChange={handleOpenConfirmModal}>
                    <DialogTrigger asChild>
                      <Button className="flex-grow " variant="default">
                        Confirm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card max-h-[425px] overflow-auto sm:max-w-[630px] xl:max-h-[625px]">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="mt-2.5 space-y-2"
                        >
                          <div className="flex flex-col gap-2">
                            <h1 className="flex items-center justify-center pb-0 text-3xl font-bold">
                              Order
                            </h1>
                            <h1 className="text-md mb-5 flex items-center justify-center text-gray-500">
                              Summary
                            </h1>
                          </div>

                          <FormField
                            control={form.control}
                            name="table"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormLabel>Table</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Table"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex flex-col gap-1">
                            {itemsField?.map((item, index) => (
                              <div
                                key={index}
                                className="flex w-full flex-col gap-0 p-0 "
                              >
                                <div className="flex justify-between">
                                  <div className="flex w-full justify-start">
                                    <span>{item.name}</span>
                                  </div>
                                  <div className="flex w-full justify-end gap-3">
                                    <span className="flex items-center justify-between">
                                      {item.price.toFixed(2)}€

                                    </span>
                                    <span className="flex items-center font-semibold justify-between">
                                      qnt:{item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  {item.subitems?.map((subitem) => (
                                    <span key={subitem.id} className="flex w-full items-center pl-10 pt-0">
                                      {subitem.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="flex w-full justify-between">
                              <span className="font-bold">Total</span>
                              <div className="flex items-center gap-3">
                                <span className="font-bold">
                                  {total.toFixed(2)}€
                                </span>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="flex w-full justify-center">
                            <DialogClose className="w-full">
                              <Button
                                className="w-full"
                                disabled={isLoading}
                                isLoading={isLoading}
                                type="submit"
                              >
                                Confirm
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
