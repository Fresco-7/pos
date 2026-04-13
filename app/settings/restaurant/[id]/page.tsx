import { Separator } from '@/components/ui/separator'
import getCurrentUser from '@/actions/users/getCurrentUser';
import { RestaurantForm } from '@/components/settings/_components/restaurant-form';
import { db } from '@/lib/db';

export default async function SettingsProfilePage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <>
                <div>
                    Invalid User
                </div>
            </>
        )
    }
    
    const restaurant = await db.restaurant.findFirst({
        where: {
            id: params.id
        }
    })
    
    if (!restaurant) {
        return (
            <>
                <div>
                    Invalid Restaurant
                </div>
            </>
        )
    }


    return (
        <div className=' text-justify flex flex-col'>
            <RestaurantForm restaurant={restaurant} />
            <div className="flex-1 mt-10 text-justify text-muted-foreground text-sm">
                <p>Created at : {user.createdAt.toLocaleDateString()}</p>
                <p>Last update : {user.updatedAt.toLocaleDateString()}</p>
            </div>
        </div>

    )
}
