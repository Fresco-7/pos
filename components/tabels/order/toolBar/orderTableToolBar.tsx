"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CATEGORIES, ORDER_STATUS } from "@/config/products/options"
import { DataTableFacetedFilter } from "../../data-table-faceted-filter"
import { XIcon } from "lucide-react"
import { InputIcon } from "@/components/inputs/inputIcon"
import { Search } from "lucide-react"
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex md:flex-row flex-col items-center justify-center md:justify-start w-full">
      <div className="flex items-center space-x-2">
        <InputIcon
          icon={Search}
          placeholder="Filter Orders  ..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          iconClassName="text-black dark:text-white"
          className="w-72"
        />
      </div>
      <div className="flex items-center space-x-2 md:pl-2 justify-center mt-2 md:mt-0 ">
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Satus"
            options={ORDER_STATUS}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
