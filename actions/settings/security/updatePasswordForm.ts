"use server";

import { db } from "@/lib/db";
import { securityFormValues } from "@/components/settings/_components/security-form";
import getCurrentUser from "@/actions/users/getCurrentUser";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/actions/emails/sendEmail";
import { ResetedPassowrdEmailTemplate } from "@/components/emails/password-reseted-email";

export const updatePassword = async (data: securityFormValues, userId: string) => {
    try {

        const user = await getCurrentUser();
        if (!user || userId != user.id) {
            return {
                error: 'Unauthorized'
            }
        }
        if (!user.emailVerifiedAt) {
            return {
                error: 'Please verify your email'
            }
        }
        try {
            const result = await bcrypt.compare(data.password, user.hashedPassword);
            if (!result) {
                return {
                    error: 'Incorret Password'
                }
            }
        } catch (err) {
            console.error(err);
            return {
                error: "Error"
            }
        }

        if (data.password === data.newPassword) {
            return {
                error: 'The password must be new'
            }
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 12);
        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                hashedPassword: hashedPassword
            }
        })

        await sendEmail({
            from: '[POS Kitchen] <noreplay@kitchenpos.online>',
            to: [user.email],
            subject: `Password successfully changed`,
            react: ResetedPassowrdEmailTemplate({ userName : user.name }) as React.ReactElement
        });

        return { message: 'Profile updated!' }
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}