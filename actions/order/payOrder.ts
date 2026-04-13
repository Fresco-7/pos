
"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../users/getCurrentUser";
import { OrderFormValues } from "@/app/dashboard/[id]/(modes)/order-mode/_components/updateMode";
import { io } from "socket.io-client";
import { Item_Menu_Order, Item_Menu_Product_Order, Item_Product_Order, Menu, Order, Product, Restaurant, orderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import jsPDF from "jspdf";
import { sendEmail } from "../emails/sendEmail";

export const payOrder = async (data: OrderFormValues) => {
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

                for (const item1 of item_Product_Order) {
                    const sides = await prisma.side_Product.findMany({
                        where: {
                            productId: item1.productId,
                        }
                    });

                    for(const side of sides){
                        const increment = side.stockAmout * item1.quantity;
                        await prisma.stock.updateMany({
                            where: {
                                sideId : side.sideId
                            },
                            data: {
                                stock: {
                                    increment,
                                }
                            }
                        });
                    }
                }

                for (const item2 of item_Menu_Order) {
                    for (const item3 of item2.Item_Menu_Product_Order) {

                        const sides = await prisma.side_Product.findMany({
                            where: {
                                productId: item3.productId,
                            }
                        });

                        for(const side of sides){
                            const increment = side.stockAmout * item2.quantity;
                            await prisma.stock.updateMany({
                                where: {
                                    sideId : side.sideId
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

                let discount = 0;
                if (data.discount) {
                    discount = (parseInt(data.discount) * 0.01) * total;
                }

                const total2 = (total - parseFloat(discount.toFixed(2))).toFixed(2);
                const order = await prisma.order.update({
                    where: {
                        id: currentOrder.id
                    }, data: {
                        price: parseFloat(total2),
                        status: 'COMPLETE',
                        observation: data.observations,
                        table: data.table,
                        discount: data.discount ? parseFloat(data.discount) : null,
                        email: data.email ? data.email : null,
                        tin: data.tin ? data.tin : null,
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
                    return
                }

                await prisma.order_Log.create({
                    data: {
                        orderId: currentOrder.id,
                        logType: 'PAYED',
                        userId: user.id,
                        changes: JSON.stringify(order)
                    }
                });



                const socket = io('http://localhost:8080');
                socket.emit('ordersChange');
                socket.emit('ordersChangeReady');


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
                    await prisma.order.update({
                        where: {
                            id: order.id,
                        }, data: {
                            invoice: responseData.fileUrl
                        }
                    });

                    if (order.email) {
                        const buffer = Buffer.from(await blob.arrayBuffer()); 

                        await sendEmail({
                            from: '[POS Kitchen] <noreplay@kitchenpos.online>',
                            to: order.email,
                            subject: `Invoice #${order.customId}`,
                            attachments: [
                                {
                                    filename: `Order #${order.customId}.pdf`,
                                    content: buffer,
                                },
                            ],

                        });
                    }
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
                    await prisma.order.update({
                        where: {
                            id: order.id,
                        }, data: {
                            invoice: responseData.fileUrl
                        }
                    });

                    if (order.email) {
                        const buffer = Buffer.from(await blob.arrayBuffer());

                        await sendEmail({
                            from: '[POS Kitchen] <noreplay@kitchenpos.online>',
                            to: order.email,
                            subject: `Invoice #${order.customId}`,
                            attachments: [
                                {
                                    filename: `Order #${order.customId}.pdf`,
                                    content: buffer,
                                },
                            ],

                        });
                    }

                }

            });

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


        revalidatePath(`/dashboard/${restaurantId}/orders`);
        revalidatePath(`/dashboard/${restaurantId}/orders/${data.orderId}`);
        revalidatePath(`/dashboard/${restaurantId}/order-mode/${data.orderId}`);

        return "Order Payed"
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
    if (order.discount) {
        doc.text("Discount", 25, startY + 10);
        doc.text(`${order.discount.toString()}%`, 165, startY + 10);
        startY += 10;
    }

    doc.text("Total", 25, startY + 10);
    doc.text(`${order.price.toString()}€`, 165, startY + 10);
    const blob = doc.output('blob');
    return blob;
}