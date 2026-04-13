"use server";
import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import { ProductFormValues } from "@/components/modals/editModals/ProductModal";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";
import { da } from "date-fns/locale";
import { create } from "domain";
import { Status } from "@prisma/client";

export const updateProductStatus = async ({ productId, restaurantId, status }: { productId: number, restaurantId: string, status: Status }) => {
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

        const existingProduct = await db.product.findFirst({
            where: {
                id: productId,
                restaurantId: restaurantId
            }
        });

        if (!existingProduct) {
            return {
                error: 'Product doenst exists!'
            };
        }

        await db.product.update({
            where: {
                restaurantId,
                id: productId,
            },
            data: {
                status,
            }
        });
        revalidatePath(`/dashboard/${restaurantId}/products`)
        revalidatePath(`/dashboard/${restaurantId}/order-mode`)
        return 'Changed Status'
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        };
    }
};
