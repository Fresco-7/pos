"use server";

import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import { revalidatePath } from "next/cache";
import { MenuFormValues } from "@/components/modals/MenuModal";
import getCurrentUser from "../users/getCurrentUser";


export const createMenu = async (data: MenuFormValues, restaurantId: string) => {
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
                name: data.name,
                restaurantId: restaurantId
            }
        });

        if (existingMenu) {
            return {
                error: 'Menu already exists!'
            }
        }

        const menu = await db.menu.create({
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                status: 'ACTIVE',
                restaurantId: restaurantId,
                price: parseFloat(data.price),
                discount: parseFloat(data.discount),
                tax: parseFloat(data.tax),
                additionalInformation: data.additionalInformation,
                optionalDesert: data.desert,
                optionalDrink: data.drink,
                Menu_Product: {
                    create: data.products.map((id) => ({
                        productId: id,
                    })),
                },
            }
        });

        if (!menu) {
            return { error: 'Something went Wrong' }
        } else {

            revalidatePath(`/menus/${restaurantId}`);
            revalidatePath(`/dashboard/${restaurantId}/order-mode/`);
            return { message: 'Menu created succesfully', menu: menu }
        }
    }catch(error){
        return { error: `Something went Wrong ${error}` }
    }

}