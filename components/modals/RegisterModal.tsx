'use client';

import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useLoginModal from "@/components/hooks/useLoginModal";
import useRegisterModal from "@/components/hooks/useRegisterModal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import Heading from "@/components/Heading";
import { Button } from "../ui/button";
import { registerUser } from "@/actions/users/registerUser";

const profileFormSchema = z.object({
  name: z.string({ required_error: "Please enter a name.", })
    .min(2, { message: "Name must be at least 2 characters.", })
    .max(30, { message: "Username must not be longer than 30 characters.", }),
  email: z.string({ required_error: "Please enter an email.", })
    .email(),
  password: z.string({ required_error: "Please enter a password" })
    .regex(new RegExp(".*[A-Z].*"), "Password must have an uppercase character")
    .regex(new RegExp(".*[a-z].*"), "Password must have a lowercase character")
    .regex(new RegExp(".*\\d.*"), "Password must have a number")
    .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),"Password must have special character")
    .min(8, "Must be at least 8 characters in length"),
})

type RegisterFormValues = z.infer<typeof profileFormSchema>

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  })


  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    const message = await registerUser(data.email, data.password, data.name);
    if (typeof message != 'string') {
      toast.error(message.error);
    } else {
      toast.success('Registred');
      handleClose();
    }
    setIsLoading(false);

  }


  const onToggle = useCallback(() => {
    handleClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col">
      <Heading
        title="Welcome to POS Kitchen"
        subtitle="Create an account!"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2.5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div className="">
            <Button disabled={isLoading} isLoading={isLoading} className="w-full mt-1 " type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4">
      <div
        className="
        text-muted-foreground
          text-center 
          font-light
        "
      >
        <p>Already have an account?{' '}
          <span
            onClick={onToggle}
            className="
            text-neutral-800
            dark:text-white
              text-muted-foreground 
              hover:text-primary
              hover:cursor-pointer
              hover:underline
            "
          >Log in</span>
        </p>
      </div>
    </div>
  )
  const handleClose = () => {
    form.reset()
    form.clearErrors()
    registerModal.onClose();
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel={undefined}
      onClose={handleClose}
      onSubmit={() => (null)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
