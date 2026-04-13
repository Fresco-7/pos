"use client"

import Image, { StaticImageData } from "next/image";

interface emptyStateProps {
    title?: string;
    text?: string;
    src : StaticImageData
}

const EmptyState: React.FC<emptyStateProps> = ({
    title,
    text,
    src

}) => {
    return (
        <>
            <div className="flex flex-col gap-4 justify-center items-center h-full ">
                <div className="flex justify-center">
                    <Image
                        src={src}
                        alt="Empty State SVG"
                        width={600}
                        height={500}
                    />
                </div>
                <div className="text-3xl font-bold text-primary/80 dark:text-primary text-center">
                    {title}
                </div>
                <div className="text-md text-muted-foreground text-center">
                    {text}
                </div>

            </div>
        </>
    )

}
export default EmptyState;