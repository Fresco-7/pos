
"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { OrderFormValues } from "@/app/dashboard/[id]/(modes)/order-mode/_components/mode";
import { io } from "socket.io-client";
import { revalidatePath } from "next/cache";
import { any } from "zod";
export const createOrder = async (data: OrderFormValues) => {
    const restaurantId = data.restaurantId;

    try {

        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'Unauthorized'
            }
        }

        let total = 0;
        await db.$transaction(async (prisma) => {
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
                            status : 'ACTIVE',
                            restaurantId,
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
                total += parseInt(item.quantity) * item.price;
            }
        });



        const date = new Date().setHours(0, 0, 0, 0);
        const year = new Date(date).getFullYear();
        const month = new Date(date).getMonth() + 1;
        const day = new Date(date).getDate();
        const isoString = new Date(date).toISOString();

        const ordersCount = await db.order.count({
            where: {
                restaurantId,
                date: { gte: isoString }
            },

        });

        const customId = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${(ordersCount + 1).toString().padStart(4, '0')}`
        const order = await db.$transaction(async (prisma) => {

            const order = await prisma.order.create({
                data: {
                    customId,
                    price: total,
                    table: data.table,
                    restaurantId: restaurantId,
                    userId: user.id,
                    status: 'KITCHEN',
                    observation: data.observations,
                }
            });

            if (!order) {
                return {
                    error: 'Something went wrong, no order was created!'
                }
            }

            for (const item of data.items) {
                if (item.type === 'Product') {
                    await prisma.item_Product_Order.create({
                        data: {
                            quantity: parseInt(item.quantity) as number,
                            productId: item.id,
                            orderId: order.id
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
                            orderId: order.id
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
            }
            const orderJson = await prisma.order.findFirst({
                where: {
                    id: order.id,
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
                    orderId: order.id,
                    logType: 'CREATED',
                    userId: user.id,
                    changes: JSON.stringify(orderJson)
                }
            });
            const socket = io('http://localhost:8080');
            socket.emit('ordersChange');
            socket.emit('ordersChangeReady');

            return {
                order
            }
        });

        revalidatePath(`/dashboard/${restaurantId}/orders`)
        revalidatePath(`/dashboard/${restaurantId}/order-mode`)


        return {
            message: order
        }

    } catch (error: any) {
        if (error.message) {
            return {
                error: error.message
            }
        }
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }
}




