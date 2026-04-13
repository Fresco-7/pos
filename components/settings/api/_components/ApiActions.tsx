"use client";
import useApiModal from "@/components/hooks/useApiModal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Braces } from "lucide-react";
import Link from "next/link";

const ApiActions = () => {
  const apiModal = useApiModal();

  return (
    <>
      <div className="flex-1 gap-2 md:flex">
        <Button className="mt-2 w-full md:mt-0" onClick={apiModal.onOpen}>
          Add API
        </Button>
        <Link href={'/settings/api/docs'}>
          <Button variant={'outline'} className="mt-2 w-full md:mt-0">
            Docs
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ApiActions;
