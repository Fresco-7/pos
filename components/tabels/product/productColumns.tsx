"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Category,
  Product,

  Restrictions_Product,
  Side_Product,
  Status,
  Stock,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import toast from "react-hot-toast";
import { deleteProduct } from "@/actions/products/deleteProduct";
import { usePathname, useRouter } from "next/navigation";
import useEditProductModal from "@/components/hooks/useEditProductModal";
import { IoAnalytics } from "react-icons/io5";
import { updateProductStatus } from "@/actions/products/updateProductStatus";

export const columns: ColumnDef<
  Product & {
    category: Category;
    Restrictions_Product: Restrictions_Product[];
    Side_Product: Side_Product[];
  }
>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="h-28 w-28">
            <img
              className="h-full w-full object-contain"
              alt={product.name}
              src={product.image}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
            >
              Name
              {isSorted === false && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
              {isSorted === 'asc' && (
                <ArrowDown className="ml-2 h-4 w-4" />
              )}
              {isSorted === 'desc' && (
                <ArrowUp className="ml-2 h-4 w-4" />
              )}

            </Button>
          </>
        );
      },
      cell: ({ row }) => {
        const name = row.original.name;
        return <span className="ml-5">{name}</span>;
      },
    },
    {
      accessorKey: "price",
      cell: ({ row }) => {
        const priceValue = row.original.price;
        return <span className="ml-10">{priceValue}€</span>;
      },
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
            >
              Price
              {isSorted === false && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
              {isSorted === 'asc' && (
                <ArrowDown className="ml-2 h-4 w-4" />
              )}
              {isSorted === 'desc' && (
                <ArrowUp className="ml-2 h-4 w-4" />
              )}

            </Button>
          </>
        );
      },
    },
    {
      accessorKey: "tax",
      header: "Tax",
      cell: ({ row }) => {
        const taxValue = row.original.tax;
        return <span>{taxValue}%</span>;
      },
    },
    {
      id: 'category',
      accessorKey: "category.description",
      header: "Category",
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'status',
      header: '',
      accessorKey: 'status',
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">{product.status}</Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent className="mr-14 w-36">
                <DropdownMenuLabel>Satus</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      updateStatus(product.id, product.restaurantId, 'ACTIVE');
                    }}
                    className="flex justify-between"
                    disabled={product.status === 'ACTIVE' ? true : false}
                  >
                    ACTIVE{" "}
                    {product.status === "ACTIVE" && (
                      <Check className="h-4 w-4 opacity-70" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      updateStatus(product.id, product.restaurantId, 'INACTIVE');
                    }}
                    className="flex justify-between"
                    disabled={product.status === 'INACTIVE' ? true : false}
                  >
                    INACTIVE{" "}
                    {product.status === "INACTIVE" && (
                      <Check className="h-4 w-4 opacity-70" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        const pathname = usePathname();
        const editModal = useEditProductModal();
        const router = useRouter();

        return (
          <div className="flex  justify-end gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/${product.restaurantId}/products/${product.id}`)
                    }
                  >
                    <IoAnalytics className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analytics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => editModal.onOpen(product)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="text-red-500 hover:text-red-700"
                        size="icon"
                        variant="outline"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialogContent className="shadow-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product, and related items (Menus).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => await onDelete(product, pathname)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },

  ];

async function onDelete(product: Product, pathname: string) {
  const message = await deleteProduct(product.id, pathname);
  if (message.error) {
    toast.error(message.error);
  } else if (message.message) {
    toast.success(`${product.name} deleted!`);
  }
}

async function updateStatus(
  productId: number,
  restaurantId: string,
  status: Status

) {
  const message = await updateProductStatus({ productId, restaurantId, status });
  if (typeof message != 'string') {
    toast.error(message.error);
  } else {
    toast.success('Status changed');
  }
}