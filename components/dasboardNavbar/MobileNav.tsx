"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/sheet";
import { Button } from "../ui/button";
import React from "react";
import {
  PROTECTED_ROUTES_OWNER,
  ROUTES_EMPLOYEE,
} from "@/config/routes";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

const MobileNav = ({
  currentUser,
  params,
}: {
  currentUser: User | null;
  params: { id: string };
}) => {
  const [isOpen, setOpen] = React.useState<boolean>();
  const router = useRouter();
  let routes = [];
  if (currentUser?.role === "OWNER") {
    routes = PROTECTED_ROUTES_OWNER;
    routes = routes.map((route) => {
      if (route.href === "/settings/restaurant/") {
        return {
          ...route,
          href: `${route.href}${params.id}`,
        };
      }
      return {
        ...route,
        href: `/dashboard/${params.id}${route.href}`,
      };
    });
  } else {
    routes = ROUTES_EMPLOYEE;
    routes = routes.map((route) => {
      if (route.href === "/settings") {
        return {
          ...route,
          href: `${route.href}`,
        };
      }
      return {
        ...route,
        href: `/dashboard/${params.id}${route.href}`,
      };
    });
  }
  return (
    <Sheet open={isOpen} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger className="" asChild>
        <Button className="text-primary" variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="mt-16 p-6 shadow-none md:hidden">
        <div className="flex h-full w-full flex-col gap-3">
          <div className="flex h-full flex-col justify-center gap-3 ">
            {routes.map((route) => (
              <div
                className="flex items-center justify-between rounded-sm bg-none"
                key={route.label}
              >
                <Button
                  onClick={() => {
                    router.push(route.href);
                    setOpen(false);
                  }}
                  className="text-foreground gap-1 bg-none hover:bg-none"
                  variant="ghost"
                >
                  {route.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
