import { Order } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const OrderCompenent = ({
  order,
  params,
}: {
  order: Order;
  params: { id: string; orderId?: string };
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        router.push(`/dashboard/${params.id}/order-mode/${order.id}`)
      }
    >
      <div

        className={`flex cursor-pointer justify-between rounded-md border p-4 text-xs shadow-sm ${order.id === params.orderId ? " border-blue-500 border-2" : ""}`}
      >
        <span >{order.table}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <span>{order.status.toUpperCase()}</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
};
