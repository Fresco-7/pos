"use server";
import { db } from "@/lib/db";
import crypto from 'crypto'
import { sendEmail } from "@/actions/emails/sendEmail";
import VerifyEmailTemplate from "@/components/emails/verify-email";
import getCurrentUser from "../getCurrentUser";

export const verifyEmail = async () => {
    try {

        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return {
                error: 'No user'
            }
        }
        
        if (currentUser.emailVerifiedAt) {
            return {
                error: 'Email already verified'
            }
        }


        const emailToken = crypto.randomBytes(32).toString('base64url');

        await db.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                verifyEmailToken: emailToken,
            }
        });

        await sendEmail({
            from: '[POS Kitchen]  <noreplay@kitchenpos.online>',
            to: [currentUser.email],
            subject: `Verify email - ${currentUser.email}`,
            react: VerifyEmailTemplate({ email: currentUser.email, name: currentUser.name, verifyEmailToken: emailToken }) as React.ReactElement
        });

        return {message : "User Registred"}
    } catch (error) {
        return {
            error: 'Something went Wrong'
        }
    }

}