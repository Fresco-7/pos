"use client";

import * as React from "react";
import { ChevronsUpDown, LayoutDashboard, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Restaurant } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import useRestaurantModal from "../hooks/useRestaurantModal";
import { GrOverview } from "react-icons/gr";

const RestaurantSelect = ({
  restaurants,
  setSelectedRestaurantId,
  selectedRestaurantId,
}: {
  restaurants: Restaurant[];
  setSelectedRestaurantId: (newValue: any) => void;
  selectedRestaurantId: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const restaurantModal = useRestaurantModal();
  let parts = pathname.split("/");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="rounded-full p-0" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`lg:border-muted-foreground/20 hover:bg-null w-10 justify-start rounded-full border-none pr-11 lg:border xl:w-56 xl:rounded-md `} /* ${selectedRestaurantId === "overview" ? "justify-center" : ""} */
        >
          <Avatar className="h-10 w-10 cursor-pointer  justify-center xl:ml-2 ">
            <AvatarImage
              src={`${restaurants.find((restarunt) => restarunt.id === selectedRestaurantId)?.image}`}
              className=""
              alt={`${restaurants.find((restarunt) => restarunt.id === selectedRestaurantId)?.name}`}
            />
            <AvatarFallback>{`${restaurants
              .find((restarunt) => restarunt.id === selectedRestaurantId)
              ?.name.substring(0, 2)
              .toUpperCase()}`}</AvatarFallback>
          </Avatar>
          <span className="ml-3 hidden xl:flex">
            {restaurants
              .find((restarunt) => restarunt.id === selectedRestaurantId)
              ?.name.substring(0, 10)}
          </span>
          <span className="ml-3 hidden justify-end xl:flex">
            <ChevronsUpDown size={14} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-1 w-20 p-0 xl:w-56">
        <Command>
          <CommandEmpty>No Restaurant found.</CommandEmpty>
          <CommandGroup>
            {restaurants.map((restaurant) => (
              <CommandItem
                key={restaurant.id}
                value={restaurant.id}
                onSelect={(currentValue) => {
                  if (currentValue != selectedRestaurantId) {
                    setSelectedRestaurantId(currentValue);
                    const routeParam = parts[parts.length - 1];
                    if (routeParam != selectedRestaurantId) {
                      router.push(`/dashboard/${currentValue}/${routeParam}`);
                    } else {
                      router.push(`/dashboard/${currentValue}`);
                    }
                  }
                  setOpen(false);
                }}
                className={`justify-center xl:justify-start ${restaurant.id === selectedRestaurantId ? "hidden" : null}`}
              >
                <span className="flex justify-center">
                  <Avatar className="h-10 w-10 cursor-pointer shadow-md">
                    <AvatarImage
                      src={`${restaurant.image}`}
                      alt={`${restaurant.name}`}
                    />
                    <AvatarFallback>
                      {restaurant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2  hidden items-center xl:flex">
                    {restaurant.name}
                  </span>
                </span>
              </CommandItem>
            ))}
            <CommandItem
              className={`w-full `}
              onSelect={() => {
                restaurantModal.onOpen();
                setOpen(false);
              }}
            >
              <span className="flex h-10 w-10 flex-1 items-center justify-center xl:justify-start">
                <span className="xl:ml-2 xl:mr-3">
                  <Plus size={20} />
                </span>
                <span className="hidden xl:block">Create Restaurant</span>
              </span>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RestaurantSelect;
