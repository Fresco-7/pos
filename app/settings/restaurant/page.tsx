import RestaurantCard from '@/components/settings/restaurant/_components/resturantCard';
import { db } from '@/lib/db';
import getCurrentUser from '@/actions/users/getCurrentUser';
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'
import EmptyState from '@/components/emptyStates/EmptyState';

export default async function RestaurantSettingsPage() {
    const owner = await getCurrentUser();

    if (!owner) {
        return (
            <div>
                No user
            </div>
        )
    }

    const restaurants = await db.restaurant.findMany({
        where: {
            ownerId: owner?.id
        }
    })

    return (
        <>
            {restaurants.length > 0 ? (
                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id}>
                            <RestaurantCard name={restaurant.name} id={restaurant.id} image={restaurant.image || ''} />
                        </div>
                    ))

                    }
                </div>

            ) : (
                <EmptyState src={svgScr} />
            )}

        </>

    )
}
