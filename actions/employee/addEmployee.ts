"use server";
import { db } from "@/lib/db";
import getCurrentSession from "../users/getCurrentSession";
import bcrypt from 'bcryptjs'
import { addEmployeeFormValues } from "@/components/modals/EmployeeModal";
import crypto from 'crypto'
import { revalidatePath } from "next/cache";
import { sendEmail } from "../emails/sendEmail";
import addEmployeeEmailTemplate from "@/components/emails/add-employee-email";
import VerifyEmailTemplate from "@/components/emails/verify-email";
import getCurrentUser from "../users/getCurrentUser";

export const addEmployees = async (data: addEmployeeFormValues, restaurantId: string) => {
    try {

        const user = await getCurrentUser();
        if (!user || user.role != 'OWNER') {
            return {
                error: 'Unauthorized'
            }
        }

        const restaurant = await db.restaurant.findFirst({
            where: {
                id: restaurantId
            }
        })

        if (!restaurant) {
            return {
                error: 'Something went Wrong! (There is no restaurant)'
            }
        }

        if (restaurant.ownerId != user.id) {
            return {
                error: 'Unauthorized'
            }
        }

        const existingUser = await db.user.findFirst({
            where: {
                email: data.email
            },
        });

        if (existingUser) {
            return {
                error: 'User already exists'
            }
        }


        const emailToken = crypto.randomBytes(32).toString('base64url');
        const createUser = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                hashedPassword: bcrypt.hashSync(data.password, 12),
                role: 'EMPLOYEE',
                verifyEmailToken: emailToken,
                image: "",
                Employee: {
                    create: {
                        address: data.address,
                        phone: data.phone,
                        permissions: data.permissions,
                        restaurantId
                    }

                }
            },
        });

        if (!createUser) {
            return {
                error: 'Something went Wrong!'
            }
        }

        await sendEmail({
            from: '[POS Kitchen]  <noreplay@kitchenpos.online>',
            to: [createUser.email],
            subject: `Employment - ${restaurant.name}`,
            react: addEmployeeEmailTemplate({ restaurant: restaurant, userName :  user.name}) as React.ReactElement
        });

        await sendEmail({
            from: '[POS Kitchen]  <noreplay@kitchenpos.online>',
            to: [createUser.email],
            subject: `Verify email - ${createUser.name}`,
            react: VerifyEmailTemplate({ email: createUser.email, name: createUser.name, verifyEmailToken: emailToken }) as React.ReactElement
        });

        revalidatePath(`/employees/${restaurantId}`);
        revalidatePath(`/employees`);
        return { message: 'Employye created succesfully' , createdEmployee : "Employee created" }
    } catch (error) {
        return {
            error: 'Something went Wrong!'
        }
    }

}
