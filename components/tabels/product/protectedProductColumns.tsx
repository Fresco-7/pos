"use client";

import { Category, Product, Restrictions_Product, Side_Product, Stock } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoAnalytics } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ProtedtedColumns: ColumnDef<
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
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
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
          </div>
        );
      },
    },

  ];
