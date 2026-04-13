import ProductModal from "@/components/modals/ProductModal";
import EditProductModal from "@/components/modals/editModals/ProductModal";
import { db } from "@/lib/db";

export default async function ProductsPage({ children, params }: { children: React.ReactNode, params: { id: string } }) {

  const sides = await db.side.findMany({
    where: {
      restaurantId: params.id
    }, include : {
      'Stock' : true
    }
  });

  return (
    <>
      <EditProductModal params={params} sides={sides} />
      <ProductModal params={params} sides={sides} />
      {children}
    </>
  );

}