
import { Sidebar } from '@/components/sidebar/sidebar';
import { Restaurant } from '@prisma/client';
import { db } from '@/lib/db'
import getCurrentUser from '@/actions/users/getCurrentUser';
import DashboardNavbar from '@/components/dasboardNavbar/Navbar';


export default async function DashboardPage({ children, params }: { children: React.ReactNode, params: { id: string } }) {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div>
        Invalid User
      </div>
    )
  }

  let restaurants: Restaurant[] = []
  if (currentUser.role === 'OWNER') {
    restaurants = await db.restaurant.findMany({
      where: {
        ownerId: currentUser.id
      }
    });
  } else if (currentUser.role === 'EMPLOYEE') {
    const employee = await db.employee.findFirst(
      {
        where: {
          userId: currentUser.id
        },
        include: {
          restaurant: true
        },
      });
    if (employee?.restaurant) {
      restaurants.push(employee?.restaurant)
    }
  }

  return (
    <>
      <DashboardNavbar params ={params} />
      <Sidebar currentUser={currentUser} restaurants={restaurants} id={params.id} />
      <main className='md:ml-20 xl:ml-56'>
        {children}
      </main>
    </>
  );
}