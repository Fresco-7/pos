import { columns } from "@/components/tabels/api/apiKeyColumns";
import { ApiTable } from "@/components/tabels/api/ApiTable";
import ApiActions from "@/components/settings/api/_components/ApiActions";
import { db } from "@/lib/db";
import getCurrentUser from "@/actions/users/getCurrentUser";
import ApiModal from "@/components/modals/ApiModal";
import EmptyState from "@/components/emptyStates/EmptyState";
import svgScr from '@/components/emptyStates/svgs/emptyState.svg'

export default async function ApiPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div>
                No user
            </div>
        )
    }

    const restaurants = await db.restaurant.findMany({
        where: {
            ownerId: user.id
        }
    });

    const restaurantsId = restaurants.map(item => item.id);
    const api = await db.apiKey.findMany({
        where: {
            restaurantId: {
                in: restaurantsId
            }
        },
        include: {
            restaurant: true
        }
    });



    return (
        <>
            {restaurants.length > 0 && (
                <ApiModal restaurants={restaurants} />
            )}
            <div className='lg:py-10 text-justify flex flex-col'>
                <div className="space-y-6">
                    <div className="space-y-0.5 md:justify-between md:flex items-center ">
                        <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
                        <div className="md:flex pt-5 md:pt-0">
                            {restaurants.length > 0 && (
                                <ApiActions />
                            )}
                        </div>
                    </div>
                    {restaurants.length > 0 && api.length > 0 ? (
                        <div className="flex flex-col  space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 ">
                            <ApiTable columns={columns} data={api} />
                        </div>
                    ) : <EmptyState src={svgScr} />}
                </div>
            </div>

        </>
    )
}
