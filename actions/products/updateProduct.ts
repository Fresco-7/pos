"use server";
import { db } from "@/lib/db";
import { ProductFormValues } from "@/components/modals/editModals/ProductModal";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";

export const updateProduct = async (
    data: ProductFormValues,
    restaurantId: string,
    categoryId: number,
    restrictions: string[],
    sidesField: ({ value: number, value2: number })[],
) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                error: 'Unauthorized'
            };
        }

        if (user.role === 'EMPLOYEE') {
            const employee = await db.employee.findFirst({
                where: {
                    userId: user.id
                }
            });
            if (employee?.permissions !== 'WRITE_READ') {
                return {
                    error: 'Unauthorized'
                };
            }
        }

        const existingProduct = await db.product.findFirst({
            where: {
                id: data.id,
                restaurantId: restaurantId
            }
        });

        if (!existingProduct) {
            return {
                error: 'Product doenst exists!'
            };
        }

        const existingProduct2 = await db.product.findFirst({
            where: {
                name: data.name,
                restaurantId: restaurantId,
                NOT: {
                    id: existingProduct.id
                }
            }
        });

        if (existingProduct2) {
            return {
                error: 'Product already exists!'
            };
        }


        const product = await db.product.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                image: data.image,
                description: data.description,
                price: parseFloat(data.price),
                tax: parseFloat(data.tax),
                restaurantId: restaurantId,
                categoryId: categoryId,
                additionalInformation: data.additionalInformation
            },
        });


        if (!product) {
            return { error: 'Something went Wrong' };
        } else {

            const deleteRestrictions = db.restrictions_Product.deleteMany({
                where: {
                    productId: product.id
                }
            });
            const deleteSides = db.side_Product.deleteMany({
                where: {
                    productId: product.id
                }
            });

            const createSides = db.side_Product.createMany({
                data: sidesField.map(c => ({
                    'sideId': c.value,
                    'stockAmout': c.value2,
                    productId: data.id
                })),
            });

            const createRestrictions = db.restrictions_Product.createMany({
                data: restrictions.map(id => ({
                    restrictionsId: parseInt(id),
                    productId: data.id
                })),
            });



            await db.$transaction([deleteRestrictions, createRestrictions, deleteSides, createSides])

            revalidatePath(`/products/${restaurantId}`);
            revalidatePath(`/dashboard/${restaurantId}/order-mode/`);
            return { message: 'Product updated successfully', product };
        }
    } catch (error) {
        console.log(error);
        return {
            error: 'Something went Wrong!'
        };
    }
};
