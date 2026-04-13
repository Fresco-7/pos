import { db } from "@/lib/db"

import React from "react";
import LogComponent from "../_components/LogComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = async ({ params }: { params: { id: string, orderId: string } }) => {
    const orderLog = await db.order_Log.findMany({
        where: {
            orderId: params.orderId,
            AND: {
                order: {
                    restaurantId: params.id
                }
            },

        },
        include: {
            user: true
        },
        orderBy: { createdAt: 'asc' }
    });
    
    if (orderLog.length > 0) {
        return (
            <div className="w-full flex p-10 pt-7 pb-16">
                {orderLog.length > 0 && (
                    <LogComponent orderLog={orderLog} />
                )}
            </div>
        );
    }
    
    return (
        <main className="m-28 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <div>
                <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">404</h1>
                <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
                    Oops! The page you're looking for could not be found.
                </p>
                <div className="mt-8">
                    <Link href={`/dashboard/${params.id}/orders`}>
                        <Button className="text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700">
                            Go to Orders
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    )


}
export default page