"use server";

import { sendEmail } from "@/actions/emails/sendEmail";
import ResetedPassowrdEmailTemplate from "@/components/emails/password-reseted-email";
import { db } from "@/lib/db";
import bcrypt from 'bcryptjs'

export const changePassword = async (resetPasswordToken: string, password: string) => {
    try{
        const user = await db.user.findFirst({
            where : {
                resetTokenPassword : resetPasswordToken
            }
        })

        if(!user) {
            return {
                error : 'User not found'
            }
        }

        const resetPasswordTokenExpiry = user.resetTokenPasswordValidate;
        if(!resetPasswordTokenExpiry) {
            return {
                error : 'Token expired'
            }
        }

        const today = new Date();

        if(today > resetPasswordTokenExpiry) {
            return {
                error : 'Token expired'
            }
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                hashedPassword : passwordHash,
                resetTokenPassword: null,
                resetTokenPasswordValidate: null,
            }
        });

        await sendEmail({
            from: '[POS Kitchen]  <noreplay@kitchenpos.online>',
            to: [user.email],
            subject: `Password successfully changed`,
            react: ResetedPassowrdEmailTemplate({ userName : user.name }) as React.ReactElement
        });

        return "Password changed successfully"
    }catch(error){
        return {
            error : 'Something went Wrong'
        }
    }
}