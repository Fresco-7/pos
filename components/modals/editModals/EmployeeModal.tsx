"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod"
import {  useEffect, useState } from "react";
import toast from "react-hot-toast";
import useEmployeeEditModal from "@/components/hooks/useEditEmployeeModal";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateEmployeeProfile } from "@/actions/employee/updateEmployee";
const editEmployeeFormSchem = z.object({
    email: z.string({ required_error: "Please provide a email" }).email({ message: "Please enter a valid email." }),
    name: z.string({ required_error: "Please provide a name" }).min(3, { message: "Name must be at least 3 chracters" }),
    phone: z.string({ required_error: "Please provide a phone number" }),
    address: z.string({ required_error: "Please provide a address." }),
    permissions: z.enum(["READ", "WRITE_READ"], { required_error: "Please provide the permissions." }),
    id: z.string({ required_error: "Please provide a id." }),
});

export type editEployeeFormValues = z.infer<typeof editEmployeeFormSchem>
const EditEmployeeModal = () => {
    const EmployeeModal = useEmployeeEditModal();
    const form = useForm<editEployeeFormValues>({
        resolver: zodResolver(editEmployeeFormSchem),
        mode: "onChange",
    });
    const employee = EmployeeModal.employee
    useEffect(() => {
        if (employee != null) {
            
            form.setValue('name', employee.user.name);
            form.setValue('email', employee.user.email);
            form.setValue('phone', employee.phone);
            form.setValue('address', employee.address);
            form.setValue('permissions', employee.permissions);
            form.setValue('id', employee.id);
        }
    }, [employee]);


    const onClose = () => {
        EmployeeModal.onClose()
        form.reset()
        form.clearErrors();
    }

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(data: editEployeeFormValues) {
        setIsLoading(true);

        const message = await updateEmployeeProfile(data);
        if (typeof(message) != 'string') {
            toast.error(message.error);
        } else {
            toast.success("Profile Updated");
        }
        onClose();
        setIsLoading(false);
    }

    const bodyConent = (
        <div className="flex flex-col gap-1">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name={`name`}
                        
                        render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input  {...field} placeholder={`Name`} disabled/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={'permissions'}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Permissions</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={employee?.permissions} >
                                        <FormControl>
                                            <SelectTrigger>
                                               {field.value}
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent style={{ zIndex: 110 }}>
                                            <SelectItem defaultChecked value="READ">Read</SelectItem>
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
                                <FormLabel >
                                    Email
                                </FormLabel>

                                <FormControl>
                                    <Input {...field} placeholder={`Email`} disabled/>
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
                                <FormLabel >
                                    Address
                                </FormLabel>

                                <FormControl>
                                    <Input {...field} placeholder={`Address`}disabled />
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
                                <FormLabel >
                                    Phone Number
                                </FormLabel>

                                <FormControl>
                                    <Input {...field} placeholder={`Phone Number`} disabled/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row items-center gap-4 w-full pt-2 ">
                        <Button disabled={isLoading} isLoading={isLoading} className="w-full mt-1" type="submit">Edit Employee</Button>
                    </div>
                </form>
            </Form>
        </div>
    )

    return (
        <>
            <Modal
                isOpen={EmployeeModal.isOpen}
                onSubmit={() => (null)}
                onClose={onClose}
                actionLabel={undefined}
                secondaryActionLabel={""}
                secondaryAction={() => null}
                body={bodyConent}
                title="Edit Employee"
            />
        </>
    )
}

export default EditEmployeeModal;
