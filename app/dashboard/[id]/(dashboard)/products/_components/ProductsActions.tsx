"use client";
import useProductModal from "@/components/hooks/useProductModal";
import { Button } from "@/components/ui/button";

const ProductsActions = () => {
  const productModal = useProductModal();

  return (
    <>
      <div className="flex-1 gap-2 md:flex">
        <Button
          className="mt-2 w-full md:mt-0"
          onClick={() => productModal.onOpen()}
        >
          Create Product
        </Button>
      </div>
    </>
  );
};

export default ProductsActions;
