"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../../users/getCurrentUser";
import { employeeFormValues } from "@/components/settings/_components/profile-form";
import getCurrentEmployee from "@/actions/users/getCurrentEmlpoyee";

export const updateEmployee = async (data: employeeFormValues, userId: string, employeeId: string | undefined) => {
    try {

        const user = await getCurrentUser();
        if (!user || user.role != 'EMPLOYEE' || userId != user.id) {
            return {
                error: 'Unauthorized'
            }
        }

        const employee = await getCurrentEmployee();
        if (!employee || employeeId != employee.id) {
            return {
                error: 'Unauthorized'
            }
        }

        await db.employee.update({
            where: {
                id: employee.id
            },
            data: {
                address: data.address,
                phone: data.phone
            }
        });

        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                name: data.name,
                image: data.image
            }
        });

        return { message: 'Profile updated!' }
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}