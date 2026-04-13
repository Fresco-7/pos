"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../../users/getCurrentUser";
import { restaurantFormValues } from "@/components/settings/_components/restaurant-form";
import { revalidatePath } from "next/cache";

export const updateRestaurant = async (data: restaurantFormValues, restaurantId: string) => {
    try {

        const user = await getCurrentUser();
        if (!user || user.role != 'OWNER') {
            return {
                error: 'Unauthorized'
            }
        }
        
        const existingRestaurant = await db.restaurant.findFirst({
            where: {
                id: restaurantId
            }
        });

        if (!existingRestaurant || existingRestaurant.ownerId != user.id) {
            return {
                error: 'Unauthorized'
            }
        }

        const existingRestaurantName = await db.restaurant.findFirst({
            where: {
                name: data.name,
                ownerId : existingRestaurant.ownerId
            }
        });

        if (existingRestaurantName && restaurantId != existingRestaurant.id) {
            return {
                error: 'Restaurant already exists with that name!'
            }
        }

        await db.restaurant.update({
            where : {
                id : restaurantId
            },
            data : {
                city : data.city,
                name : data.name,
                address : data.address,
                country : data.country,
                zipCode : data.zipCode,
                image : data.image,
            }
        })
        revalidatePath('/settings/restaurant');
        revalidatePath(`/dashboard/${restaurantId}`);
        return { message: 'Restaurant updated!' }
        
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}