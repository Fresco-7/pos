"use server";
import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import { sideFormValues } from "@/components/modals/SideModal";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export const createSide = async (
    restaurantId: string,
    data: sideFormValues,
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
                name: data.name,
                restaurantId: restaurantId
            }
        });

        if (existingSide) {
            return {
                error: 'Product already exists!'
            };
        }

        const side = await db.side.create({
            data: {
                restaurantId,
                'name': data.name,
                'Stock': {
                    'create': {
                        'stock': parseFloat(data.stock),
                        'Stock_Log': {
                            'create': {
                                'cost': parseFloat(data.cost),
                                'suplier': data.suplier && data.suplier != "" ? data.suplier : null,
                                'stock' : parseFloat(data.stock),
                            }
                        },
                        type : data.type
                    }
                },

            }
        });


        revalidatePath(`/sides/${restaurantId}`);
        revalidatePath(`/dashboard/${restaurantId}/order-mode/`);
        return { message: 'Product created successfully' };

    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        };
    }
};
