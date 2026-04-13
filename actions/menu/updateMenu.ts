"use server";

import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import { revalidatePath } from "next/cache";
import { MenuFormValues } from "@/components/modals/MenuModal";
import getCurrentUser from "../users/getCurrentUser";
import { MenuEditFormValues } from "@/components/modals/editModals/MenuModal";


export const updateMenu = async (data: MenuEditFormValues) => {
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
                id: data.id,
            },

        });

        if (!existingMenu) {
            return {
                error: 'Menu doesnt exists!'
            }
        }

        const existingProduct2 = await db.product.findFirst({
            where: {
                name: data.name,
                restaurantId: existingMenu.restaurantId,
                NOT: {
                    id: existingMenu.id
                }
            }
        });

        if (existingProduct2) {
            return {
                error: 'Product already exists!'
            };
        }

        const menu = await db.menu.update({
            where: {
                id: existingMenu.id
            },
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                status: 'ACTIVE',
                price: parseFloat(data.price),
                discount: parseFloat(data.discount),
                tax: parseFloat(data.tax),
                additionalInformation: data.additionalInformation,
                optionalDesert: data.desert,
                optionalDrink: data.drink,
            }
        });
        if (!menu) {
            return { error: 'Something went Wrong' }
        }
        const menuProduct = db.menu_Product.deleteMany({
            where: {
                menuId: menu.id,
            }
        });

        const createMenuProducts = db.menu_Product.createMany({
            data: data.products.map(id => ({
                productId: id,
                menuId: menu.id,
            })),
        });
        await db.$transaction([menuProduct, createMenuProducts])

        revalidatePath(`/menus/${menu.restaurantId}`);
        revalidatePath(`/dashboard/${menu.restaurantId}/order-mode/`);
        return { message: 'Menu created succesfully', menu: menu }

    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}