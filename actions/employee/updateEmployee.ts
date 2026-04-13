"use server";
import { ApiFormValues } from "@/components/modals/ApiModal";
import { db } from "@/lib/db";
import crypto from 'crypto'
import { revalidatePath } from "next/cache";
import { onwnerFormValues } from "@/components/settings/_components/profile-form";
import getCurrentUser from "../users/getCurrentUser";
import { editEployeeFormValues } from "@/components/modals/editModals/EmployeeModal";

export const updateEmployeeProfile = async (data: editEployeeFormValues ) => {
    try {

        const user = await getCurrentUser();
        if (!user || user.role != 'OWNER' ) {
            return {
                error: 'Unauthorized'
            }
        }

        const employee = await db.employee.update({
            where : {
                id : data.id
            },
            data : {
                permissions : data.permissions
            }
        });
        revalidatePath(`/dashboard/${employee.restaurantId}/employees`)
        return 'Profile updated!'
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}