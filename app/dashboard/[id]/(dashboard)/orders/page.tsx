import React from 'react'
import { OrderTable } from '@/components/tabels/order/OrderTable';
import { columns } from '@/components/tabels/order/orderColumns';
import { db } from '@/lib/db';
import EmptyState from '@/components/emptyStates/EmptyState';
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'
import getCurrentSession from '@/actions/users/getCurrentSession';
import OrderActions from './_components/OrderActions';

const MenusPage = async ({ params }: { params: { id: string } }) => {

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

    const orders = await db.order.findMany({
        where: {
            restaurantId: params.id,
        }, include: {
            user: true,
            restaurant : true
        }, orderBy: {
            'date': 'desc'
        }
    });


    return (
        <>
            <div className="space-y-6 p-10 pt-7 pb-16 block">
                <div className="space-y-0.5 md:justify-between md:flex items-center ">
                    <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                    <div className="md:flex pt-5 md:pt-0">
                        {(user?.role === 'OWNER' || user?.Employee?.permissions === 'WRITE_READ') && (
                            <OrderActions params={params} />
                        )}

                    </div>
                </div>

                {orders.length ? (
                    <>
                        {user?.Employee?.permissions === 'WRITE_READ' || user?.role === 'OWNER' ?
                            (
                                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                                    <OrderTable columns={columns} data={orders} />
                                </div>

                            ) : (

                                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                                    <OrderTable columns={columns} data={orders} />
                                </div>
                            )
                        }

                    </>
                ) : (
                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 justify-center">
                        <EmptyState src={svgScr} />
                    </div>
                )}
            </div>
        </>
    )
}

export default MenusPage;