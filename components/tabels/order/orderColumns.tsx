"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Order, Restaurant, orderStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Download, History, MessageSquare, X } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { IconContext } from "react-icons";
import { FaCircle } from "react-icons/fa6";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { updateStatus } from "@/actions/order/updateStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbFileInvoice } from "react-icons/tb";

export const columns: ColumnDef<Order & { user: User | null }>[] = [
  {
    header: "Order",
    id: "name",
    accessorKey: 'customId',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center justify-start">
          {order.status != "DELETED" && order.status != 'COMPLETE' && order.status != 'CANCELED' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/${order.restaurantId}/order-mode/${order.id}`}
                  >
                    <Button size="icon" variant="link">
                      <FaArrowUpRightFromSquare className="h-3.5 w-3.5 text-blue-400" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open the order</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <span>{order.customId}</span>
        </div>
      );
    }
  },

  {
    header: "Employee/App",
    accessorKey: "user.name",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center justify-start">
          {order.user?.name ? (
            <span>{order.user?.name}</span>
          ) : (
            <div className="flex font-light justify-center items-center text-primary-foreground bg-primary rounded-sm px-1.5 p-1 h-full">
              APP
            </div>) 
          }

        </div>
      );
    }
  },
  {
    header: "Table",
    id: "table",
    accessorKey: "table",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const order = row.original;
      let status;
      if (order.status === "COMPLETE") {
        status = "text-green-500";
      }
      if (order.status === "KITCHEN") {
        status = "text-yellow-400";
      }
      if (order.status === "SERVED") {
        status = "text-blue-600";
      }
      if (order.status === "CANCELED") {
        status = "text-red-500";
      }
      if (order.status === "READY") {
        status = "text-blue-300";
      }
      if (order.status === "DELETED") {
        status = "dark:text-white text-black";
      }

      return (
        <div className="flex items-center justify-start gap-2">
          <span>
            <IconContext.Provider value={{ className: status }}>
              <div>
                <FaCircle />
              </div>
            </IconContext.Provider>
          </span>
          <span className="text-md ">{order.status}</span>
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
      const order = row.original;
      const router = useRouter();
      const pathname = usePathname();

      return (
        <div className="flex justify-end gap-2">
          {order.status != "DELETED" && order.status != 'COMPLETE' && order.status != 'CANCELED' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-14 w-36">
                <DropdownMenuLabel>Satus</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      updateOrderStatus(pathname, order.id, "KITCHEN")
                    }
                    className="flex justify-between"
                    disabled={order.status === "KITCHEN" ? true : false}
                  >
                    Kitchen{" "}
                    {order.status === "KITCHEN" && (
                      <Check className="h-4 w-4 opacity-70" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateOrderStatus(pathname, order.id, "READY")
                    }
                    disabled={order.status === "READY" ? true : false}
                  >
                    Ready to Serve{" "}
                    {order.status === "READY" && (
                      <Check className="h-4 w-4 opacity-70" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateOrderStatus(pathname, order.id, "SERVED")
                    }
                    disabled={order.status === "SERVED" ? true : false}
                  >
                    Served{" "}
                    {order.status === "SERVED" && (
                      <Check className="h-4 w-4 opacity-70" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateOrderStatus(pathname, order.id, "COMPLETE")
                    }
                  >
                    Complete{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateOrderStatus(pathname, order.id, "CANCELED")
                    }
                  >
                    Canceled{" "}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/${order.restaurantId}/orders/${order.id}`,
                      )
                    }
                    className="px-3 py-1"
                    variant={"outline"}
                  >
                    <History size={"16"} className={``} />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent style={{ zIndex: 999 }}>
                <p>Order History</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {order.invoice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Link href={`/dashboard/${order.restaurantId}/orders/${order.id}/invoice`}>
                      <Button

                        className="px-3 py-1"
                        variant={"outline"}
                      >
                        <TbFileInvoice size={"16"} className={``} />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent style={{ zIndex: 999 }}>
                  <p>Invoice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        </div>
      );
    },
  },
];

async function updateOrderStatus(
  pathname: string,
  orderId: string,
  status: orderStatus,
) {
  const message = await updateStatus(orderId, pathname, status);
  if (message.error) {
    toast.error(message.error);
  }
}
