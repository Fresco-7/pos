"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigDown, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RestaurntCardPorps {
  name: string;
  id: string;
  image?: string;
}

const RestaurantCard: React.FC<RestaurntCardPorps> = ({ name, id, image }) => {
  return (
    <>
      <Card>
        <CardHeader className="flex-1 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-14 w-14 cursor-pointer justify-center text-center shadow-md">
                      <AvatarImage src={`${image}`} alt={`${name}`} />
                      <AvatarFallback>
                        {name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="mt-3">{name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>{name}</span>
            </div>
            <div>
              <Link href={`restaurant/${id}`}>
                <div className="flex cursor-pointer justify-end ">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardFooter>
          <div className="">
            <span>{`id: `}</span>
            <span
              className="cursor-pointer break-all text-sm font-bold"
              onClick={() => {
                toast.success("id copied");
                navigator.clipboard.writeText(id);
              }}
            >
              {`${id}`}
            </span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default RestaurantCard;
