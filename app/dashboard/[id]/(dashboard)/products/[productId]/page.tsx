import getCurrentSession from '@/actions/users/getCurrentSession';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import React, { useState } from 'react'
import Link from 'next/link';
import Chart from '@/components/chart/chart';
import ChartComponent from '@/components/chart/ChatComponent';
import { Order } from '@prisma/client';

function mergeOrderData(orderData1: ({ quantity: number, date: string })[], orderData2: ({ quantity: number, date: string })[]) {
    const mergedData = [];

    for (let i = 0; i < orderData1.length; i++) {
        mergedData.push({
            quantity: orderData1[i].quantity + orderData2[i].quantity,
            date: orderData1[i].date
        });
    }

    return mergedData;
}

function organizeDataByDay(orders: ({ quantity: number, order: Order })[]) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const result: { quantity: number; date: string }[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
        const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
        const ordersWithinInterval = orders.filter(order => {
            const orderDate = new Date(order.order.date);
            return orderDate >= startTime && orderDate < endTime;
        });
        const totalQuantity = ordersWithinInterval.reduce((acc, curr) => acc + curr.quantity, 0);
        const formattedTime = `${hour}:00`;
        result.push({ quantity: totalQuantity, date: formattedTime });
    }

    return result;
}
function organizeDataByMonth(orders: ({ quantity: number, order: Order })[]) {
    const result: { quantity: number; date: string }[] = [];

    for (let dayOffset = 0; dayOffset < 31; dayOffset++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - dayOffset);
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        let totalQuantity = 0;
        for (let hour = 0; hour < 24; hour++) {
            const startTime = new Date(currentYear, currentMonth - 1, currentDay, hour, 0, 0);
            const endTime = new Date(currentYear, currentMonth - 1, currentDay, hour + 1, 0, 0);
            const ordersWithinInterval = orders.filter(order => {
                const orderDate = new Date(order.order.date);
                return orderDate >= startTime && orderDate < endTime;
            });
            totalQuantity += ordersWithinInterval.reduce((acc, curr) => acc + curr.quantity, 0);
        }

        const formattedDate = `${currentDay}/${currentMonth}`;
        result.push({ quantity: totalQuantity, date: formattedDate });
    }

    return result.reverse(); // Reversing the result array to have data for the past 30 days in chronological order.
}
function organizeDataByYear(orders: ({ quantity: number, order: Order })[]) {
    const result: { quantity: number; date: string }[] = [];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1 to get the correct month number

    for (let monthOffset = 0; monthOffset < 13; monthOffset++) {
        let targetMonth = currentMonth - monthOffset;
        let targetYear = currentYear;

        if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
        }

        let totalQuantity = 0;

        const daysInMonth = new Date(targetYear, targetMonth, 0).getDate(); // Get total days in the month

        for (let day = 1; day <= daysInMonth; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const startTime = new Date(targetYear, targetMonth - 1, day, hour, 0, 0);
                const endTime = new Date(targetYear, targetMonth - 1, day, hour + 1, 0, 0);
                const ordersWithinInterval = orders.filter(order => {
                    const orderDate = new Date(order.order.date);
                    return orderDate >= startTime && orderDate < endTime;
                });
                totalQuantity += ordersWithinInterval.reduce((acc, curr) => acc + curr.quantity, 0);
            }
        }

        const formattedDate = `${targetYear}/${targetMonth}`;
        result.push({ quantity: totalQuantity, date: formattedDate });
    }

    return result.reverse();
}

const ProductsPage = async ({ params }: { params: { id: string, productId: string } }) => {
    const session = await getCurrentSession();
    if (!session) {
        return (
            <div>
                Invalid User
            </div>
        )
    }



    if (!parseInt(params.productId)) {
        return (
            <main className="flex mt-48 items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">404</h1>
                    <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
                        Oops! The page you're looking for could not be found.
                    </p>
                    <div className="mt-8">
                        <Link href={`/dashboard/${params.id}/products`}>
                            <Button className="text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700">
                                Go to orders
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

        )
    }


    const product = await db.product.findFirst({
        where: {
            id: parseInt(params.productId),
            restaurantId: params.id
        }
    });
    const orders = await db.item_Menu_Order.findMany({
        where: {
            'Item_Menu_Product_Order': {
                'some': {
                    productId: parseInt(params.productId)
                }
            },
            'order': {
                'status': 'COMPLETE',
            }
        },
        select: {
            quantity: true,
            order: true
        },
    });

    const orders2 = await db.item_Product_Order.findMany({
        where: {
            productId: parseInt(params.productId),
            'order': {
                'status': 'COMPLETE',
            }
        },
        select: {
            quantity: true,
            order: true
        },
    });
    const orderDataMonth = organizeDataByMonth(orders);
    const orderDataMonth2 = organizeDataByMonth(orders2);
    const dataMonth = mergeOrderData(orderDataMonth, orderDataMonth2);
    const orderDataDay = organizeDataByDay(orders);
    const orderDataDay2 = organizeDataByDay(orders2);
    const dataDay = mergeOrderData(orderDataDay, orderDataDay2);
    const orderDataYear = organizeDataByYear(orders);
    const orderDataYear2 = organizeDataByYear(orders2);
    const dataYear = mergeOrderData(orderDataYear, orderDataYear2);


    if (!product) {
        return (
            <>
                <main className="flex mt-48 items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">404</h1>
                        <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
                            Oops! The page you're looking for could not be found.
                        </p>
                        <div className="mt-8">
                            <Link href={`/dashboard/${params.id}/products`}>
                                <Button className="text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700">
                                    Go to orders
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>

            </>
        )
    }

    return (
        <div className="space-y-6 p-10 pt-8 pb-16 block">
            <ChartComponent dataDay={dataDay} dataMonth={dataMonth} dataYear={dataYear} name={product.name} />
        </div>
    )
}

export default ProductsPage;