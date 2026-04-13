"use server";
import { ApiFormValues } from "@/components/modals/ApiModal";
import { db } from "@/lib/db";
import crypto from 'crypto'
import getCurrentUser from "../../users/getCurrentUser";
import { revalidatePath } from "next/cache";
import { onwnerFormValues } from "@/components/settings/_components/profile-form";

export const updateProfile = async (data: onwnerFormValues, userId: string) => {
    try {

        const user = await getCurrentUser();
        if (!user || user.role != 'OWNER' || userId != user.id) {
            return {
                error: 'Unauthorized'
            }
        }
        await db.user.update({
            where : {
                id : user.id
            },
            data : {
                name : data.name,
                image : data.image
            }
        })

        return { message: 'Profile updated!' }
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}