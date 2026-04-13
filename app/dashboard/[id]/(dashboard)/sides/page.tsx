import React from 'react'
import { columns } from '@/components/tabels/side/sideColumns';
import { ProtectedColumns } from '@/components/tabels/side/protectedSideColumns';
import { db } from '@/lib/db'
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'
import EmptyState from '@/components/emptyStates/EmptyState';
import { ProductsTable } from '@/components/tabels/product/ProductsTable';
import getCurrentSession from '@/actions/users/getCurrentSession';
import { SidesTable } from '@/components/tabels/side/SidesTable';
import SideAction from './_components/SideAction';

const ProductsPage = async ({ params }: { params: { id: string } }) => {

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

    const sides = await db.side.findMany({
        where: {
            restaurantId: params.id
        }, include : {
            'Stock' : true
        }
    });

    return (
        <>
            <div className="space-y-6 p-10 pt-7 pb-16 block">
                <div className="space-y-0.5 md:justify-between md:flex items-center ">
                    <h2 className="text-2xl font-bold tracking-tight">Sides</h2>
                    <div className="md:flex pt-5 md:pt-0">
                        {(user?.role === 'OWNER' || user?.Employee?.permissions === 'WRITE_READ') && (
                            <SideAction />
                        )}
                    </div>
                </div>
                 {sides.length ? (
                    <>
                        {user?.Employee?.permissions === 'WRITE_READ' || user?.role === 'OWNER' ?
                            (
                                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                                    <SidesTable columns={columns} data={sides} />
                                </div>

                            ) : (

                                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                                    <SidesTable columns={ProtectedColumns} data={sides} />
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

export default ProductsPage;