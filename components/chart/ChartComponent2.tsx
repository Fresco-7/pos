"use client"
import { useState } from "react";
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AreaChart, LineChart } from "@tremor/react";



const ChartComponent = ({ dataProfitDay, dataProfitMonth, dataProfitYear, dataMonth, dataDay, dataYear, dataOrderDay, dataOrderMonth, dataOrderYear }: { dataProfitDay: any[], dataDay: any[], dataMonth: any[], dataYear: any[], dataOrderDay: any[], dataOrderMonth: any[], dataOrderYear: any[], dataProfitMonth: any[], dataProfitYear: any[] }) => {
    const [data, setData] = useState(dataDay);
    const [dataOrder, setDataOrder] = useState(dataOrderDay);
    const [dataProfit, setDataProfit] = useState(dataProfitDay);
    const [value, setValue] = useState('Today');
    const totalProfit = dataProfit.reduce((acc, curr) => acc + (curr.Revenue - curr.Expenses), 0);
    const totalData = data.reduce((acc, curr) => acc + curr.Revenue, 0);
    const totalOrder = dataOrder.reduce((acc, curr) => acc + curr.Order, 0);
    const valueFormatter = function (number: number) {
        return new Intl.NumberFormat('us').format(number).toString() + '€';
    };

    return (
        <div>
            <Tabs defaultValue='Revenue' className="w-full">
                <div className="space-y-0.5 w-full justify-between flex items-center ">
                    <div className="flex flex-col md:flex-row w-full items-end  justify-between gap-2 pl-8 pr-10 ">
                        <TabsList className="grid grid-cols-3 w-full md:w-2/3 lg:5/6 xl:w-1/2 px-1">
                            <TabsTrigger value="Revenue" >Revenue</TabsTrigger>
                            <TabsTrigger value="Profit" >Profit</TabsTrigger>
                            <TabsTrigger value="Orders" >Orders</TabsTrigger>
                        </TabsList>
                        <Select value={value} onValueChange={(value1) => {
                            {
                                if (value === value1) return
                                setValue(value1);
                                if (value1 === 'Today') {
                                    setData(dataDay);
                                    setDataOrder(dataOrderDay);
                                    setDataProfit(dataProfitDay);
                                } else if (value1 === 'Last Month') {
                                    setData(dataMonth);
                                    setDataOrder(dataOrderMonth);
                                    setDataProfit(dataProfitMonth);
                                } else if (value1 === 'This Year') {
                                    setData(dataYear);
                                    setDataOrder(dataOrderYear);
                                    setDataProfit(dataProfitYear);
                                }
                            }
                        }}>
                            <SelectTrigger className="md:w-32 bg-card w-full">
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
                <TabsContent value="Profit">
                    <div className='bg-card mt-3 pl-1 py-5 p-10 '>
                        <h1 className="font-bold text-xl ml-8">Profit: <span className={`${totalProfit.toFixed(2) > 0 ? 'text-green-500' : 'text-red-500'}`}>{totalProfit.toFixed(2)}€</span></h1>
                        <AreaChart
                            className="h-80"
                            data={dataProfit}
                            index="date"
                            categories={['Revenue', "Expenses"]}
                            colors={['green', 'red']}
                            valueFormatter={valueFormatter}
                            yAxisWidth={60}
                            noDataText='No data. Run your first test to get started!'
                        />
                    </div>
                </TabsContent>
                <TabsContent value="Revenue">
                    <div className='bg-card mt-3 pl-1 py-5 p-10 '>
                        <h1 className="font-bold text-xl ml-8">Total: {totalData.toFixed(2)}€</h1>
                        <AreaChart
                            className="h-80"
                            data={data}
                            index="date"
                            categories={['Revenue']}
                            colors={['blue']}
                            valueFormatter={valueFormatter}
                            yAxisWidth={60}
                            noDataText='No data. Run your first test to get started!'
                        />
                    </div>
                </TabsContent>
                <TabsContent value="Orders">
                    <div className='bg-card mt-3 pl-1 py-5 p-10 '>
                        <h1 className="font-bold text-xl ml-8">Total: {totalOrder}</h1>
                        <AreaChart
                            className="h-80"
                            data={dataOrder}
                            index="date"
                            categories={['Order']}
                            colors={['rose']}
                            yAxisWidth={60}
                            noDataText='No data. Run your first test to get started!'
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
export default ChartComponent;
