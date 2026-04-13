"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CATEGORIES, STATUS } from "@/config/products/options"
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
    <div className="flex md:flex-row flex-col items-center justify-center md:justify-between w-full">
      <div className="flex flex-1 items-center space-x-2">
        <InputIcon
          icon={Search}
          placeholder="Search by name ..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          iconClassName="text-black dark:text-white"
          className="w-72"
        />
      </div>
    </div>
  )
}
