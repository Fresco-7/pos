import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {

    try {
        const dataJson = await req.json();
        const user = await db.user.findFirst({
            where: {
                email: dataJson.email
            },
            include: {
                Restaurant: true,
                Employee: true
            },
        });


        
        if (!user) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
        }
        

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Something went Wrong" }, { status: 401 })
    }
}