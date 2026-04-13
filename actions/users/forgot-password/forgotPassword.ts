"use server";

import { db } from "@/lib/db";
import crypto from 'crypto'
import { sendEmail } from '../../emails/sendEmail';
import { ResetPassowrdEmailTemplate } from '@/components/emails/reset-password-email';

export const forgotPassword = async (email: string) => {
    try {
        const user = await db.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!user) {
            return {
                error: 'User not found'
            }
        }

        if (!user.emailVerifiedAt) {
            return {
                error: 'Email not verified'
            }
        }

        const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
        
        const today = new Date();
        const expiryDate = new Date(today.setDate(today.getDate() + 1));

        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                resetTokenPassword: resetPasswordToken,
                resetTokenPasswordValidate: expiryDate
            }
        })

        await sendEmail({
            from: '[POS Kitchen]  <noreplay@kitchenpos.online>',
            to: [email],
            subject: 'Change your Password',
            react: ResetPassowrdEmailTemplate({ userName : user.name ,email: email, resetPasswordToken: resetPasswordToken }) as React.ReactElement
        });

        return "Password reset email sent"
    } catch (error) {
        return {
            error: 'Something went Wrong'
        }
    }
}