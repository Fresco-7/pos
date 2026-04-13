import getCurrentSession from '@/actions/users/getCurrentSession';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import React, { useState } from 'react'
import Link from 'next/link';
import Chart from '@/components/chart/chart';
import ChartComponent from '@/components/chart/ChartComponent3';
import { Order, Stock, Stock_Log } from '@prisma/client';
import SideAction from '../_components/SideAction';
import { StockTable } from '@/components/tabels/side/stockTabe';
import EmptyState from '@/components/emptyStates/EmptyState';
import { columns } from '@/components/tabels/side/stockColumns'
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'

const ProductsPage = async ({ params }: { params: { id: string, sideId: string } }) => {
    const session = await getCurrentSession();

    if (!session) {
        return (
            <div>
                Invalid User
            </div>
        )
    }


    const user = await db.user.findFirst({
        where: {
            id: session.user.id
        }, include: {
            Employee: true
        }
    });


    

    if (!parseInt(params.sideId)) {
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


    const stock = await db.stock.findFirst({
        where: {
            sideId: parseInt(params.sideId),

        },
        include: {
            'Stock_Log': true,
            'Side': true,
        }
    });

    if (!stock) {
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

    function organizeDataByYear(stock: (Stock & {Stock_Log : Stock_Log[]}) ) {
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
                    const ordersWithinInterval = stock.Stock_Log.filter(stock => {
                        const orderDate = new Date(stock.date);
                        return orderDate >= startTime && orderDate < endTime;
                    });
                    totalQuantity += ordersWithinInterval.reduce((acc, curr) => acc + curr.stock, 0);
                }
            }
    
            const formattedDate = `${targetYear}/${targetMonth}`;
            result.push({ quantity: totalQuantity, date: formattedDate });
        }
    
        return result.reverse();
    }
    

    const dataYear = organizeDataByYear(stock);

    return (
        <div className="space-y-6 p-10 pt-7 pb-16 block">
            <div className="space-y-0.5 md:justify-between md:flex items-center ">
                <h2 className="text-2xl font-bold tracking-tight">{stock.Side.name}</h2>
                <div className="md:flex pt-5 md:pt-0">

                    {(user?.role === 'OWNER' || user?.Employee?.permissions === 'WRITE_READ') && (
                        <SideAction />
                    )}

                </div>
            </div>
            {stock.Stock_Log.length ? (
                <>

                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <StockTable columns={columns} data={stock.Stock_Log} />
                    </div>

                </>
            ) : (
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 justify-center">
                    <EmptyState src={svgScr} />
                </div>
            )}
            <div className="space-y-6 pt-1 pb-16 block">
                <ChartComponent data={dataYear} />
            </div>
        </div>
    )
}

export default ProductsPage;