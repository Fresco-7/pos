import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
    const { token } = params;

    const user = await db.user.findFirst({
        where: {
            emailVerifiedAt: null,
            verifyEmailToken: token,
        }
    });

    if (!user) {
        redirect('/');
    }

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            emailVerifiedAt: new Date(),
            verifyEmailToken: null,
        }
    });


    redirect('/');
}
