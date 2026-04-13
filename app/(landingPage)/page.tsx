import { ArrowRightIcon } from "lucide-react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import useRegisterModal from "@/components/hooks/useRegisterModal";
import getCurrentSession from "@/actions/users/getCurrentSession";
import Actions from "./_components/Actions";
import { auth } from "@/auth";


const landingPage = async () =>  {
  const session = await getCurrentSession();

  return (
    <>
      <section className="pt-24 mb-20 ">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
            <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-gray-900 dark:text-white md:text-6xl md:tracking-tight">
              <span>Elevate your restaurant standards with</span> <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-blue-700 to-blue-400 lg:inline">POS Kitchen.</span>
            </h1>
            <p className="px-0 mb-8 text-lg text-muted-foreground md:text-xl lg:px-24">
              Instantly transmit orders from the tablet or dashboard to your
              kitchen, ensuring accuracy and promptness in meal preparation.
            </p>
            {!session?.user && (
              <Actions />
            )}
          </div>
          <div className="w-full mx-auto mt-20 text-center md:w-10/12">
            <div className="relative z-0 w-full mt-8">
              <div className="relative overflow-hidden shadow-2xl">
                <div className="flex items-center flex-none px-4 bg-primary rounded-b-none h-11 rounded-xl">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 border-2 border-white  rounded-full"></div>
                    <div className="w-3 h-3 border-2 border-white  rounded-full"></div>
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                <Image className="dark:hidden block" src={'/images/overview.png'} width={1920} height={1080} alt="" />
                <Image className="dark:block hidden" src={'/images/overviewDark.png'} width={1920} height={1080} alt="" />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default landingPage;
