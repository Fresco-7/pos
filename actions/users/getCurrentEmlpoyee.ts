import { auth } from "@/auth";
import {db } from '@/lib/db'

export default async function getCurrentEmployee() {
    try {
        const session = await auth();
        if (session) {
            const employee = db.employee.findFirst({
                where: {
                    userId: session?.user.id
                }
            })
            return employee;
        }
        return null;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}