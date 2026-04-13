
'use client';

import { useRouter } from "next/navigation";
import useRegisterModal from "@/components/hooks/useRegisterModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useLoginModal from "../hooks/useLoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Session } from "next-auth";
import { Employee, Restaurant, User } from "@prisma/client";
import { logout } from "@/actions/users/logout";
import { ChevronLeft, LogOut } from "lucide-react";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import useRestaurantModal from "../hooks/useRestaurantModal";
import { IoAnalytics } from "react-icons/io5";


interface UserMenuProps {
  currentUser?: User
  employee?: Employee
  restaurants?: Restaurant[]
}



const UserMenu: React.FC<UserMenuProps> = ({
  currentUser,
  employee,
  restaurants,
}) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const resturantModal = useRestaurantModal();

  return (
    <div className="relative">
      {!currentUser ? (
        <>
          <Button
            onClick={() => loginModal.onOpen()}
            className='gap-1.5 h-10'
            variant={'ghost'}>Login
          </Button>
          <Button
            onClick={() => registerModal.onOpen()}
            className='gap-1.5 ml-2 h-9'
            variant={'default'}>Register
          </Button>
        </>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none flex justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="">
                    <Avatar className="w-10 h-10 cursor-pointer shadow-md">
                      <AvatarImage src={`${currentUser.image}`} alt={`${currentUser.name}`} />
                      <AvatarFallback>{`${currentUser.name.substring(0, 2)}`}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="mt-3">
                    {currentUser.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-3" style={{ zIndex: 60 }}>
              <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currentUser.role === 'OWNER' && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger ><ChevronLeft className="h-4 w-4 mr-1 mt-0.5" />Dashboard</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent style={{ zIndex: 70 }} className="mr-1">
                      {restaurants && restaurants.length > 0 &&
                        <>
                          {restaurants.map((res) => (
                            <DropdownMenuItem className=" justify-center" onClick={() => router.push(`/dashboard/${res.id}`)}>{res.name}</DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                        </>
                      }
                      <DropdownMenuItem onClick={() => resturantModal.onOpen()}>Create Restaurant</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

              )}
              {employee && (
                <span onClick={() => { router.push(`/dashboard/${employee.restaurantId}/products`) }}><DropdownMenuItem> <span className="w-4 h-4 mr-1 mt-0.5"><IoAnalytics /></span> Dashboard</DropdownMenuItem></span>
              )}
              <div onClick={() => { router.push('/settings') }}>
                <DropdownMenuItem className="flex justify-between">
                  <span className="flex items-center">
                    <HiOutlineCog8Tooth className="h-4 w-4 mr-1 mt-0.5" />Settings
                  </span>
                  {!currentUser.emailVerifiedAt && (
                    <div
                      className="h-2 w-2 bg-red-600 rounded-full"
                    ></div>
                  )
                  }

                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}><LogOut className="ml-[2px] w-3.5 h-3.5 mr-1 mt-1 text-red-500" /> Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </>
      )}
    </div>
  )
}

export default UserMenu;
