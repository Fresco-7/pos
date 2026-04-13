import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Menu, Product } from "@prisma/client"

export const CardComponent = ({ product, menu }: {
    product?: Product, menu?: Menu
}) => {

    const renderName = (name: string) => {
        const maxLength = 10;
        if (name.length > maxLength) {
            return `${name.substring(0, maxLength)}...`;
        }
        return name;
    };

    if (product) {
        return (

            <Card className="w-[160px] h-auto md:h-65 rounded-lg shadow-sm cursor-pointer flex flex-col">
                <CardHeader className="p-2 flex-grow">
                    <img
                        alt={product.name}
                        className="h-[150px] w-full rounded-t-md object-cover"
                        height="150"
                        src={product.image}
                        style={{
                            aspectRatio: "200/150",
                            objectFit: "cover",
                        }}
                        width="200"
                    />
                </CardHeader>
                <CardContent className="py-2 px-4 flex flex-col flex-grow">
                    <h3 className=" text-gray-900 dark:text-white">{renderName(product.name)}</h3>
                    <p className="font-bold text-gray-900 dark:text-white">{product.price}€</p>
                </CardContent>
            </Card>
        )
    }

    if (menu) {
        return (
            <Card className="w-[160px] h-auto md:h-65 rounded-lg shadow-sm cursor-pointer flex flex-col">
                <CardHeader className="p-2 flex-grow">
                    <img
                        alt={menu.name}
                        className="h-[150px] w-full rounded-t-md object-cover"
                        height="150"
                        src={menu.image}
                        style={{
                            aspectRatio: "200/150",
                            objectFit: "cover",
                        }}
                        width="200"
                    />
                </CardHeader>
                <CardContent className="py-2 px-4 flex flex-col flex-grow">
                    <h3 className=" text-gray-900 dark:text-white">{renderName(menu.name)}</h3>
                    <p className="font-bold text-gray-900 dark:text-white">{menu.price}€</p>
                </CardContent>
            </Card>
        )
    }
}