import { db } from "@/lib/db";
import { OrderMode } from './_components/mode';
import getCurrentUser from "@/actions/users/getCurrentUser";



const OrderModePage = async ({ params }: { params: { id: string } }) => {
    const menus = await db.menu.findMany({
        where: {
            restaurantId: params.id,
            AND: {
                Menu_Product: {
                    every: {
                        product: {
                            'Side_Product' : {
                                'every' : {
                                    'Side' : {
                                        'Stock' : {
                                            'stock' :{
                                                'gt' : 0
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                    
                },
                status : 'ACTIVE'
            }
        },
        include: {
            Menu_Product: {
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            }
        }
    });

    const products = await db.product.findMany({
        where: {
            restaurantId: params.id,
            AND: {
                'Side_Product' : {
                    'every' : {
                        'Side' : {
                            'Stock' : {
                                'stock' :{
                                    'gt' : 0
                                }
                            }
                        }
                    }
                },
                status : 'ACTIVE'
            }
        }, include: {
            category: true,
        }
    });

    const restaurant = await db.restaurant.findFirst({
        where: {
            id: params.id
        }
    });

    const orders = await db.order.findMany({
        where: {
            restaurantId: params.id,
            OR: [
                { status: 'KITCHEN' },
                { status: 'SERVED' }
            ]
        }
    });

    const currentUser = await getCurrentUser();
    if (!restaurant || !currentUser) {
        return (
            <>
                <div>
                    Invalid
                </div>
            </>)
    }



    return (
        <OrderMode orders={orders} params={params} currentUser={currentUser} menus={menus} products={products} />
    )
}
export default OrderModePage;