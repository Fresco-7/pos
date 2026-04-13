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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProtectedColumns: ColumnDef<
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
  ];
