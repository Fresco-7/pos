"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useEmployeeEditModal from "@/components/hooks/useEditEmployeeModal";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateEmployeeProfile } from "@/actions/employee/updateEmployee";
import { InputIcon } from "@/components/inputs/inputIcon";
import { EuroIcon, Plus } from "lucide-react";
import useAddStockModal from "@/components/hooks/useAddStockModal";
import { addStockSide } from "@/actions/side/addStockSide";

const sideFormSchema = z.object({
    stock: z
        .string({ required_error: "Please provide a stock for your product" })
        .regex(/^\d+$/, { message: "Enter a valid stock" }),
    suplier: z.string().optional(),

    cost: z
        .string({ required_error: "Please provide a valid cost per unit" })
        .regex(/^\d+([\,]\d+)*([\.]\d+)?$/, { message: "Enter a valid cost per unit" }),
});
export type sideAddStockFormValues = z.infer<typeof sideFormSchema>
const AddStockModal = () => {
    const sideAddStockModal = useAddStockModal();
    const form = useForm<sideAddStockFormValues>({
        resolver: zodResolver(sideFormSchema),
        mode: "onChange",
    });

    const side = sideAddStockModal.side

    const onClose = () => {
        sideAddStockModal.onClose()
        form.reset()
        form.clearErrors();
    }

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(data: sideAddStockFormValues) {
        setIsLoading(true);
        if(!side?.id){
            return toast.error('No side, ERROR')
        }
        const restaurant = await addStockSide(side.id, data);
        if (restaurant.error) {
            toast.error(restaurant.error);
        } else {
            toast.success("Side created");
            onClose();
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
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <InputIcon icon={Plus} {...field} placeholder={`Stcok`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="suplier"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <FormLabel>Suplier</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder={`Suplier`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <FormLabel>{`Cost per ${side?.Stock ? side.Stock.type : ""}`}</FormLabel>
                                <FormControl>
                                    <InputIcon
                                        icon={EuroIcon}
                                        placeholder={"26.99"}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex w-full flex-row items-center gap-4 pt-2 ">
                        <Button
                            disabled={isLoading}
                            isLoading={isLoading}
                            className="w-full"
                            type="submit"
                        >
                            Add Stock
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )

    return (
        <>
            <Modal
                isOpen={sideAddStockModal.isOpen}
                onSubmit={() => (null)}
                onClose={onClose}
                actionLabel={undefined}
                secondaryActionLabel={""}
                secondaryAction={() => null}
                body={bodyConent}
                title="Add Stock"
            />
        </>
    )
}

export default AddStockModal;
