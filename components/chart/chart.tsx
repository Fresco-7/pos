"use client"

import { AreaChart } from '@tremor/react';

export default function Chart({ data }: { data: ({ quantity: number, date: string })[] }) {

    return (

        <AreaChart
            className="h-80"
            data={data}
            index="date"
            categories={['quantity']}
            colors={['blue']}
            yAxisWidth={60} 
            noDataText='No data. Run your first test to get started!'
        />

    )
}