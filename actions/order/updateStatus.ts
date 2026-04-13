
"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";
import { Item_Menu_Order, Item_Menu_Product_Order, Item_Product_Order, Menu, Order, Product, Restaurant, orderStatus } from "@prisma/client";
import { io } from "socket.io-client";
import jsPDF from "jspdf";

export const updateStatus = async (orderId: string, pathname: string, status: orderStatus) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'Unauthorized'
            }
        }

        const order = await db.order.findFirst({
            where: {
                id: orderId
            }
        });


        if (!order) {
            return {
                error: 'Something went wrong, no order was found!'
            }
        }

        if (order.status === 'DELETED' || order.status === 'COMPLETE' || order.status === 'CANCELED') {
            return {
                error: 'Unable to update order'
            }
        }

        const orderUpdated = await db.order.update({
            where: {
                id: order.id
            },
            data: {
                status,
            }
        });
        if (orderUpdated.status === 'CANCELED') {
            await db.$transaction(async (prisma) => {
                const orderLog = await db.order_Log.create({
                    data: {
                        orderId: order.id,
                        logType: 'UPDATED_STATUS',
                        userId: user.id,
                        changes: JSON.stringify(orderUpdated)
                    }
                });

                const item_Product_Order = await prisma.item_Product_Order.findMany({
                    where: {
                        orderId,
                    },
                });

                const item_Menu_Order = await prisma.item_Menu_Order.findMany({
                    where: {
                        orderId,
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
                            orderId,
                        },
                    },
                });
                await prisma.item_Menu_Order.deleteMany({
                    where: {
                        orderId,
                    }
                });
                await prisma.item_Product_Order.deleteMany({
                    where: {
                        orderId,
                    },
                });

            })
        } else if (orderUpdated.status === 'DELETED' || orderUpdated.status === 'KITCHEN' || orderUpdated.status === 'READY' || orderUpdated.status === 'SERVED') {
            const orderLog = await db.order_Log.create({
                data: {
                    orderId: order.id,
                    logType: 'UPDATED_STATUS',
                    userId: user.id,
                    changes: JSON.stringify(orderUpdated)
                }
            });
        } else if (orderUpdated.status === 'COMPLETE') {
            const order = await db.order.findFirst({
                where: {
                    id: orderId
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
                    },
                    restaurant: true
                },
            });
            if (!order) {
                return {
                    error: 'Unable to generate invoice'
                }
            }

            const url = order.restaurant.image;
            if (url) {
                const res = await fetch(url);
                const imageData = await res.arrayBuffer();
                const base64Image = Buffer.from(imageData).toString('base64');

                const blob = generatePdf({ order, url: base64Image });

                const response = await fetch(`${process.env.BASE_URL}/api/savePdf`, {
                    method: "POST",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/pdf",
                    },
                    body: blob,
                });
                const responseData = await response.json();
                await db.order.update({
                    where: {
                        id: order.id,
                    }, data: {
                        invoice: responseData.fileUrl
                    }
                });
            } else {

                const blob = generatePdf({ order });

                const response = await fetch(`${process.env.BASE_URL}/api/savePdf`, {
                    method: "POST",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/pdf",
                    },
                    body: blob,
                });
                const responseData = await response.json();
                await db.order.update({
                    where: {
                        id: order.id,
                    }, data: {
                        invoice: responseData.fileUrl
                    }
                });

            }



            const orderLog = await db.order_Log.create({
                data: {
                    orderId: order.id,
                    logType: 'PAYED',
                    userId: user.id,
                    changes: JSON.stringify(order)
                }
            });


        }

        const socket = io('http://localhost:8080');
        socket.emit('ordersChange');
        socket.emit('ordersChangeReady');

        revalidatePath(`dashboard${order.restaurantId}}/order-mode`)
        revalidatePath(`dashboard${order.restaurantId}}/orders`)
        revalidatePath(pathname);

        return {
            message: 'Status updated!'
        }


    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        }
    }

}

const generatePdf = ({ order, url }: {
    url?: any,
    order: Order & {
        restaurant: Restaurant,
        Item_Menu_Order: (Item_Menu_Order & { menu: Menu, Item_Menu_Product_Order: (Item_Menu_Product_Order & { product: Product })[] })[]
        Item_Product_Order: (Item_Product_Order & { product: Product })[]
    }
}) => {
    const doc = new jsPDF();

    if (url) {
        doc.addImage(url, 'PNG', 20, 10, 40, 40);
    }

    //Adicionar hora:
    const agora: Date = new Date();
    const dia: number = agora.getDate();
    const mes: number = agora.getMonth() + 1;
    const ano: number = agora.getFullYear();
    const horas: number = agora.getHours();
    const minutes : number = agora.getMinutes();
    const dataFormatada: string = `${dia}/${mes}/${ano} ${horas}:${minutes}`; doc.text(`${order.restaurant.name}`, 190, 20, { align: "right" });

    doc.text(`${order.restaurant.address}-${order.restaurant.zipCode}`, 190, 30, { align: "right" });
    doc.text(dataFormatada, 190, 40, { align: "right" });
    doc.text(`Order: #${order.customId}`, 190, 50, { align: "right" });
    if (order.tin) doc.text(order.tin, 190, 60, { align: 'right' });

    doc.text("Item", 25, 80);
    doc.text("Qnt.", 150, 80);
    doc.text("Price", 165, 80);
    doc.line(20, 82, 190, 82);

    let startY = 90;

    if (order.Item_Menu_Order.length > 0) {
        order.Item_Menu_Order.map((item) => {
            doc.text(item.menu.name, 25, startY);
            doc.text(item.quantity.toString(), 150, startY);
            doc.text(`${item.menu.price.toString()}€`, 165, startY);
            item.Item_Menu_Product_Order.forEach(item2 => {
                startY += 8;
                doc.text(item2.product.name, 35, startY);
            })
            startY += 8;
        });

    }
    if (order.Item_Product_Order.length > 0) {
        order.Item_Product_Order.map((item) => {
            doc.text(item.product.name, 25, startY);
            doc.text(item.quantity.toString(), 150, startY);
            doc.text(`${item.product.price.toString()}€`, 165, startY);
            startY += 8;
        });
    }


    startY += 4;
    doc.text("Total", 25, startY + 10);
    doc.text(`${order.price.toString()}€`, 165, startY + 10);
    const blob = doc.output('blob');
    return blob;
}