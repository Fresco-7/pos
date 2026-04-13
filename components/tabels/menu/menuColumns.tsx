"use client";

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
import { deleteMenu } from "@/actions/menu/deleteMenu";
import { Menu, Menu_Product, Product, Status } from "@prisma/client";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import useEditMenuModal from "@/components/hooks/useEditMenuModal";
import { IoAnalytics } from "react-icons/io5";
import { updateMenuStatus } from "@/actions/menu/updateMenuStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export type MenuWithProduct = Menu & {
  Menu_Product: (Menu_Product & { product: Product })[];
};

export const columns: ColumnDef<MenuWithProduct>[] = [
  {
    accessorKey: "menu.image",
    header: "Image",
    cell: ({ row }) => {
      const menu = row.original;

      return (
        <div className="h-28 w-28">
          <img
            className="h-full w-full object-contain"
            alt={menu.name}
            src={menu.image}
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
      return <span className="ml-5">{priceValue}€</span>;
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
    accessorKey: "menu.discount",
    header: "Disccount",
    cell: ({ row }) => {
      const discountValue = row.original.discount;
      return <span>{discountValue}%</span>;
    },
  },

  {
    accessorKey: "menu.tax",
    header: "Tax",
    cell: ({ row }) => {
      const taxValue = row.original.tax;
      return <span>{taxValue}%</span>;
    },
  },
  {
    id: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.original.Menu_Product;
      return (
        <div className="flex h-28 w-28 overflow-x-auto">
          {products.map((Menu_Product, index) => (
            <div
              key={index}
              className={`h-full w-28 flex-shrink-0 ${index === 0 ? "" : "ml-2"}`}
            >
              <img
                defaultValue={Menu_Product.product.name}
                className="h-full w-full object-contain"
                alt={Menu_Product.product.name}
                src={Menu_Product.product.image}
              />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'status',
    header : "",
    accessorKey: 'status',
    cell: ({ row }) => {
      const menu = row.original;

      return (
        <div className="flex justify-end gap-2">
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">{menu.status}</Button>
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
                    updateStatus(menu.id, menu.restaurantId, 'ACTIVE');
                  }}
                  className="flex justify-between"
                  disabled={menu.status === 'ACTIVE' ? true : false}
                >
                  ACTIVE{" "}
                  {menu.status === "ACTIVE" && (
                    <Check className="h-4 w-4 opacity-70" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    updateStatus(menu.id, menu.restaurantId, 'INACTIVE');
                  }}
                  className="flex justify-between"
                  disabled={menu.status === 'INACTIVE' ? true : false}
                >
                  INACTIVE{" "}
                  {menu.status === "INACTIVE" && (
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
      const menu = row.original;
      const router = useRouter();
      const pathname = usePathname();
      const editModal = useEditMenuModal();

      return (
        <div className="flex justify-end gap-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    router.push(`/dashboard/${menu.restaurantId}/menus/${menu.id}`)
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
                  onClick={() => editModal.onOpen(menu)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Menu</p>
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
                  <p>Delete Menun</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent className="shadow-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your menu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => await onDelete(menu, pathname)}
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

async function onDelete(menu: Menu, pathname: string) {
  const message = await deleteMenu(menu.id, pathname);
  if (message.error) {
    toast.error(message.error);
  } else if (message.message) {
    toast.success(`${menu.name} deleted!`);
  }
}


async function updateStatus(
  menuId: number,
  restaurantId: string,
  status: Status

) {
  const message = await updateMenuStatus({ menuId, restaurantId, status });
  if (typeof message != 'string') {
    toast.error(message.error);
  } else {
    toast.success('Status changed');
  }
}