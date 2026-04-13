"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ChevronLeft } from "lucide-react";

import { useRouter } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    role: string;
  }[];
  user: User;
}

export function SidebarNav({
  className,
  items,
  user,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <nav
        className={cn(
          "flex flex-1 justify-start space-x-2 overflow-auto overflow-x-auto px-4 md:justify-center lg:flex-col  lg:space-x-0 lg:space-y-1",
          className,
        )}
        {...props}
      >
        <Button
          className="text-primary hidden w-fit justify-start p-3 md:flex"
          onClick={router.back}
          variant={"link"}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        {items.map((item) => {
          if (item.role === "owner" && user.role === "EMPLOYEE") {
            return;
          } else {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  pathname === item.href ? " underline" : "",
                  "text-foreground w-fit justify-start",
                )}
              >
                {item.title}
              </Link>
            );
          }
        })}
      </nav>
    </>
  );
}
