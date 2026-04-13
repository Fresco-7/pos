"use client"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Order_Log, User } from "@prisma/client";
import React, { useState } from "react";
import Log from "./Log";

const LogComponent = ({ orderLog }: { orderLog: (Order_Log & { user: User | null })[] }) => {
    const [selectedLog, setSelectedLog] = useState<string>();
    const selectedOrderLog = orderLog.filter((m) => m.id === selectedLog)[0]
    let changes;
    selectedOrderLog ? changes = selectedOrderLog.changes?.toString() : null


    return (
        <div className="w-full flex border-t">
            <div className="w-1/2 block ">
                <Table className={`border-b ${selectedLog ? 'border-l' : 'border-x'}`}>
                    <TableBody className="bg-card">
                        {orderLog.map((or) => {
                            if (or.changes) {
                                const timeDifference = Date.now() - or.createdAt.getTime();
                                const minutesAgo = Math.floor(timeDifference / (1000 * 60));
                                let stringDate = `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
                                if (minutesAgo >= 60) {
                                    const hoursAgo = Math.floor(minutesAgo / 60);
                                    stringDate = `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
                                    if (hoursAgo >= 24) {
                                        const daysAgo = Math.floor(hoursAgo / 24);
                                        stringDate = `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
                                    }
                                }


                                return (
                                    <TableRow key={or.id} className={`flex ${selectedLog === or.id ? 'bg-muted hover:bg-muted dark:bg-muted/50 dark:hover:bg-muted/50' : ''} justify-between cursor-pointer`} onClick={() => setSelectedLog(or.id)}>
                                        <TableCell>{or.logType}</TableCell>
                                        <TableCell>{stringDate}</TableCell>
                                    </TableRow>
                                )

                            }
                            return null;
                        })}
                    </TableBody>
                </Table>
            </div>


            {changes && (
                <div className="w-1/2 block border-l overflow-x-auto bg-card border-r border-b pb-10">
                    <div className="p-6 pb-0">
                        <Log orderLog={selectedOrderLog} changes={changes} />
                    </div>
                </div>
            )}

            {!selectedOrderLog && (
                <div className="w-1/2 flex items-center justify-center">
                    <span>Select an event</span>
                </div>
            )}
        </div>
    )
}
export default LogComponent