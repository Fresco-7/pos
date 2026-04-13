
import { auth } from "@/auth";

export default async function getCurrentSession() {
    try {
        const session = await auth();
        return session;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}
