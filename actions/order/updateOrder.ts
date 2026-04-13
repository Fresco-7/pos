
"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { OrderFormValues } from "@/app/dashboard/[id]/(modes)/order-mode/_components/updateMode";
import { io } from "socket.io-client";
import { revalidatePath } from "next/cache";

export const updateOrder = async (data: OrderFormValues) => {
    const restaurantId = data.restaurantId;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'Unauthorized'
            }
        }

        const currentOrder = await db.order.findFirst({
            where: {
                id: data.orderId,
                restaurantId,
            }
        });
        if (!currentOrder) {
            return {
                error: 'Order not found'
            }
        }

        try {
            await db.$transaction(async (prisma) => {

                const item_Product_Order = await prisma.item_Product_Order.findMany({
                    where: {
                        orderId: data.orderId
                    },
                });

                const item_Menu_Order = await prisma.item_Menu_Order.findMany({
                    where: {
                        orderId: data.orderId
                    }, include: {
                        'Item_Menu_Product_Order': true
                    }
                });

                for (const item of item_Product_Order) {
                    const sides = await prisma.side_Product.findMany({
                        where: {
                            productId: item.productId,
                        }
                    });

                    for (const side of sides) {
                        const increment = side.stockAmout * item.quantity;
                        await prisma.stock.updateMany({
                            where: {
                                sideId: side.sideId
                            },
                            data: {
                                stock: {
                                    increment,
                                }
                            }
                        });
                    }
                }

                for (const item of item_Menu_Order) {
                    for (const item2 of item.Item_Menu_Product_Order) {

                        const sides = await prisma.side_Product.findMany({
                            where: {
                                productId: item2.productId,
                            }
                        });

                        for (const side of sides) {
                            const increment = side.stockAmout * item.quantity;
                            await prisma.stock.updateMany({
                                where: {
                                    sideId: side.sideId
                                },
                                data: {
                                    stock: {
                                        increment,
                                    }
                                }
                            });
                        }
                    }
                }

                await prisma.item_Menu_Product_Order.deleteMany({
                    where: {
                        Item_Menu_Order: {
                            orderId: data.orderId
                        },
                    },
                });
                await prisma.item_Menu_Order.deleteMany({
                    where: {
                        orderId: data.orderId
                    }
                });
                await prisma.item_Product_Order.deleteMany({
                    where: {
                        orderId: data.orderId
                    },
                });


                for (const item of data.items) {
                    if (item.type === 'Product') {
                        const quantity = parseInt(item.quantity);
                        const product = await prisma.product.findFirst({
                            where: {
                                id: item.id,
                                restaurantId,
                                status : 'ACTIVE'
                            }, include: {
                                'Side_Product': {
                                    include: {
                                        'Side': true
                                    }
                                }
                            }
                        });

                        if (!product) {
                            throw new Error(`Error finding Product: ${item.name}`);
                        }

                        if (product.Side_Product.length > 0) {
                            for (const side of product.Side_Product) {
                                const decrement = side.stockAmout * quantity;
                                const availableStock = await prisma.stock.findFirst({
                                    where: {
                                        'sideId': side.sideId,
                                        'stock': {
                                            'gte': decrement,
                                        }
                                    }
                                });

                                if (!availableStock) {
                                    throw new Error(`${side.Side.name} isn't available!`);
                                }
                            }

                            for (const side of product.Side_Product) {
                                const decrement = side.stockAmout * quantity;
                                await prisma.stock.update({
                                    where: {
                                        'sideId': side.sideId
                                    },
                                    data: {
                                        stock: {
                                            decrement,
                                        }
                                    }
                                });

                            }
                        }

                    } else if (item.type === 'Menu') {
                        const menu = await prisma.menu.findFirst({
                            where: {
                                id: item.id,
                                restaurantId,
                                status : 'ACTIVE'
                            },
                            include: {
                                Menu_Product: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        });

                        if (!menu) {
                            throw new Error(`Error finding Menu : ${item.name}`);
                        }


                        if (item.subitems) {
                            const quantity = parseInt(item.quantity);
                            for (const subItem of item.subitems) {
                                const menu_Product = await prisma.menu_Product.findFirst({
                                    where: {
                                        productId: subItem.id,
                                        menuId: item.id,
                                        menu: {
                                            'status': 'ACTIVE'
                                        }
                                    },
                                    include: {
                                        'product': {
                                            include: {
                                                'Side_Product': {
                                                    'include': {
                                                        'Side': true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });


                                if (!menu_Product) {
                                    throw new Error(`Error products doesnt match the menu content!`);
                                }

                                if (menu_Product.product.Side_Product.length > 0) {



                                    for (const side of menu_Product.product.Side_Product) {
                                        const decrement = side.stockAmout * quantity;
                                        const availableStock = await prisma.stock.findFirst({
                                            where: {
                                                'sideId': side.sideId,
                                                'stock': {
                                                    'gte': decrement,
                                                }
                                            }
                                        });

                                        if (!availableStock) {
                                            throw new Error(`${side.Side.name} isn't available!`);
                                        }
                                    }

                                    for (const side of menu_Product.product.Side_Product) {
                                        const decrement = side.stockAmout * quantity;
                                        await prisma.stock.update({
                                            where: {
                                                'sideId': side.sideId
                                            },
                                            data: {
                                                stock: {
                                                    decrement,
                                                }
                                            }
                                        });
                                    }


                                }
                            }

                        }

                    }
                }

                let total = 0;
                for (const item of data.items) {
                    if (item.type === 'Product') {
                        await prisma.item_Product_Order.create({
                            data: {
                                quantity: parseInt(item.quantity) as number,
                                productId: item.id,
                                orderId: data.orderId
                            }, include: {
                                product: true
                            }
                        });
                    }
                    if (item.type === 'Menu') {
                        const menu = await prisma.menu.findFirst({
                            where: {
                                restaurantId: restaurantId,
                                id: item.id,
                                status : 'ACTIVE'
                            }, include: {
                                Menu_Product: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        });

                        if (!menu) {
                            return {
                                error: 'Something went Wrong!'
                            }
                        }

                        const item_Menu_Order = await prisma.item_Menu_Order.create({
                            data: {
                                quantity: parseInt(item.quantity) as number,
                                menuId: item.id,
                                orderId: data.orderId
                            },
                        });

                        if (item.subitems) {
                            for (const subItem of item.subitems) {
                                await prisma.item_Menu_Product_Order.create({
                                    data: {
                                        ItemMenuOrderId: item_Menu_Order.id,
                                        productId: subItem.id,
                                    },
                                });

                            }
                        }

                    }
                    total += parseInt(item.quantity) * item.price;
                }

                await prisma.order.update({
                    where: {
                        id: currentOrder.id
                    }, data: {
                        price: total,
                        observation: data.observations,
                        table: data.table,
                    }
                });


                const orderJson = await prisma.order.findFirst({
                    where: {
                        id: currentOrder.id,
                    }, include: {
                        Item_Menu_Order: {
                            include: {
                                menu: true,
                                Item_Menu_Product_Order: {

                                    include: {
                                        product: true
                                    }
                                }
                            }
                        },
                        Item_Product_Order: {
                            include: {
                                product: true
                            }
                        }
                    }

                });

                await prisma.order_Log.create({
                    data: {
                        orderId: currentOrder.id,
                        logType: 'UPDATED',
                        userId: user.id,
                        changes: JSON.stringify(orderJson)
                    }
                });



                const socket = io('http://localhost:8080');
                socket.emit('ordersChange');
                socket.emit('ordersChangeReady');

            });

            revalidatePath(`/dashboard/${restaurantId}/orders`);
            revalidatePath(`/dashboard/${restaurantId}/orders/${data.orderId}`);
            revalidatePath(`/dashboard/${restaurantId}/order-mode/${data.orderId}`);

        } catch (e: any) {
            if (e.message) {
                return {
                    error: e.message
                }
            } else {
                return {
                    error: 'Something went Wrong!'
                }
            }


        }

        return "Order Updated"
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }
}
