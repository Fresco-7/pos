import { db } from "@/lib/db";
import { backendClient } from "@/lib/edgestore-server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        
        const blob = await req.blob();
        const res = await backendClient.invoices.upload({
            content: {
                blob,
                extension: 'pdf',
            },
            options: {
                temporary: true,
            },
        });

        const fileUrl = res.url;
        return NextResponse.json({ fileUrl }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Something went Wrong" }, { status: 401 })
    }
}