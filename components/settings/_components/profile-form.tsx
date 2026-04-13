"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Employee, Order, User } from "@prisma/client";
import { InputIcon } from "@/components/inputs/inputIcon";
import { Phone, PhoneCall, PhoneIncomingIcon } from "lucide-react";
import { updateProfile } from "@/actions/settings/profile/updateProfile";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateEmployee } from "@/actions/settings/profile/updateProfileEmployee";
import React, { useState } from "react";
import { verifyEmail } from "@/actions/users/verify-email/send-verify-email";
import { SingleImageDropzone } from "@/components/inputs/ImageUpload";
import { useEdgeStore } from "@/lib/edgestore";

const ownerFormSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  image: z.string(),
});

const employeeFormSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name." })
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  address: z
    .string({ required_error: "Please enter an adress." })
    .min(1, { message: "Please enter an adress" }),
  phone: z
    .string({ required_error: "Please enter a phone number" })
    .min(1, { message: "Please enter a phone number" }),
  image: z.string(),
});

export type onwnerFormValues = z.infer<typeof ownerFormSchema>;
export type employeeFormValues = z.infer<typeof employeeFormSchema>;

export function ProfileForm({
  user,
  employee,
}: {
  user: User;
  employee: Employee | null;
}) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | undefined | string>(user.image);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const ownerDefaultValues: Partial<onwnerFormValues> = {
    name: user.name,
    image: user.image,
  };

  const employeeDefaultValues: Partial<employeeFormValues> = {
    name: user.name,
    address: employee?.address,
    phone: employee?.phone,
    image: user.image,
  };

  const ownerForm = useForm<onwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: ownerDefaultValues,
    mode: "onChange",
  });

  const employeeForm = useForm<employeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employeeDefaultValues,
    mode: "onChange",
  });

  async function onSubmitOwnerForm(data: onwnerFormValues) {
    setIsLoading(true);
    if (typeof file != "string" && typeof file != "undefined") {
      const res = await edgestore.myPublicImages.upload({
        file,
      });
      if (res.url) {
        data.image = res.url;
      }
    }

    if (file === undefined) {
      data.image = "";
    }
    const message = await updateProfile(data, user.id);
    if (message.error) {
      toast.error(message.error);
    } else {
      toast.success("Profile Updated");
      router.refresh();
    }

    setIsLoading(false);
  }

  async function onSubmitEmployeeForm(data: employeeFormValues) {
    setIsLoading(true);

    if (typeof file != "string" && typeof file != "undefined") {
      const res = await edgestore.myPublicImages.upload({
        file,
      });
      if (res.url) {
        data.image = res.url;
      }
    }

    if (file === undefined) {
      data.image = "";
    }

    const message = await updateEmployee(data, user.id, employee?.id);
    if (message.error) {
      toast.error(message.error);
    } else {
      toast.success("Profile Updated");
      router.refresh();
    }
    setIsLoading(false);
  }

  async function onSubmitEmail() {
    const message = await verifyEmail();
    if (message.error) {
      toast.error(message.error);
    } else {
      toast.success("Email Sended");
    }
  }

  let form = (
    <Form {...ownerForm}>
      <form
        onSubmit={ownerForm.handleSubmit(onSubmitOwnerForm)}
        className="w-full space-y-6 lg:w-fit"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="w-full space-y-6 pr-5 lg:w-fit">
            <FormField
              control={ownerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym. You can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" disabled value={user.email} />
              </FormControl>
              {!user.emailVerifiedAt ? (
                <>
                  <FormDescription className=" ">
                    <span className="text-red-500">
                      Your email is not verified
                    </span>
                    <Link
                      className="mx-1 font-bold text-red-500 underline"
                      href={
                        "mailto:?subject=Your%20Subject&body=Your%20Search%20Query"
                      }
                    >
                      Verify Now.
                    </Link>
                    <span className=""> Didnt receive the email?</span>
                    <Link
                      className="ml-1 font-bold underline"
                      href={""}
                      onClick={onSubmitEmail}
                    >
                      Send again.
                    </Link>
                  </FormDescription>
                </>
              ) : user.role === "OWNER" ? (
                <FormDescription>
                  If you want to change your email address please contact our{" "}
                  <Link href={"/support"}>support</Link>
                </FormDescription>
              ) : (
                <FormDescription>
                  If you want to change your email address please contact your
                  manager.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>

            <Button
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
              className="w-full md:w-fit"
            >
              Update profile
            </Button>
          </div>
          <div className="hidden w-full justify-start pl-10 md:flex md:flex-1">
            <SingleImageDropzone
              avatarBig
              width={100}
              height={100}
              value={file}
              className="relative mt-5 h-72 w-72 rounded-full"
              onChange={(file) => {
                setFile(file);
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );

  if (user.role === "EMPLOYEE") {
    form = (
      <Form {...employeeForm}>
        <form
          onSubmit={employeeForm.handleSubmit(onSubmitEmployeeForm)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="w-full space-y-6 pr-5 lg:w-fit">
              <FormField
                control={employeeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name. It can be your real name
                      or a pseudonym. You can only change this once every 30
                      days.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" disabled value={user.email} />
                </FormControl>
                {!user.emailVerifiedAt && (
                  <>
                    <FormDescription className=" ">
                      <span className="text-red-500">
                        Your email is not verified
                      </span>
                      <Link
                        className="mx-1 font-bold text-red-500 underline"
                        href={
                          "mailto:?subject=Your%20Subject&body=Your%20Search%20Query"
                        }
                      >
                        Verify Now.
                      </Link>
                      <span className=""> Didnt receive the email?</span>
                      <Link
                        className="ml-1 font-bold underline"
                        href={""}
                        onClick={onSubmitEmail}
                      >
                        Send again.
                      </Link>
                    </FormDescription>
                  </>
                )}
                <FormMessage />
              </FormItem>

              <FormField
                control={employeeForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={employeeForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <InputIcon icon={Phone} placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
                className="w-full md:w-fit"
              >
                Update profile
              </Button>
            </div>
            <div className="hidden w-full justify-start pl-10 md:flex md:flex-1">
              <SingleImageDropzone
                avatarBig
                width={100}
                height={100}
                value={file}
                className="relative mt-5 h-72 w-72 rounded-full"
                onChange={(file) => {
                  setFile(file);
                }}
              />
            </div>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <>
      {form}
      <div className="text-muted-foreground mt-10 flex-1 text-justify text-sm">
        <p>Created at : {user.createdAt.toLocaleDateString()}</p>
        <p>Last update : {user.updatedAt.toLocaleDateString()}</p>
      </div>
    </>
  );
}
