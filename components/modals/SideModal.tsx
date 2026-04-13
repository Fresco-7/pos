"use client";
import { useState } from "react";
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
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import Heading from "@/components/Heading";
import { Button } from "../ui/button";
import useSideModal from "../hooks/useSideModal";
import { useForm } from "react-hook-form";
import { createSide } from "@/actions/side/createSide";
import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { InputIcon } from "../inputs/inputIcon";
import { EuroIcon } from "lucide-react";

const complementFormSchema = z.object({
    name: z
        .string({ required_error: "Please provide a name" })
        .min(3, { message: "Name must be at least 3 chracters" }),
    stock: z
        .string({ required_error: "Please provide a stock for your product" })
        .regex(/^\d+$/, { message: "Enter a valid stock" }),
    suplier: z.string().optional(),
    cost: z
        .string({ required_error: "Please provide a valid cost per unit" })
        .regex(/^\d+([\,]\d+)*([\.]\d+)?$/, { message: "Enter a valid cost per unit" }),
    type: z.enum(['UNIT', "g"]),
});

export type sideFormValues = z.infer<typeof complementFormSchema>;
const SideModal = ({
    params,
}: {
    params: { id: string };
}) => {
    const sideModal = useSideModal();
    const form = useForm<sideFormValues>({
        resolver: zodResolver(complementFormSchema),
        mode: "onChange",
    });

    const [isLoading, setIsLoading] = useState(false);

    const onClose = () => {
        form.reset();
        form.clearErrors();
        sideModal.onClose();
    };
    const un = form.watch('type');

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
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent style={{ 'zIndex': 120 }}>
                                        <SelectItem value="g">Gramms</SelectItem>
                                        <SelectItem value="UNIT">Uni</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <FormLabel>{un ? `Cost per ${un}` : "Cost"}</FormLabel>
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
                            Create Side
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );

    async function onSubmit(data: sideFormValues) {
        setIsLoading(true);
        const restaurant = await createSide(params.id, data);
        if (restaurant.error) {
            toast.error(restaurant.error);
        } else {
            toast.success("Side created");
            onClose();
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
                title="Create Side"
            />
        </>
    );
};

export default SideModal;
