'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, Side, Stock, Stock_Log } from "@prisma/client";
import ChartComponent from "@/components/chart/ChartComponent2";
import Sales from "./sales";

function organizeDataByYear(orders: Order[]) {
    const result: { Revenue: number; date: string }[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    for (let monthOffset = 0; monthOffset < 13; monthOffset++) {
        let targetMonth = currentMonth - monthOffset;
        let targetYear = currentYear;
        if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
        }
        let totalPrice = 0;

        const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const startTime = new Date(targetYear, targetMonth - 1, day, hour, 0, 0);
                const endTime = new Date(targetYear, targetMonth - 1, day, hour + 1, 0, 0);
                const ordersWithinInterval = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= startTime && orderDate < endTime;
                });
                totalPrice += ordersWithinInterval.reduce((acc, curr) => acc + curr.price, 0);
            }
        }

        const formattedDate = `${targetYear}/${targetMonth}`;
        result.push({ Revenue: totalPrice, date: formattedDate });
    }

    return result.reverse();
}

function organizeDataByMonth(orders: Order[],) {
    const result: { Revenue: number; date: string }[] = [];

    for (let dayOffset = 0; dayOffset < 31; dayOffset++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - dayOffset);
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        let totalPrice = 0;
        for (let hour = 0; hour < 24; hour++) {
            const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
            const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
            const ordersWithinInterval = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startTime && orderDate < endTime;
            });
            totalPrice += ordersWithinInterval.reduce((acc, curr) => acc + curr.price, 0);
        }

        const formattedDate = `${currentDay}/${currentMonth}`;
        result.push({ Revenue: totalPrice, date: formattedDate });
    }

    return result.reverse(); // Reversing the result array to have data for the past 30 days in chronological order.
}

function organizeDataByDay(orders: Order[]) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const result: { Revenue: number; date: string }[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
        const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
        const ordersWithinInterval = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startTime && orderDate < endTime;
        });
        const totalPrice = ordersWithinInterval.reduce((acc, curr) => acc + curr.price, 0);
        const formattedTime = `${hour}:00`;
        result.push({ Revenue: totalPrice, date: formattedTime });

    }

    return result;
}

function organizeOrderDataByYear(orders: Order[]) {
    const result: { Order: number; date: string }[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    for (let monthOffset = 0; monthOffset < 13; monthOffset++) {
        let targetMonth = currentMonth - monthOffset;
        let targetYear = currentYear;
        if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
        }
        let totalOrders = 0;

        const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const startTime = new Date(targetYear, targetMonth - 1, day, hour, 0, 0);
                const endTime = new Date(targetYear, targetMonth - 1, day, hour + 1, 0, 0);
                const ordersWithinInterval = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= startTime && orderDate < endTime;
                });
                totalOrders += ordersWithinInterval.length
            }
        }

        const formattedDate = `${targetYear}/${targetMonth}`;
        result.push({ Order: totalOrders, date: formattedDate });
    }

    return result.reverse();
}
function organizeOrderDataByMonth(orders: Order[]) {
    const result: { Order: number; date: string }[] = [];

    for (let dayOffset = 0; dayOffset < 31; dayOffset++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - dayOffset);
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        let totalOrders = 0;
        for (let hour = 0; hour < 24; hour++) {
            const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
            const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
            const ordersWithinInterval = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startTime && orderDate < endTime;
            });
            totalOrders += ordersWithinInterval.length
        }

        const formattedDate = `${currentDay}/${currentMonth}`;
        result.push({ Order: totalOrders, date: formattedDate });
    }

    return result.reverse();
}
function organizeOrderDataByDay(orders: Order[]) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const result: { Order: number; date: string }[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
        const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
        const ordersWithinInterval = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startTime && orderDate < endTime;
        });
        const totalOrders = ordersWithinInterval.length
        const formattedTime = `${hour}:00`;
        result.push({ Order: totalOrders, date: formattedTime });

    }

    return result;
}

