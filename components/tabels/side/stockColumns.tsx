"use client";
import { Stock_Log } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<
  Stock_Log
>[] = [
    {
      accessorKey: 'stock',
      cell: ({ row }) => {
        const stockValue = row.original.stock
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
          <span className={`ml-10 font-semibold ${color}`}>+{stockValue}</span>
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
      accessorKey: 'suplier',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        return (
          <>
            <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
              Suplier
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
        const name = row.original.suplier;
        return <span className="ml-5">{name}</span>;
      },
    },
    {
      id: "date",
      accessorKey: "date",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
            >
              Date
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
        const orderCreatedAt = row.original.date.toLocaleDateString();
        return (
          <div className="flex items-center justify-start gap-2">
            <span>{orderCreatedAt}</span>
          </div>
        );
      },

    },
    {
      id: "cost",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <>
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
            >
              Cost
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
        const original = row.original;
        const cost = original.cost;
        const stock = original.stock;
        return (
          <div className="flex items-center justify-start gap-2">
            <span>{(cost * stock).toFixed(2)}€</span>
          </div>
        );
      },

    },
  ];
