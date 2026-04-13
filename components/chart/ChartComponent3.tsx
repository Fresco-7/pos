"use client"
import Chart from "@/components/chart/chart2";
import { useState } from "react";
import * as React from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "../ui/button";


const ChartComponent = ({ data }: { data: any[]},) => {
    
    return (
        <div>
            <div className='bg-card rounded-xl py-5 p-10 pl-0 border shadow-md'>
                <Chart data={data} />
            </div>
        </div>
    );
}
export default ChartComponent;