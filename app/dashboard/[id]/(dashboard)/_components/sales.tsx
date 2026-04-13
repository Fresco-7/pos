import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Order } from "@prisma/client";

const Sales = ({ orders }: { orders: Order[] }) => {
    const newOrders = orders.slice(0, 5);
    return (
        <div className="space-y-8 w-full h-full">  {/* w-full h-full */}
            {newOrders.map((o) => (
                <div className="flex items-center" key={o.id}>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Table: {o.table}</p>
                    </div>
                    <div className="ml-auto font-medium">+{o.price.toFixed(2)}€</div>
                </div>
            ))}
            {newOrders.length === 0 && (
                <div className="flex w-full h-full">
                    <span className="text-muted-foreground">No recent orders</span>
                </div>
            )}
        </div>
    )
}
export default Sales;