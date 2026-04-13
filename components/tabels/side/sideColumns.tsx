"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Category,
  Side,
  Product,

  Restrictions_Product,
  Status,
  Stock,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
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
import { deleteSide } from "@/actions/side/deleteSide";
import useAddStockModal from "@/components/hooks/useAddStockModal";
import useEditAddStockModalModal from "@/components/hooks/useEditAddStockModal";

export const columns: ColumnDef<
  Side & {
    Stock: Stock | null
  }
>[] = [
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
      accessorKey: "Stock.stock",
      cell: ({ row }) => {
        const stockValue = row.original.Stock?.stock
        const row1 = row.original;
        
        let color = "";
        if (stockValue) {
          if (stockValue < 20) {
            color = "text-red-600";
          } else if (stockValue < 60) {
            color = "text-yellow-600";
          } else {
            color = "text-green-600";
          }
        }
        if (stockValue === 0) {
          color = "text-red-600";
        }

        return (
          <span className={`ml-10 font-semibold ${color}`}>{stockValue} {row1.Stock?.type}</span>
        );
      },
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
            >
              Stock
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
      id: "actions",
      cell: ({ row }) => {
        const router = useRouter();
        const side = row.original
        const modal = useAddStockModal();
        const editModal = useEditAddStockModalModal();

        return (
          <div className="flex  justify-end gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => modal.onOpen(side)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Stock</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/${side.restaurantId}/sides/${side.id}`)
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
                    onClick={() => editModal.onOpen(row.original)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Side</p>
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
                    This action cannot be undone. This will permanently side
                    and detatch all the products relationated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white side:bg-red-700"
                    onClick={async() => await onDelete(side)}
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

async function onDelete(side: Side) {
  const message = await deleteSide(side.id, side.restaurantId);
  if (message.error) {
    toast.error(message.error);
  } else if (message.message) {
    toast.success(`${side.name} deleted!`);
  }
}