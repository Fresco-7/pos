"use client";

import { deleteApiKey } from "@/actions/settings/api/deleteApiKey";
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
import { Button } from "@/components/ui/button";
import { ApiKey } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { IconContext } from "react-icons";
import { FaCircle } from "react-icons/fa6";

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const api = row.original;
      return (
        <div className="flex items-center justify-start gap-2">
          <span>
            {api.status === "ACTIVE" ? (
              <IconContext.Provider value={{ className: "text-green-500" }}>
                <div>
                  <FaCircle />
                </div>
              </IconContext.Provider>
            ) : (
              <IconContext.Provider value={{ className: "text-red-600" }}>
                <div>
                  <FaCircle />
                </div>
              </IconContext.Provider>
            )}
          </span>
          <span>{api.name}</span>
        </div>
      );
    },
  },
  {
    header: "Key",
    id: "api_key",
    cell: ({ row }) => {
      const api = row.original;
      return (
        <div className="flex items-center justify-start gap-2">
          <span>{api.api_key.substring(0, 12)}...</span>
        </div>
      );
    },
  },
  {
    header: "Restaurant",
    accessorKey: "restaurant.name",
  },
  {
    header: "Created",
    id: "createdAt",
    cell: ({ row }) => {
      const apiCreatedAt = row.original.createdAt.toLocaleDateString();
      return (
        <div className="flex items-center justify-start gap-2">
          <span>{apiCreatedAt}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const api = row.original;
      const pathname = usePathname();

      return (
        <div className="flex  justify-end gap-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="text-red-500 hover:text-red-700"
                size="icon"
                variant="outline"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
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
                  onClick={async () => await onDelete(api, pathname)}
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

async function onDelete(api: ApiKey, pathname: string) {
  const message = await deleteApiKey(api.id, pathname);
  if (message.error) {
    toast.error(message.error);
  } else if (message.message) {
    toast.success(`${api.name} deleted!`);
  }
}
