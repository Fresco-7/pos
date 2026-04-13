"use client"
import Chart from "@/components/chart/chart";
import { useState } from "react";
import * as React from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "../ui/button";


const ChartComponent = ({ dataMonth, dataDay, dataYear, name }: { dataDay: any[], dataMonth: any[], dataYear: any[], name: string },) => {
    const [data, setData] = useState(dataDay);
    const [value, setValue] = useState('Today');

    return (
        <div>
            <div className="space-y-0.5 justify-between flex items-center ">
                <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                <div className="flex justify-center items-center gap-1">

                    <Select value={value} onValueChange={(value1) => {
                        {
                            if (value === value1) return
                            setValue(value1);
                            if (value1 === 'Today') {
                                setData(dataDay)
                            } else if (value1 === 'Last Month') {
                                setData(dataMonth)
                            } else if (value1 === 'This Year') {
                                setData(dataYear)
                            }
                        }
                    }} >
                        <SelectTrigger className="w-32 bg-card">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup className="pt-1">
                                <SelectItem value="Today">Today</SelectItem>
                                <SelectItem value="Last Month">Last Month</SelectItem>
                                <SelectItem value="This Year">This Year</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
            </div>
            <div className='bg-card mt-3 rounded-md py-5 p-10 pl-0 border shadow-sm'>
                <Chart data={data} />
            </div>
        </div>
    );
}
export default ChartComponent;