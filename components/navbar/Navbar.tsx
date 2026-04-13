import Link from 'next/link';
import MaxWidthWrapper from '@/components/MaxWithWrapper';
import { Icons } from '../Icons';
import NavItems from './NavItems';

import { ModeToggle } from '../ui/ModeToggle';
import UserMenu from './UserMenu';
import MobileNav from '@/components/navbar/MobileNav';
import getCurrentEmployee from '@/actions/users/getCurrentEmlpoyee';
import getCurrentUser from '@/actions/users/getCurrentUser';
import { db } from '@/lib/db';
import { Button } from '../ui/button';

async function getCurrentResturants(id: string | undefined) {
  if (id != undefined) {
    const resturants = await db.restaurant.findMany({
      where: {
        ownerId: id
      }
    });
    return resturants;
  }
  return undefined;
}



const Navbar = async ({ navLinks }: { navLinks: navbarLink[] }) => {
  const currentUser = await getCurrentUser();
  const resturants = await getCurrentResturants(currentUser?.id);
  const employee = await getCurrentEmployee();

  return (
    <div className='pr-0 pl-0 sticky top-0 inset-x-0 h-16' style={{ zIndex: 60 }}>
      <header className='relative bg-card border-b border-muted-foreground/20'> {/*bg-gray-100/40 backdrop-filter backdrop-blur-md*/}
        <MaxWidthWrapper>
          <div className='pt-2 '>
            <div className='flex h-16 items-center pb-1'>
              <div className='mr-3 md:ml-0 hidden md:block gap-1'>
                <div className='flex justify-center items-center'>
                  <Link href='/' className='mb-1'>
                    <Icons.logo className='h-10 w-10 ' />

                  </Link>
                  <span className='ml-1.5 text-foreground font-bold ' >POS Kitchen</span>
                </div>
              </div>
              <div className='ml-3 md:hidden p-5 pl-0'>
                <MobileNav currentUser={currentUser} />
              </div>
              <div className='hidden md:flex md:flex-1 ml-5  md:items-center md:justify-start md:space-x-6'>
                <NavItems navLinks={navLinks} />
              </div>
              <div className='ml-auto justify-center flex items-center'>
                <div className='flex flex-1 items-center space-x-4  '>
                  <UserMenu restaurants={resturants} currentUser={currentUser || undefined} employee={employee || undefined} />
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;

