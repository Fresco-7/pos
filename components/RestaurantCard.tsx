import { Restaurant } from "@prisma/client"
import Link  from "next/link"

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    return (
        <Link href={`/dashboard/${restaurant.id}`}>
            <div className="flex flex-col justify-between border-2 border-input rounded-md overflow-hidden p-5">
                <div>
                    {restaurant.name}
                </div>
            </div>
        </Link>
    )
}
export default RestaurantCard;