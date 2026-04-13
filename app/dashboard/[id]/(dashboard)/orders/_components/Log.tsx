"use client"
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Order_Log, User } from "@prisma/client";

const Log = ({ changes, orderLog }: { changes: string, orderLog: (Order_Log & { user: User | null }) }) => {
    const changesJson = JSON.parse(changes);
    return (
        <div>
            <h1 className="text-2xl font-semibold">{orderLog.logType}</h1>
            <Table className="border mt-2">
                <TableBody className="bg-card">
                    <TableRow className={`flex`} >
                        <TableCell className="w-28">LogId</TableCell>
                        <TableCell>{orderLog.id}</TableCell>
                    </TableRow>
                    <TableRow className={`flex`} >
                        <TableCell className="w-28">Status</TableCell>
                        <TableCell >
                            <span className="bg-muted dark:bg-muted/50 w-fit rounded-sm px-2 p-1 font-light  ">
                                {changesJson.status}
                            </span>
                        </TableCell>
                    </TableRow>
                    {orderLog.user && (
                        <TableRow className={`flex`} >
                            <TableCell className="w-28">Employee</TableCell>
                            <TableCell>{orderLog.user.name}</TableCell>
                        </TableRow>
                    )}
                    <TableRow className={`flex`} >
                        <TableCell className="w-28 ">Updated at</TableCell>
                        <TableCell>{orderLog.createdAt.toLocaleTimeString()}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {changesJson.status != 'DELETED' && changesJson.status != 'CANCELED' && (
                <div className="mt-2">
                    <div className="flex flex-col gap-1 mt-2">
                        <h1 className="flex items-center justify-center pb-0 text-3xl font-bold">
                            Order
                        </h1>
                        <h1 className="text-mb flex items-center justify-center text-gray-500">
                            Summary
                        </h1>
                    </div>
                    <Separator className="mt-5" />
                    <ScrollArea className="w-full h-64 2xl:h-72 rounded-md mt-3">
                        <div className="flex flex-col gap-1 mt-2 px-3">
                            {changesJson.Item_Menu_Order?.map((item: any) => {
                                return (
                                    <>
                                        <div key={item.id} >
                                            <div className="flex w-full flex-col gap-0 p-0 ">
                                                <div className="flex justify-between">
                                                    <div className="flex w-full justify-start">
                                                        <span>{item.menu.name}</span>
                                                    </div>
                                                    <div className="flex w-full justify-end gap-3">
                                                        <span className="flex items-center justify-between">
                                                            {item.menu.price.toFixed(2)}€
                                                        </span>
                                                        <span className="flex items-center font-semibold justify-between">
                                                            qnt:{item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-10">
                                                {item.Item_Menu_Product_Order?.map((item1: any) => (
                                                    <div key={item1.id} className="flex w-full flex-col gap-0 p-0 ">
                                                        <div className="flex justify-between">
                                                            <div className="flex w-full justify-start">
                                                                <span>{item1.product.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </>
                                )
                            })}
                            {changesJson.Item_Product_Order?.map((item: any) => (
                                <div key={item.id} className="flex w-full flex-col gap-0 p-0 ">
                                    <div className="flex justify-between">
                                        <div className="flex w-full justify-start">
                                            <span>{item.product.name}</span>
                                        </div>
                                        <div className="flex w-full justify-end gap-3">
                                            <span className="flex items-center justify-between">
                                                {item.product.price.toFixed(2)}€
                                            </span>
                                            <span className="flex items-center font-semibold justify-between">
                                                qnt:{item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="w-full flex flex-col gap-1 font-semibold mt-5">
                                {changesJson.discount && (
                                    <div className="flex w-full justify-between">
                                        <span>Discount:</span>
                                        <span>
                                            {changesJson.discount}%
                                        </span>
                                    </div>
                                )}
                                <div className="flex w-full justify-between">
                                    <span>Total:</span>
                                    <span>
                                        {changesJson.price}€
                                    </span>
                                </div>
                            </div>

                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}
export default Log