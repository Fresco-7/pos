"use server";
import { db } from "@/lib/db";
import getCurrentUser from "@/actions/users/getCurrentUser";
import { revalidatePath } from "next/cache";

export const deleteApiKey = async (id: string, pathname : string) => {
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

        const existingApi = await db.apiKey.findFirst({
            where: {
                id: id
            }
        });

        if (!existingApi) {
            return {
                error: 'Api does not exist!'
            }
        }

        await db.apiKey.delete({
            where : {
                id : id,
            }
        })

        revalidatePath(pathname);
        return {
            message: 'Api deleted Successfully!'
        }

    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}