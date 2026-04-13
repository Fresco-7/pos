'use client';

import { Product } from "@prisma/client";

interface ProductBoxProps {
    product: Product
    selected?: boolean;
    onClick: (value: Product) => void;
}

const ProductBox: React.FC<ProductBoxProps> = ({
    product,
    selected,
    onClick
}) => {
    return (
        <div
            onClick={() => onClick(product)}
            className={`
        rounded-xl
        border-2
        p-4
        flex
        flex-col
        gap-3
        ${!selected ? 'hover:border-primary/40' : null}
        transition-all
        cursor-pointer
        ${selected ? 'border-primary' : 'border-border'}
        w-full
      `}
        >
            <div className="font-semibold w-fit">
                <span className="flex">
                    {/*Make a function to show only the first x letter ( to determinate) same thing at restaurants name*/}
                    {product.name}
                </span>
            </div>
        </div>
    );
}

export default ProductBox;