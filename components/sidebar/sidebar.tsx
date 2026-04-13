"use client"

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import RestaurantSelect from "./restaurantSelect";
import { Restaurant, User } from "@prisma/client";
import { PROTECTED_ROUTES_OWNER, ROUTES_EMPLOYEE } from "@/config/routes/index";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  currentUser: User | null
  restaurants: Restaurant[]
  id: string
}


export const Sidebar: React.FC<SidebarProps> = ({ currentUser, restaurants, id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(id);

  let routes = [];
  if (currentUser?.role === 'OWNER') {
    routes = PROTECTED_ROUTES_OWNER
    routes = routes.map((route) => {
      if (route.href === '/settings/restaurant/') {
        return {
          ...route,
          href: `${route.href}${selectedRestaurantId}`,
        };
      }
      return {
        ...route,
        href: `/dashboard/${selectedRestaurantId}${route.href}`,
      };

    });
  } else {
    routes = ROUTES_EMPLOYEE
    routes = routes.map((route) => {
      if (route.href === '/settings') {
        return {
          ...route,
          href: `${route.href}`,
        };
      }
      return {
        ...route,
        href: `/dashboard/${selectedRestaurantId}${route.href}`,
      };
    });
  }

  return (
    <>
      <div className="hidden md:w-20 md:flex xl:w-56 md:flex-col md:fixed md:h-full ">
        <div className="flex w-full flex-1 h-screen bg-card border-r border-muted-foreground/20 items-start ">
          <div className="flex flex-col xl:justify-start xl:w-full pl-1 xl:pl-0 pt-2 ">
            {currentUser?.role === 'OWNER' && (
              <span className={cn("text-sm group border-b-[0.2px] flex p-1 pl-2 justify-center font-medium cursor-pointer transition ")}>
                <RestaurantSelect selectedRestaurantId={selectedRestaurantId} restaurants={restaurants} setSelectedRestaurantId={setSelectedRestaurantId} />
              </span>
            )}
            <div className="xl:justify-start xl:pr-3 p-2 mt-2 px-3 pt-1 xl:w-full space-y-2">
              {routes.map((route) => (
                <span onClick={() => { router.push(route.href) }} key={route.href} className={cn("text-sm group flex p-3 xl:justify-start justify-center font-medium cursor-pointer hover:text-foreground rounded-md transition", pathname.startsWith(route.href) && route.href != `/dashboard/${id}` ? " text-primary bg-primary/5 hover:text-primary" : "text-foreground/70", pathname === route.href ? " text-primary bg-primary/5 hover:text-primary" : "")}>
                  <div className="flex items-center flex-1 relative">
                    <div className="relative 2xl:p-0.5">
                      <route.icon className={cn("justify-center items-center h-5 w-5 xl:mr-3")} />
                    </div>
                    <div className="hidden xl:block">{route.label}</div>
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}