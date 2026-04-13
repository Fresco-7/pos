"use server";
import { ApiFormValues } from "@/components/modals/ApiModal";
import { db } from "@/lib/db";
import crypto from 'crypto'
import getCurrentUser from "../../users/getCurrentUser";
import { revalidatePath } from "next/cache";

export const createApiKey = async (data: ApiFormValues, restaurantId: string) => {
    try {

        const user = await getCurrentUser();
        if (!user || user.role != 'OWNER') {
            return {
                error: 'Unauthorized'
            }
        }

        const key = crypto.randomBytes(32).toString('hex');
        const restaurant = await db.restaurant.findFirst({
            where: {
                id: restaurantId
            }
        })

        if (!restaurant || restaurant.ownerId != user.id) {
            return {
                error: 'Unauthorized'
            }
        }
        
        const apiKey = await db.apiKey.create({
            data: {
                api_key :key,
                restaurantId: restaurant.id,
                name: data.name,
                status: "ACTIVE",
            }
        });

        if (!apiKey) {
            return {
                error: 'Something went Wrong!'
            }
        }

        revalidatePath('/settings/api')
        return { message: 'API Key created succesfully', key }
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}