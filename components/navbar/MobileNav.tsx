"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import React from "react";
import { User } from "@prisma/client";

const MobileNav = ({ currentUser }: { currentUser: User | null }) => {
  const [isOpen, setOpen] = React.useState<boolean>();

  return (
    <Sheet open={isOpen} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger className="" asChild>
        <Button className="text-primary" variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="mt-16 p-6 shadow-none md:hidden">
        <div className="flex h-full flex-col justify-center gap-3">
          {currentUser && (
            <div className="relative flex items-center">
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button
                  className="text-foreground hover:bg-background gap-1"
                  variant="ghost"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          )}
          <div className="flex items-center">
            <Link href="/" onClick={() => setOpen(false)}>
              <Button
                className="text-foreground hover:bg-background gap-1"
                variant="ghost"
              >
                Home
              </Button>
            </Link>
          </div>
          <div className="relative flex items-center">
            <Link href="/pricing" onClick={() => setOpen(false)}>
              <Button
                className="text-foreground hover:bg-background gap-1"
                variant="ghost"
              >
                Pricing
              </Button>
            </Link>
          </div>
          <div className="relative flex items-center">
            <Link href="/why-pos-kitchen" onClick={() => setOpen(false)}>
              <Button
                className="text-foreground hover:bg-background gap-1"
                variant="ghost"
              >
                Why POS Kitchen
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
