"use server";
import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import { ProductFormValues } from "@/components/modals/editModals/ProductModal";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";
import { da } from "date-fns/locale";
import { create } from "domain";
import { Status } from "@prisma/client";

export const updateMenuStatus = async ({ menuId, restaurantId, status }: { menuId: number, restaurantId: string, status: Status }) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'Unauthorized'
            };
        }


        if (user.role === 'EMPLOYEE') {
            const employee = await db.employee.findFirst({
                where: {
                    userId: user.id
                }
            });
            if (employee?.permissions !== 'WRITE_READ') {
                return {
                    error: 'Unauthorized'
                };
            }
        }

        const existingMenu = await db.menu.findFirst({
            where: {
                id: menuId,
                restaurantId: restaurantId
            }
        });

        if (!existingMenu) {
            return {
                error: 'Menu doenst exists!'
            };
        }

        await db.menu.update({
            where: {
                restaurantId,
                id: menuId,
            },
            data: {
                status,
            }
        });
        revalidatePath(`/dashboard/${restaurantId}/menus`)
        revalidatePath(`/dashboard/${restaurantId}/order-mode`)
        return 'Changed Status'
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        };
    }
};
