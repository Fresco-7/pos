import { auth } from "@/auth";
import {db } from '@/lib/db'

export default async function getCurrentUser() {
    try {
        const session = await auth();
        if (session) {
            const user = db.user.findFirst({
                where: {
                    id: session?.user.id
                }
            })
            return user;
        }
        return null;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}
