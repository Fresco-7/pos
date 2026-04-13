'use client';

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { logout } from "@/actions/users/logout";
import { User } from "@prisma/client";
import { Home, LogOut } from "lucide-react";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { IoAnalytics } from "react-icons/io5";

interface UserMenuProps {
  currentUser?: User
}

//Make if the user have x role the rendered dropwdown menu items be diffrent


const UserMenu: React.FC<UserMenuProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer shadow-md">
                    <AvatarImage src={`${currentUser.image}`} alt={`${currentUser.name}`} />
                    <AvatarFallback className="text-foreground">{currentUser.name.substring(0, 2)}</AvatarFallback>
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
            <span onClick={() => { router.push('/') }}><DropdownMenuItem> <Home className="w-3.5 ml-[1px] h-3.5 mr-1.5 mt-0.5" />Home</DropdownMenuItem></span>

            {!pathname.startsWith('/settings') ? (
              <div onClick={() => { router.push('/settings') }}>
                <DropdownMenuItem className="flex justify-between">
                  <span className="flex items-center">
                    <HiOutlineCog8Tooth className="h-4 w-4 mr-1 mt-0.5" />Settings
                  </span>
                  {!currentUser.emailVerifiedAt && (
                    <div
                      className="h-2 w-2 bg-red-600 rounded-full"
                    ></div>
                  )}
                </DropdownMenuItem>
              </div>

            ) : <DropdownMenuItem> <span className="w-4 h-4 mr-1 mt-0.5"><IoAnalytics /></span> Dashboard</DropdownMenuItem>}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}><LogOut className="ml-[2px] w-3.5 h-3.5 mr-1 mt-1 text-red-500" /> Log Out</DropdownMenuItem>          </DropdownMenuContent>
        </DropdownMenu>
      )
      }
    </>
  )
}

export default UserMenu;
