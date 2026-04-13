"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Modal from ".././Modal";
import { Input } from "@/components/ui/input";
import Heading from "@/components/Heading";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { createSide } from "@/actions/side/createSide";
import toast from "react-hot-toast";
import useEditAddStockModalModal from "@/components/hooks/useEditAddStockModal";
import { updateSide } from "@/actions/side/updateSide";

const complementFormSchema = z.object({
    name: z
        .string({ required_error: "Please provide a name" })
        .min(3, { message: "Name must be at least 3 chracters" }),
    stock: z
        .string({ required_error: "Please provide a stock for your product" })
        .regex(/^\d+$/, { message: "Enter a valid stock" }),
});

export type editSideFormValues = z.infer<typeof complementFormSchema>;
const EditSideModal = ({
    params,
}: {
    params: { id: string };
}) => {
    const sideModal = useEditAddStockModalModal();
    const form = useForm<editSideFormValues>({
        resolver: zodResolver(complementFormSchema),
        mode: "onChange",
    });
    const side = sideModal.side
    useEffect(() => {
        if (side != null) {
            form.setValue('name', side.name);
            const stock = side.Stock?.stock.toString();
            if (stock != null && stock != undefined) {
                form.setValue('stock', stock);
            }
        }

    }, [side]);

    const [isLoading, setIsLoading] = useState(false);

    const onClose = () => {
        form.reset();
        form.clearErrors();
        sideModal.onClose();
    };

    let bodyConent = (
        <div className="flex flex-col gap-1">
            <Heading title={`Give us information about your side`} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
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
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder={`Name`} />
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
                            Edit Side
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );

    async function onSubmit(data: editSideFormValues) {
        setIsLoading(true);
        const id = side?.id
        if (id) {
            const restaurant = await updateSide(id, data);
            if (restaurant.error) {
                toast.error(restaurant.error);
            } else {
                toast.success("Side updated");
                onClose();
            }
        }else{
            toast.error("Error");
        }
        setIsLoading(false);
    }

    return (
        <>
            <Modal
                isOpen={sideModal.isOpen}
                onSubmit={() => null}
                onClose={onClose}
                actionLabel={undefined}
                secondaryActionLabel={""}
                secondaryAction={() => null}
                body={bodyConent}
                title="Edit Side"
            />
        </>
    );
};

export default EditSideModal;
