"use server";
import { RestaurantFormValues } from "@/components/modals/RestaurantModal";
import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import { error } from "console";
import { revalidatePath } from "next/cache";

export const createRestaurant = async (data: RestaurantFormValues, currentpath : string) => {
    try {

        const session = await getCurrentSession();
        if (!session?.user || session.user.role != 'OWNER') {
            return {
                error: 'Unauthorized'
            }
        }
        const existingRestaurant = await db.restaurant.findFirst({
            where: {
                name: data.name
            }
        });

        if (existingRestaurant) {
            return {
                error: 'Restaurant already exists!'
            }
        }

        const restaurant = await db.restaurant.create({
            data: {
                city : data.city,
                name: data.name,
                zipCode: data.zipCode,
                address: data.address,
                country: data.country,
                owner: { connect: { id: session.user.id } },
            }
        })

        if (!restaurant) {
            return { error: 'Something went Wrong'}

        }else{
            revalidatePath(currentpath);
            return { message: 'Restaurant created succesfully', restaurant }
        }
    } catch (error) {
        return {
            error: 'Something went Wrong!'
        }
    }

}