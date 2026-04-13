"use client";

import { Employee, Product, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, PencilIcon, TrashIcon } from "lucide-react";
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
import { deleteEmployee } from "@/actions/employee/deleteEmployee";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import useEmployeeEditModal from "@/components/hooks/useEditEmployeeModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<Employee & { user: User }>[] = [
  
  {
    accessorKey: "permissions",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <>
          <Button
            variant="ghost"
            onClick={column.getToggleSortingHandler()}
          >
            Permissions
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
      const txtValue = row.original.permissions;
      if (txtValue === "READ") {
        return (
          <span className="ml-5 font-medium text-green-600">{txtValue}</span>
        );
      }
      if (txtValue === "WRITE_READ") {
        return (
          <span className="ml-5 font-medium text-yellow-600">{txtValue}</span>
        );
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const pathname = usePathname();
      const editModal = useEmployeeEditModal();

      return (
        <div className="flex  justify-end gap-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => editModal.onOpen(employee)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Permissions</p>
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
                  <p>Delete Employee</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent className="shadow-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => await onDelete(employee, pathname)}
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

async function onDelete(employee: Employee, pathname: string) {
  const message = await deleteEmployee(employee.id, pathname);
  if (message.error) {
    toast.error(message.error);
  } else if (message.message) {
    toast.success(`deleted!`); ////
  }
}
