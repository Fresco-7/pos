"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User } from "@prisma/client"
import toast from "react-hot-toast"
import { updatePassword } from "@/actions/settings/security/updatePasswordForm"
import { useRouter } from "next/navigation"
import React from "react"
import { tr } from "date-fns/locale"

const securityFormSchema = z.object({
  password: z.string({ required_error: "To change your current passowrd you need to enter the current one.", }).min(1, { message: "To change your current passowrd you need to enter the current one." }),
  newPassword: z.string({ required_error: "Please enter a password" })
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    )
    .min(8, "Must be at least 8 characters in length"),
});

export type securityFormValues = z.infer<typeof securityFormSchema>

export function SecurityForm({ user }: { user: User }) {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const securityForm = useForm<securityFormValues>({
    resolver: zodResolver(securityFormSchema),
    mode: "onChange",
  })



  async function onSubmit(data: securityFormValues) {
    setIsLoading(true);
    const message = await updatePassword(data, user.id);
    if (message.error) {
      toast.error(message.error);

    } else {
      toast.success("Profile Updated");
      router.refresh();
    }
    setIsLoading(false);
  }



  return (<>
    <Form {...securityForm}>
      <form onSubmit={securityForm.handleSubmit(onSubmit)} className="space-y-6 lg:w-fit w-full">
        <FormField
          control={securityForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input placeholder="Current Password" password type="password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your current password.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={securityForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="New Password" password type="password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your new password. Make sure you store somewhere safe and don't share it with anyone
              </FormDescription>
            </FormItem>
          )}
        />
        <Button  disabled={isLoading} isLoading={isLoading}  type="submit" className="w-full md:w-fit">Update password</Button>
      </form>
    </Form>
  </>
  )
}