import SideModal from "@/components/modals/SideModal";
import EditSideModal from "@/components/modals/editModals/SideModal";
import AddStockModal from "@/components/modals/editModals/addStockModal";

export default async function ProductsPage({ children, params }: { children: React.ReactNode, params: { id: string } }) {

  return (
    <>
      <SideModal params={params} />
      <EditSideModal params={params} />
      <AddStockModal />
      {children}
    </>
  );

}