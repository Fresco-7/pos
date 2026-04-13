"use client";
import { updateStatus } from "@/actions/order/updateStatus";
import { Button } from "@/components/ui/button";
import { User, orderStatus } from "@prisma/client";
import { ArrowRight, Check, Fullscreen, Loader2, LogOut } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { FullScreen, FullScreenHandle, useFullScreenHandle } from "react-full-screen";
import { useRouter } from "next/navigation";
import UserMenu from "@/components/dasboardNavbar/UserMenu";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Separator } from "@/components/ui/separator";

const socket = io("http://localhost:8080");
const DisplayMode = ({ params, currentUser }: { params: { id: string }, currentUser: User }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const screen1 = useFullScreenHandle();
  const screen2 = useFullScreenHandle();

  useEffect(() => {
    setIsLoading(true);
    socket.emit(
      "getOrdersReady",
      { restaurantId: `${params.id}` },
      (response: any) => {
        setOrders(response);
      },
    );
    socket.on("refreshOrderReady", () => {
      socket.emit(
        "getOrdersReady",
        { restaurantId: `${params.id}` },
        (response: any) => {
          setOrders(response);
        },
      );
    });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-72 w-72 animate-spin" />
      </div>
    );
  }


  const router = useRouter();

  return (
    <div className="bg-background flex-col h-screen gap-2">
      <div className="h-screen w-full flex flex-col justify-center items-center px-16 p-10">
        <div className="w-full flex justify-between">
          <Button
            variant={"outline"}
            className="w-1/6 shadow-sm"
            onClick={() => router.push(`/dashboard/${params.id}`)}
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="ml-1">Dashboard</span>

          </Button>
          <div className="flex gap-2">
            <UserMenu currentUser={currentUser} />
            <ModeToggle />
          </div>
        </div>

        <div className="mt-10 w-full flex h-full justify-center items-center gap-10">
          <Button className="w-6/12 h-full text-3xl font-semibold" variant={'outline'} onClick={screen1.enter}>Display Mode</Button>
          <Button className="w-6/12 h-full text-3xl font-semibold" variant={'outline'} onClick={screen2.enter} >Employee Display Mode</Button>
        </div>
      </div>
      <FullScreen handle={screen1} >

        <div className={`${screen1.active ? 'flex' : 'hidden'} h-screen w-full bg-background flex-col justify-between p-10`}>
          <div className="flex w-full gap-10 lg:gap-0">
            <div className="w-1/2 ">
              <div className="flex h-10 w-full items-center justify-start font-semibold">
                <h1 className="text-xl lg:px-4 lg:text-6xl">Preparing</h1>
              </div>
              <div className="mt-10 flex flex-col items-start justify-center space-y-2">
                {orders.map((or) => {
                  if (or.status === "KITCHEN")
                    return (
                      <div key={or.id} className={`flex justify-center  `}>
                        <span className="text-foreground-500 text-2xl font-bold lg:text-6xl">
                          {or.customId}
                        </span>
                      </div>
                    );
                })}
              </div>
            </div>
            <div className="w-1/2 ">
              <div className="flex  h-10 w-full items-center justify-start font-semibold">
                <h1 className="text-xl lg:px-4 lg:text-6xl">Waiting</h1>
              </div>
              <div className="mt-10 flex flex-col items-start justify-center space-y-2">
                {orders.map((or) => {
                  if (or.status === "READY")
                    return (
                      <div key={or.id} className={`flex justify-center  `}>
                        <span className="text-2xl font-bold text-green-500 lg:text-6xl">
                          {or.customId}
                        </span>
                      </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>


      </FullScreen>
      <FullScreen handle={screen2}>
        <div className={`${screen2.active ? 'flex' : 'hidden'} h-screen w-full bg-background flex-col justify-between p-10`}>
          <div className="flex w-full gap-10 lg:gap-0">
            <div className="w-full ">
              <div className="flex h-10 w-full items-center justify-start font-semibold">
                <h1 className="text-xl lg:px-4 lg:text-6xl">Waiting</h1>
              </div>
              <div className="mt-10 space-y-5 w-full ">
                {orders.map((or) => {
                  if (or.status === "READY")
                    return (
                      <div  key={or.id}>
                        <Separator className="h-[1px] w-full" />
                        <div className={`flex items-center w-full justify-between px-2`}>
                          <span className=" text-2xl font-bold text-green-500 lg:text-6xl">
                            {or.customId}
                            <span className="text-foreground"> - {or.table}</span>
                          </span>
                          <Button
                            onClick={() => updateOrderStatus(or.id, "SERVED")}
                            variant={"outline"}
                            className="w-1/3  font-semibold"
                          >
                            Seved <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );

                })}



              </div>
            </div>
          </div>
        </div>
      </FullScreen>
    </div>
  );
};

export default DisplayMode;

async function updateOrderStatus(orderId: string, status: orderStatus) {
  const message = await updateStatus(orderId, "/dashboard", status);
  if (message.error) {
    toast.error(message.error);
  }
}
