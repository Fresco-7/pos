import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Download, LogOut, PlusIcon, PlusSquareIcon } from "lucide-react"
import Link from "next/link"
import Iframe from 'react-iframe'
import { History } from "lucide-react";


const Invoice = async ({ params }: { params: { id: string, orderId: string } }) => {
    const order = await db.order.findFirst({
        where: {
            restaurantId: params.id,
            id: params.orderId,
        }, include: {
            'user': true
        }
    })
    if (!order) {
        return (
            <main className="mt-60 dark:bg-card flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">404</h1>
                    <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
                        Oops! The page you're looking for could not be found.
                    </p>

                </div>
            </main>
        )
    }
    if (!order?.invoice) {
        return (
            <main className="mt-60 dark:bg-card flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">404</h1>
                    <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
                        Oops! There is no invoice attached to this order.
                    </p>

                </div>
            </main>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center p-6 gap-4">
            <div className="flex w-full justify-center gap-4">
                <Link href={`/dashboard/${order.restaurantId}`} >
                    <Button
                        variant={"outline"}
                        className="shadow-sm"
                    >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span className="ml-1">Dashboard</span>
                    </Button>
                </Link>
                <Link href={order.invoice} target="_blank">
                    <Button variant={"outline"}><Download className="mr-1 w-4 h-4" /> Download</Button>
                </Link>
                <Link href={`/dashboard/${order.restaurantId}/orders/${order.id}`}>
                    <Button variant={"outline"}><History className="mr-1 w-4 h-4" /> Order history</Button>
                </Link>
                <Link href={`/dashboard/${order.restaurantId}/order-mode`}>
                    <Button variant={"outline"}><PlusIcon className="mr-1 w-4 h-4" /> New Order</Button>
                </Link>
            </div>
            <div>
                
            </div>

            <Iframe url={order.invoice} className="lg:h-[500px] xl:h-[700px] md:h-[450px] h-[550px] "
                width="100%"
                position="relative" />
        </div>
    )
}
export default Invoice;