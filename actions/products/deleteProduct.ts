"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { revalidatePath } from "next/cache";
import { OrderLogStatus } from "@prisma/client";


interface Order_LogCreateManyInput {
    orderId: string;
    logType: OrderLogStatus;
    userId: string;
    changes: string;
}

export const deleteProduct = async (id: number, pathname: string) => {
    try {

        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'Unauthorized'
            }
        }

        if (user.role === 'EMPLOYEE') {

            const employee = await db.employee.findFirst({
                where: {
                    userId: user.id
                }
            });
            if (employee?.permissions != 'WRITE_READ') {
                return {
                    error: 'Unauthorized'
                }
            }
        }

        const existingProduct = await db.product.findFirst({
            where: {
                id: id
            }
        });

        if (!existingProduct) {
            return {
                error: 'Product does not exist!'
            }
        }

        const menus = await db.menu.findMany({
            where: {
                Menu_Product: {
                    'some': {
                        'productId': id
                    }
                }

            },
            select: {
                id: true
            }
        });

        const menuIds = menus.map((m) => m.id)

        const orders = await db.order.findMany({
            where: {
                OR: [
                    {
                        Item_Menu_Order: {
                            'some': {
                                'menuId': {
                                    in: menuIds
                                }
                            }
                        },
                    },
                    {
                        Item_Product_Order: {
                            some: {
                                productId: id,
                            }
                        }
                    }
                ]
            }, select: {
                id: true
            }
        });

        const orderIds = orders.map((o) => o.id);

        await db.$transaction(async (prisma) => {

            const updatedOrders = await db.order.updateMany({
                where: {
                    id: {
                        in: orderIds
                    }
                }, data: {
                    status: 'DELETED',
                },
            });


            await db.item_Menu_Product_Order.deleteMany({
                where: {
                    Item_Menu_Order: {
                        menuId: {
                            in: menuIds
                        }
                    }
                }
            });

            await db.item_Product_Order.deleteMany({
                where: {
                    productId: id,
                }
            });

            await db.restrictions_Product.deleteMany({
                where: {
                    productId: id,
                }
            });

            await db.side_Product.deleteMany({
                where: {
                    productId: id,
                }
            });

            await db.menu_Product.deleteMany({
                where: {
                    menuId: {
                        in: menuIds
                    }
                }
            });
            
            await db.item_Menu_Order.deleteMany({
                where: {
                    menuId: {
                        in: menuIds
                    }
                }
            });

            await db.menu.deleteMany({
                where: {
                    id: {
                        in: menuIds
                    }
                }
            });

            await db.product.delete({
                where: {
                    id,
                },
            });
        });


        const updatedOrders = await db.order.findMany({
            where: {
                id: {
                    in: orderIds
                }
            }
        })

        const orderLogsData: Order_LogCreateManyInput[] = updatedOrders.map((or) => ({
            orderId: or.id,
            logType: 'UPDATED_STATUS',
            userId: user.id,
            changes: JSON.stringify(or)
        }));

        await db.order_Log.createMany({
            data: orderLogsData
        });



        revalidatePath(pathname);
        return {
            message: 'Product deleted Successfully!'
        }

    } catch (error) {
        console.error(error);
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}