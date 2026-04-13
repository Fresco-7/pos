"use client";
import { updateStatus } from "@/actions/order/updateStatus";
import getCurrentUser from "@/actions/users/getCurrentUser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Item_Menu_Order,
  Item_Menu_Product_Order,
  Item_Product_Order,
  Menu,
  Product,
  orderStatus,
} from "@prisma/client";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

interface extraItemMenuOrder extends Item_Menu_Product_Order {
  product: Product;
}

interface extraMenuOrder extends Item_Menu_Order {
  menu: Menu;
  Item_Menu_Product_Order: extraItemMenuOrder[];
}

const socket = io("http://localhost:8080");
const Kitchen = ({ params }: { params: { id: string } }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    setIsLoading(true);
    socket.emit(
      "getOrders",
      { restaurantId: `${params.id}` },
      (response: any) => {
        setOrders(response);
      },
    );
    socket.on("refreshOrder", () => {
      socket.emit(
        "getOrders",
        { restaurantId: `${params.id}` },
        (response: any) => {
          setOrders(response);
        },
      );
    });

    setIsLoading(false);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-72 w-72 animate-spin" />
      </div>
    );
  }

  const timeAgo = (orderDate: Date): { time: string; color: string } => {
    const seconds: number = Math.floor(
      (currentDateTime.getTime() - orderDate.getTime()) / 1000,
    );
    let color = "bg-green-500";
    if (seconds >= 1200) {
      color = "bg-red-500";
    } else if (seconds >= 600) {
      color = "bg-yellow-500";
    }

    if (seconds < 60) {
      return {
        time: `${seconds} ${seconds === 1 ? "second" : "seconds"}`,
        color,
      };
    }
    const minutes: number = Math.floor(seconds / 60);
    if (minutes < 60) {
      return {
        time: `${minutes} ${minutes === 1 ? "minute" : "minutes"}`,
        color,
      };
    }
    const hours: number = Math.floor(minutes / 60);
    return { time: `${hours} ${hours === 1 ? "hour" : "hours"}`, color };
  };

  const pathname = usePathname();

  return (
    <div className="">
      {orders.length === 0 && (
        <div>
          <main className="dark:bg-card flex min-h-screen items-center justify-center bg-white px-4 text-center sm:px-6 lg:px-8">
            <div>
              <h1 className="text-green-500 dark:text-green-500">
                <Check className="h-72 w-72" />
              </h1>
              <p className="mt-4 text-2xl leading-6 text-gray-900 dark:text-white">
                No orders.
              </p>
            </div>
          </main>
        </div>
      )}

      <div className="align-start mx-3  mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.map((or) => {
          const timeAg = timeAgo(new Date(or.date));
          return (
            <>
              <div key={or.id} className="bg-card flex w-full flex-col justify-between overflow-hidden rounded-lg border shadow-sm">
                <div className="bg-blue-500 p-2 text-center text-white flex gap-4">
                  <p>{or.table}</p>
                  <p>{or.customId}</p>
                </div>
                <div className="text-foreground p-2">
                  {or.Item_Product_Order
                    ? or.Item_Product_Order.map(
                      (
                        itemOrder: Item_Product_Order & { product: Product },
                      ) => (
                        <>
                          <div key={itemOrder.id} className="flex flex-row gap-2">
                            <p className="font-bold">{itemOrder.quantity}</p>
                            <p>{itemOrder.product.name}</p>
                          </div>
                        </>
                      ),
                    )
                    : null}
                  {or.Item_Menu_Order
                    ? or.Item_Menu_Order.map((itemOrder: extraMenuOrder) => (
                      <div key={itemOrder.id} className="flex flex-col gap-2">
                        <div className="flex flex-row gap-1">
                          <p className="font-bold">{itemOrder.quantity}</p>
                          <p>{itemOrder.menu?.name}</p>
                        </div>
                        <div className="pl-10">
                          <div className="flex flex-col gap-1">
                            {itemOrder.Item_Menu_Product_Order.map((item) => (
                              <p key={item.id}>{item.product.name}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                    : null}

                  <div className="pt-5">
                    <Textarea
                      disabled
                      placeholder="Observations"
                      className=" resize-none"
                      value={or.observation}
                    />
                  </div>
                  <div className="pb-2 pt-5">
                    <Button
                      onClick={() => updateOrderStatus(or.id, "READY")}
                      variant={"outline"}
                      className="w-full"
                    >
                      Move to Served <ArrowRight className="ml-2 h-4 w-4" />{" "}
                    </Button>
                  </div>
                </div>
                <div className={`p-2 ${timeAg.color} text-end text-white`}>
                  <p>{timeAg.time} ago</p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Kitchen;

async function updateOrderStatus(orderId: string, status: orderStatus) {
  const message = await updateStatus(orderId, "/dashboard", status);
  if (message.error) {
    toast.error(message.error);
  }
}
