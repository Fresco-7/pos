"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";
import { sideAddStockFormValues } from "@/components/modals/editModals/addStockModal";

export const addStockSide = async (
    sideId: number,
    data: sideAddStockFormValues,
) => {
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

        const existingSide = await db.side.findFirst({
            where: {
                id: sideId
            }
        });

        if (!existingSide) {
            return {
                error: 'Side doesnt exists!'
            };
        }

        const stk = await db.stock.findFirst({
            where: {
                sideId,
            }
        });
        if (!stk) {
            return {
                error: 'Side doesnt exists!'
            };
        }

        await db.$transaction(async (prisma) => {
            const res = await db.stock.update({
                where: {
                    id: stk.id,
                },
                data: {
                    stock: {
                        'increment': parseInt(data.stock)
                    },
                },
            });

            await db.stock_Log.create({
                data: {
                    'stock': parseInt(data.stock),
                    'stockId': res.id,
                    'cost': parseFloat(data.cost),
                    suplier: data.suplier && data.suplier != "" ? data.suplier : null
                }
            })
        });


        revalidatePath(`/dashborad/${existingSide.restaurantId}/sides`)
        return { message: 'Product created successfully' };
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        };
    }
};
