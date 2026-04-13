"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { deleteMenu } from "@/actions/menu/deleteMenu";
import { Menu, Menu_Product, Product } from "@prisma/client";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { IoAnalytics } from "react-icons/io5";

type MenuWithProduct = Menu & {
  Menu_Product: (Menu_Product & { product: Product })[];
};

export const ProtedtedColumns: ColumnDef<MenuWithProduct>[] = [
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
    accessorKey: "menu.price",
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
    header : '',
    accessorKey: 'status',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const menu = row.original;
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
        </div>
      );
    },
  },
];