function organizeProfitDay(sideExpenses: (Stock & { 'Stock_Log': Stock_Log[] })[]) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const result = [];
    for (const stockL of sideExpenses) {
        const res = []
        for (let hour = 0; hour < 24; hour++) {
            const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
            const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
            const ordersWithinInterval = stockL.Stock_Log.filter(stock => {
                const stockDate = new Date(stock.date);
                return stockDate >= startTime && stockDate < endTime;
            });

            const totalPrice = ordersWithinInterval.reduce((acc, curr) => acc + curr.stock, 0);
            const formattedTime = `${hour}:00`;
            res.push({ Expenses: totalPrice, date: formattedTime });
        }
        result.push(res);
    }


    const mergedExpenses: any[] = [];
    for (const expenses of result) {
        for (const expense of expenses) {
            const { Expenses, date } = expense;
            let found = false;

            for (const mergedExpense of mergedExpenses) {
                if (mergedExpense.date === date) {
                    mergedExpense.Expenses += Expenses;
                    found = true;
                    break;
                }
            }

            if (!found) {
                mergedExpenses.push({ date, Expenses });
            }
        }
    }


    return mergedExpenses;
}
function organizeProfitMonth(sideExpenses: (Stock & { 'Stock_Log': Stock_Log[] })[]) {
    const result = [];

    for (const stockL of sideExpenses) {
        const res = []
        for (let dayOffset = 0; dayOffset < 31; dayOffset++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - dayOffset);
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            let totalPrice = 0;
            for (let hour = 0; hour < 24; hour++) {
                const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
                const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
                const ordersWithinInterval = stockL.Stock_Log.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= startTime && orderDate < endTime;
                });
                totalPrice += ordersWithinInterval.reduce((acc, curr) => acc + curr.stock, 0);
            }

            const formattedDate = `${currentDay}/${currentMonth}`;
            res.push({ Expenses: totalPrice, date: formattedDate });
        }
        result.push(res);
    }
    let res1 = result.reverse();

    const mergedExpenses: any[] = [];
    for (const expenses of res1) {
        for (const expense of expenses) {
            const { Expenses, date } = expense;
            let found = false;

            for (const mergedExpense of mergedExpenses) {
                if (mergedExpense.date === date) {
                    mergedExpense.Expenses += Expenses;
                    found = true;
                    break;
                }
            }

            if (!found) {
                mergedExpenses.push({ date, Expenses });
            }
        }
    }
    return mergedExpenses;
}


function organizeProfitYear(sideExpenses: (Stock & { 'Stock_Log': Stock_Log[] })[]) {
    const result = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    for (const stockL of sideExpenses) {
        const res = []
        for (let monthOffset = 0; monthOffset < 13; monthOffset++) {
            let targetMonth = currentMonth - monthOffset;
            let targetYear = currentYear;
            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear -= 1;
            }
            let totalPrice = 0;

            const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                for (let hour = 0; hour < 24; hour++) {
                    const startTime = new Date(targetYear, targetMonth - 1, day, hour, 0, 0);
                    const endTime = new Date(targetYear, targetMonth - 1, day, hour + 1, 0, 0);
                    const ordersWithinInterval = stockL.Stock_Log.filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate >= startTime && orderDate < endTime;
                    });
                    totalPrice += ordersWithinInterval.reduce((acc, curr) => acc + curr.stock, 0);
                }
            }
            const formattedDate = `${targetYear}/${targetMonth}`;
            res.push({ Expenses: totalPrice, date: formattedDate });
        }
        result.push(res);

    }
    let res1 = result.reverse();

    const mergedExpenses: any[] = [];
    for (const expenses of res1) {
        for (const expense of expenses) {
            const { Expenses, date } = expense;
            let found = false;

            for (const mergedExpense of mergedExpenses) {
                if (mergedExpense.date === date) {
                    mergedExpense.Expenses += Expenses;
                    found = true;
                    break;
                }
            }

            if (!found) {
                mergedExpenses.push({ date, Expenses });
            }
        }
    }

    return mergedExpenses;
}


function mergeData(data: any[], data1: any[]) {
    const mergedData = [];

    for (let i = 0; i < data.length; i++) {
        mergedData.push({
            Expenses: data[i].Expenses,
            Revenue: data1[i].Revenue,
            date: data[i].date
        });
    }

    return mergedData;
}


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const OverView = ({ sideExpenses, orders }: { orders: Order[], sideExpenses: (Stock & { 'Stock_Log': Stock_Log[] })[] }) => {
    const dataYear = organizeDataByYear(orders);
    const dataMonth = organizeDataByMonth(orders);
    const dataDay = organizeDataByDay(orders);
    const dataOrderYear = organizeOrderDataByYear(orders);
    const dataOrderMonth = organizeOrderDataByMonth(orders);
    const dataOrderDay = organizeOrderDataByDay(orders);
    const dataExpensesDay = organizeProfitDay(sideExpenses);
    const dataExpensesMonth = organizeProfitMonth(sideExpenses);
    const dataExpensesYear = organizeProfitYear(sideExpenses);
    const dataProfitDay = mergeData(dataExpensesDay, dataDay);
    const dataProfitMonth = mergeData(dataExpensesMonth.reverse(), dataMonth);
    const dataProfitYear = mergeData(dataExpensesYear.reverse(), dataYear);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-2 lg:col-span-5 pt-6">
                    <CardContent className="pl-2">
                        <ChartComponent dataProfitYear={dataProfitYear} dataProfitMonth={dataProfitMonth} dataProfitDay={dataProfitDay} dataOrderDay={dataOrderDay} dataOrderMonth={dataOrderMonth} dataOrderYear={dataOrderYear} dataDay={dataDay} dataMonth={dataMonth} dataYear={dataYear} />
                    </CardContent>
                </Card>
                <Card className="col-span-5 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Sales orders={orders} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
export default OverView;