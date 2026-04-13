import { db } from "@/lib/db";
import { OrderMode } from "../_components/updateMode";
import getCurrentUser from "@/actions/users/getCurrentUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Plus, X } from "lucide-react";
import { TbFileInvoice } from "react-icons/tb";

const OrderModePage = async ({
  params,
}: {
  params: { id: string; orderId: string };
}) => {
  const menus = await db.menu.findMany({
    where: {
      restaurantId: params.id,
      status: 'ACTIVE',
      AND: {
        Menu_Product: {
          every: {
            product: {
              'Side_Product' : {
                'every' : {
                    'Side' : {
                        'Stock' : {
                            'stock' :{
                                'gt' : 0
                            }
                        }
                    }
                }
            },
            }
          }
        }
      },
    },
    include: {
      Menu_Product: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  const products = await db.product.findMany({
    where: {
      restaurantId: params.id,
      status: 'ACTIVE',
      AND: {
        'Side_Product' : {
          'every' : {
              'Side' : {
                  'Stock' : {
                      'stock' :{
                          'gt' : 0
                      }
                  }
              }
          }
      },
      },
    },
    include: {
      category: true,
    },
  });

  const restaurant = await db.restaurant.findFirst({
    where: {
      id: params.id,
    },
  });

  const currentUser = await getCurrentUser();
  if (!restaurant || !currentUser) {
    return (
      <>
        <div>Invalid</div>
      </>
    );
  }

  const orders = await db.order.findMany({
    where: {
      restaurantId: params.id,
      OR: [{ status: "KITCHEN" }, { status: "SERVED" }],
    },
  });

  const order = await db.order.findFirst({
    where: {
      id: params.orderId,
      restaurantId: params.id,
    },
    include: {
      Item_Menu_Order: {
        include: {
          menu: true,
          Item_Menu_Product_Order: {
            include: {
              product: true,
            },
          },
        },
      },
      Item_Product_Order: {
        include: {
          product: true,
        },
      },
    },
  });

  if (order?.status === "COMPLETE") {
    return (
      <main className="dark:bg-card w-full flex min-h-screen items-center justify-center bg-white px-4 text-center sm:px-6 lg:px-8">
        <div>
          <h1 className="text-green-500 dark:text-green-500  flex justify-center">
            <Check className="h-72 w-72" />
          </h1>
          <p className="mt-4 text-2xl leading-6 text-gray-900 dark:text-white">
            Order Completed.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href={`/dashboard/${params.id}/orders/${params.orderId}/invoice`}>
              <Button className="rounded-md text-base ml-4 font-medium">
                <TbFileInvoice className="w-4 h-4 mr-1" />View Invoice
              </Button>
            </Link>
            <Link href={`/dashboard/${params.id}/order-mode`}>
              <Button className="rounded-md text-base ml-4 font-medium">
                <Plus className="w-4 h-4 mr-1" />New Order
              </Button>
            </Link>

          </div>
        </div>
      </main>
    );
  }

  if (order?.status === "CANCELED" || order?.status === "DELETED") {
    return (
      <main className="dark:bg-card flex min-h-screen items-center justify-center bg-white px-4 text-center sm:px-6 lg:px-8">
        <div>
          <h1 className="text-gray-400 dark:text-gray-500">
            <X className="h-72 w-72" />
          </h1>
          <p className="mt-4 text-2xl leading-6 text-gray-900 dark:text-white">
            Order {order.status}.
          </p>
          <div className="mt-8">
            <Link href={`/dashboard/${params.id}/orders`}>
              <Button className="rounded-md bg-gray-400 text-base font-medium text-white hover:bg-gray-500">
                Go to Orders
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (order) {
    return (
      <OrderMode
        restaurant={restaurant}
        order={order}
        orders={orders}
        params={params}
        currentUser={currentUser}
        menus={menus}
        products={products}
      />
    );
  }

  return (
    <main className="dark:bg-card flex min-h-screen items-center justify-center bg-white px-4 text-center sm:px-6 lg:px-8">
      <div>
        <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">
          404
        </h1>
        <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
          Oops! The page you're looking for could not be found.
        </p>
        <div className="mt-8">
          <Link href={`/dashboard/${params.id}/orders`}>
            <Button className="rounded-md bg-blue-500 text-base font-medium text-white hover:bg-blue-700">
              Go to Orders
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderModePage;
