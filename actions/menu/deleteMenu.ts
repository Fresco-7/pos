"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { revalidatePath } from "next/cache";import { OrderLogStatus } from "@prisma/client";

interface Order_LogCreateManyInput {
    orderId: string;
    logType: OrderLogStatus;
    userId: string;
    changes: string;
}
export const deleteMenu = async (id: number, pathname: string) => {
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

        const existingMenu = await db.menu.findFirst({
            where: {
                id: id
            }
        });

        if (!existingMenu) {
            return {
                error: 'Menu does not exist!'
            }
        }
        const orders = await db.order.findMany({
            where: {
                Item_Menu_Order: {
                    some: {
                        menuId: existingMenu.id
                    }
                },

            }
        });

        await db.$transaction([
            db.order.updateMany({
                where: {
                    Item_Menu_Order: {
                        some: {
                            menuId: existingMenu.id
                        }
                    },

                }, data: {
                    status: 'DELETED',
                }
            }),

            db.item_Menu_Product_Order.deleteMany({
                where: {
                    Item_Menu_Order: {
                        menuId: id
                    }
                }
            })
            ,

            db.item_Menu_Order.deleteMany({
                where: { menuId: id },
            }),

            db.menu_Product.deleteMany({
                where: {
                    menuId: id
                },
            }),

            db.menu.delete({
                where: {
                    id
                },
            }),

        ]);
        if (orders && orders.length > 0) {
            const orderLogsData: Order_LogCreateManyInput[] = orders.map((or) => ({
                orderId: or.id,
                logType: 'UPDATED_STATUS', 
                userId: user.id,
                changes: JSON.stringify(or)
            }));
        
            const orderLog = await db.order_Log.createMany({
                data: orderLogsData
            });
        }


        revalidatePath(pathname);
        return {
            message: 'Menu deleted Successfully!'
        }

    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}