'use client';

import { Side, Product, Stock } from "@prisma/client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

interface ProductBoxProps {
    side: (Side & { Stock: Stock | null })
    selected?: boolean;
    onClick: (param: string, value: number, value2: number) => void;
    stockValue: number
}



const sideSchema = z.object({
    amount: z
        .string({ required_error: "Please provide a amout for your side" })
        .regex(/^\d+([\,]\d+)*([\.]\d+)?$/, { message: "Enter a valid amount" }),
});

export type sideBox = z.infer<typeof sideSchema>;



const SideBox: React.FC<ProductBoxProps> = ({
    side,
    selected,
    onClick,
    stockValue
}) => {

    const form = useForm<sideBox>({
        resolver: zodResolver(sideSchema),
        mode: "onChange",
        defaultValues: {
            amount: stockValue.toString(),
        },
    });

    const onSubmit = (data: sideBox) => {
        onClick("sides", side.id, parseFloat(data.amount));
    }

    return (
        <div
            className={`
        rounded-xl
        border-2
        p-4
        flex
        flex-col
        gap-3
        ${!selected ? 'hover:border-primary/40' : null}
        transition-all
        cursor-pointer
        ${selected ? 'border-primary' : 'border-border'}
        w-full
      `}
        >

            <div className="font-semibold w-fit flex justify-center items-center gap-3">
                <span className="flex">
                    {side.name}
                </span>
                <div className="flex gap-2 justify-center items-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1 justify-center items-center">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="space-y-0 flex gap-1 justify-center items-center">
                                        <FormControl >
                                            <Input placeholder={"Amount"} {...field} />
                                        </FormControl>
                                        <span className=" font-light w-16">{side.Stock?.type}</span>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                variant={'outline'} type="submit">{selected ? "Unselect" : "Select"}</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default SideBox;