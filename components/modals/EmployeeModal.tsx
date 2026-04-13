"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Restaurant } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Heading from "../Heading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import useEmployeeModal from "../hooks/useEmployeeModal";
import Modal from "./Modal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { addEmployees } from "@/actions/employee/addEmployee";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const addEmployeeSchema = z.object({
  email: z
    .string({ required_error: "Please provide a email" })
    .email({ message: "Please enter a valid email." }),
  name: z
    .string({ required_error: "Please provide a name" })
    .min(3, { message: "Name must be at least 3 chracters" }),
  password: z
    .string({ required_error: "Please enter a password" })
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character",
    )
    .min(8, "Must be at least 8 characters in length"),
  phone: z.string({ required_error: "Please provide a phone number" }),
  address: z.string({ required_error: "Please provide a address." }),
  permissions: z.enum(["READ", "WRITE_READ"], {
    required_error: "Please provide the permissions.",
  }),
});

export type addEmployeeFormValues = z.infer<typeof addEmployeeSchema>;

const EmployeeModal = ({ params }: { params: { id: string } }) => {
  const EmployeeModal = useEmployeeModal();
  const form = useForm<addEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    mode: "onChange",
  });

  const onClose = () => {
    EmployeeModal.onClose();
    form.reset();
    form.clearErrors();
  };

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: addEmployeeFormValues) {
    setIsLoading(true);

    const message = await addEmployees(data, params.id);
    if (message.error) {
      toast.error(message.error);
    } else if (message.createdEmployee) {
      toast.success("Employee added");
    }
    onClose();
    setIsLoading(false);
  }

  const bodyConent = (
    <div className="flex flex-col gap-1">
      <Heading title={`Add Employees to your restaurant`} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name={`name`}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={`Name`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"permissions"}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Permission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent style={{ zIndex: 110 }}>
                      <SelectItem value="READ">Read</SelectItem>
                      <SelectItem value="WRITE_READ">Read and Write</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name={`email`}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input {...field} placeholder={`Email`} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`password`}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input {...field} placeholder={`Password`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`address`}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Address</FormLabel>

                <FormControl>
                  <Input {...field} placeholder={`Address`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`phone`}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Phone Number</FormLabel>

                <FormControl>
                  <Input {...field} placeholder={`Phone Number`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-row items-center gap-4 pt-2 ">
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              className="mt-1 w-full"
              type="submit"
            >
              Add Employee
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={EmployeeModal.isOpen}
        onSubmit={() => null}
        onClose={onClose}
        actionLabel={undefined}
        secondaryActionLabel={""}
        secondaryAction={() => null}
        body={bodyConent}
        title="Add Employee"
      />
    </>
  );
};

export default EmployeeModal;
