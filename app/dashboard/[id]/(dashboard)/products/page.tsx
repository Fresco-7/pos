import React from 'react'
import ProductsActions from './_components/ProductsActions';
import { columns } from '@/components/tabels/product/productColumns';
import { db } from '@/lib/db'
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'
import EmptyState from '@/components/emptyStates/EmptyState';
import { ProductsTable } from '@/components/tabels/product/ProductsTable';
import getCurrentSession from '@/actions/users/getCurrentSession';
import { ProtedtedColumns } from '@/components/tabels/product/protectedProductColumns';

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

    const products = await db.product.findMany({
        where: {
            restaurantId: params.id
        },
        include: {
            category: true,
            Restrictions_Product: true,
            Side_Product : true,
        },
    });


    return (
        <>
            <div className="space-y-6 p-10 pt-7 pb-16 block">
                <div className="space-y-0.5 md:justify-between md:flex items-center ">
                    <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                    <div className="md:flex pt-5 md:pt-0">

                        {(user?.role === 'OWNER' || user?.Employee?.permissions === 'WRITE_READ') && (
                            <ProductsActions />
                        )}

                    </div>
                </div>
                {products.length ? (
                    <>
                        {user?.Employee?.permissions === 'WRITE_READ' || user?.role === 'OWNER' ?
                            (
                                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                                    <ProductsTable columns={columns} data={products} />
                                </div>

                            ) : (

                                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                                    <ProductsTable columns={ProtedtedColumns} data={products} />
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