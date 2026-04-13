"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { revalidatePath } from "next/cache";

export const deleteEmployee = async (id: string, pathname: string) => {
    try {

        const user = await getCurrentUser();

        if (!user) {
            return {
                error: 'Unauthorized'
            }
        }

        if (user.role === 'EMPLOYEE') {
            return {
                error: 'Unauthorized'
            }
        }

        const existingEmployee = await db.employee.findFirst({
            where: {
                id: id
            }
        });

        if (!existingEmployee) {
            return {
                error: 'Employee does not exist!'
            }
        }

        await db.$transaction([
            db.employee.delete({
                where: { id },
            }),

            db.user.delete({
                where: { id: existingEmployee.userId },
            }),

        ])

        revalidatePath(pathname);
        return {
            message: 'Employee deleted Successfully!'
        }

    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}