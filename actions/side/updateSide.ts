"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";
import { editSideFormValues } from "@/components/modals/editModals/SideModal";

export const updateSide = async (
    sideId: number,
    data: editSideFormValues,
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
                id: sideId,
            }
        });

        if (!existingSide) {
            return {
                error: 'Side doesnt exists!'
            };
        }

        const side = await db.side.update({
            where : {
                'id' : sideId,
            },
            data: {
                'name': data.name,
                'Stock': {
                    'update': {
                        'stock': parseFloat(data.stock),
                    }
                },

            }
        });


        revalidatePath(`/sides/${side.restaurantId}`);
        revalidatePath(`/dashboard/${side.restaurantId}/order-mode/`);
        return { message: 'Product created successfully' };

    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        };
    }
};
