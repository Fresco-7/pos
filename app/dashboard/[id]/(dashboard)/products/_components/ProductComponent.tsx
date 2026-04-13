"use client";

import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

const ProductComponent = ({ product }: { product: Product }) => {
  const router = useRouter();
  return (
    <div className="block space-y-6 p-10 pb-16 pt-7">
      <div className="items-center space-y-0.5 md:flex md:justify-between">
        {product.name}
      </div>
    </div>
  );
};
export default ProductComponent;
