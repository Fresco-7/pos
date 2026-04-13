"use client"

import { LineChart } from '@tremor/react';

export default function Chart({ data }: { data: ({ quantity: number, date: string })[] }) {

    return (

        <LineChart
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