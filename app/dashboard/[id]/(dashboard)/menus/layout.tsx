import MenuModal from "@/components/modals/MenuModal";
import EditMenuModal from "@/components/modals/editModals/MenuModal";
import { db } from "@/lib/db";

export default async function MenusPage({ children, params }: { children: React.ReactNode, params: { id: string } }) {

  const products = await db.product.findMany({
    where: {
      restaurantId: params.id
    }
  })

  return (
    <>
      <EditMenuModal products={products} params={params} />
      <MenuModal products={products} params={params} />
      {children}
    </>
  );
}