"use client";
import useSideModal from "@/components/hooks/useSideModal";
import { Button } from "@/components/ui/button";

const SideAction = () => {
  const sideModal = useSideModal();

  return (
    <>
      <div className="flex-1 gap-2 md:flex">
        <Button
          className="mt-2 w-full md:mt-0"
          onClick={() => sideModal.onOpen()}
        >
          Create Side
        </Button>
      </div>
    </>
  );
};

export default SideAction;
