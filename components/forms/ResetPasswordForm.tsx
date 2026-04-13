'use client';
import { changePassword } from "@/actions/users/forgot-password/changePassword";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ResetPassowrdProps {
    resetPasswordToken: string;
}

const resetPasswordSchema = z.object({
    password: z.string({ required_error: "Please enter a vapassword" })
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
            new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
            "One special character"
        )
        .min(8, "Must be at least 8 characters in length"),
    confirmPassword: z.string({ required_error: "Please confrim the password" })

}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: "Passwords must match!",
        path: ["confirmPassword"],
    }
);


type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

const ResetPasswordForm = ({ resetPasswordToken }: ResetPassowrdProps) => {

    const [isLoading, setIsLoading] = useState<boolean>();
    const router = useRouter();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
    })

    async function onSubmit(data: ResetPasswordFormValues) {
        setIsLoading(true);
        const message = await changePassword(resetPasswordToken, data.password);
        if (typeof message != 'string') {
            toast.error(message.error);
        } else {
            toast.success('Password Changed');
            router.push('/');
        }
        setIsLoading(false);
    }

    return (
        <>
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2.5">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" password {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Confirm Password" type="password" password {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <Button disabled={isLoading} isLoading={isLoading} className="w-full mt-4 " type="submit">Reset Password</Button>
                        </div>
                    </form>
                </Form>
            </div>

        </>
    )
}

export default ResetPasswordForm;