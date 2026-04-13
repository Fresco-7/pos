
import MaxWidthWrapper from '@/components/MaxWithWrapper';
import NavItems from './NavItems';
import UserMenu from './UserMenu';
import getCurrentSession from '@/actions/users/getCurrentSession';
import MobileNav from './MobileNav';
import Mobile from '@/components/navbar/MobileNav';
import Link from 'next/link';
import { Icons } from '../Icons';
import { ModeToggle } from '../ui/ModeToggle';
import getCurrentUser from '@/actions/users/getCurrentUser';
const DashboardNavbar = async ({ params }: { params: { id: string } | null }) => {
  const currentUser = await getCurrentUser();

  return (
    <div className='pr-0 pl-0 sticky top-0 inset-x-0 h-16' style={{ zIndex: 80 }}>
      <header className='relative bg-card border-b border-muted-foreground/20 '>
        <MaxWidthWrapper>
          <div className='pt-2'>
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
                {params != null ? <MobileNav params={params} currentUser={currentUser} /> : <Mobile currentUser={currentUser} />}
              </div>
              <div className='hidden md:flex md:flex-1 md:items-center md:justify-start md:space-x-6'>
                <NavItems />
              </div>
              <div className='ml-auto flex items-center '>
                <div className='flex flex-1 items-center justify-end space-x-4'>
                  <UserMenu currentUser={currentUser || undefined} />
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

export default DashboardNavbar;