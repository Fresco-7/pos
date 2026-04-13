"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { revalidatePath } from "next/cache";



export const deleteSide = async (id: number, restaurantId: string) => {
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

        const existingSide = await db.side.findFirst({
            where: {
                id: id,
                restaurantId
            }
        });

        if (!existingSide) {
            return {
                error: 'Product does not exist!'
            }
        }

        await db.$transaction(async (prisma) => {
            await db.side_Product.deleteMany({
                where: {
                    'sideId': id,
                },
            });
            const stock = await db.stock.findFirst({
                where: {
                    'sideId': id
                }
            })

            await db.stock_Log.deleteMany({
                where: {
                    stockId: stock?.id
                },
            });

            await db.stock.delete({
                where: {
                    'id': stock?.id
                }
            });

            await db.side.deleteMany({
                where: {
                    id,
                },
            });
        });


        revalidatePath(`/dashboard/${existingSide.restaurantId}/sides`);
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