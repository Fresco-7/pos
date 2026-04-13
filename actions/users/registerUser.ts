"use server";
import { db } from "@/lib/db";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from "../emails/sendEmail";
import VerifyEmailTemplate from "@/components/emails/verify-email";

export const registerUser = async (email: string, password: string, name: string) => {
    try {

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return {
                error: 'User already exists'
            }
        }
        
        const emailToken = crypto.randomBytes(32).toString('base64url');
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await db.user.create({
            data: {
                email,
                name,
                hashedPassword,
                role: "OWNER",
                verifyEmailToken : emailToken,
                image : "",
            }
        });

        await sendEmail({
            from: '[POS Kitchen]  <noreplay@kitchenpos.online>',
            to: [email],
            subject: `Verify email - ${name}`,
            react: VerifyEmailTemplate({ email: user.email, name: user.name, verifyEmailToken: emailToken}) as React.ReactElement
        });

        return "User Registred"
    } catch (error) {
        return {
            error: 'Something went Wrong'
        }
    }

}