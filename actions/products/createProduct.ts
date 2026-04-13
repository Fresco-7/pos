"use server";
import { db } from "@/lib/db";
import { ProductFormValues } from "@/components/modals/ProductModal";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../users/getCurrentUser";

export const createProduct = async (
  data: ProductFormValues,
  restaurantId: string,
  categoryId: number,
  restrictions: string[],
  sidesField: ({ value: number, value2: number })[]
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
        name: data.name,
        restaurantId: restaurantId
      }
    });

    if (existingProduct) {
      return {
        error: 'Product already exists!'
      };
    }


    if (restrictions.length > 0 && restrictions[0] != '' && sidesField.length > 0) {
      await db.product.create({
        data: {
          name: data.name,
          image: data.image,
          description: data.description,
          price: parseFloat(data.price),
          tax: parseFloat(data.tax),
          status: 'ACTIVE',
          restaurantId: restaurantId,
          categoryId: categoryId,
          additionalInformation: data.additionalInformation,
          Restrictions_Product: {
            create: restrictions.map((id) => ({
              restrictionsId: parseInt(id),
            })),
          },
          Side_Product: {
            create: sidesField.map((c) => ({
              sideId: c.value,
              'stockAmout': c.value2
            })),
          }
        },
      });
    } else if (restrictions.length > 0 && restrictions[0] != '') {
      await db.product.create({
        data: {
          name: data.name,
          image: data.image,
          description: data.description,
          price: parseFloat(data.price),
          tax: parseFloat(data.tax),
          status: 'ACTIVE',
          restaurantId: restaurantId,
          categoryId: categoryId,
          additionalInformation: data.additionalInformation,
          Restrictions_Product: {
            create: restrictions.map((id) => ({
              restrictionsId: parseInt(id),
            })),
          },
        },
      });
    } else if (sidesField.length > 0) {
      await db.product.create({
        data: {
          name: data.name,
          image: data.image,
          description: data.description,
          price: parseFloat(data.price),
          tax: parseFloat(data.tax),
          status: 'ACTIVE',
          restaurantId: restaurantId,
          categoryId: categoryId,
          additionalInformation: data.additionalInformation,
          Side_Product: {
            create: sidesField.map((c) => ({
              sideId: c.value,
              'stockAmout': c.value2
            })),
          }
        },
      });
    } else {
      await db.product.create({
        data: {
          name: data.name,
          image: data.image,
          description: data.description,
          price: parseFloat(data.price),
          tax: parseFloat(data.tax),
          status: 'ACTIVE',
          restaurantId: restaurantId,
          categoryId: categoryId,
          additionalInformation: data.additionalInformation,
        },
      });
    }

    revalidatePath(`/products/${restaurantId}`);
    revalidatePath(`/dashboard/${restaurantId}/order-mode/`);
    return { message: 'Product created successfully' };

  } catch (error) {
    console.log(error);
    return {
      error: 'Something went Wrong!'
    };
  }
};
