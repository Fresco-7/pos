
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import { NAVBAR_LINKS } from '@/config/routes'

export default async function LandingPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className='h-screen'>
        <Navbar navLinks={NAVBAR_LINKS} />
        {children}
        <Footer></Footer>
      </div>
    </>
  );
};