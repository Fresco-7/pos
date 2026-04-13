import { AlertTriangle, ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const ApiWarning = () => {
  return (
    <>
      <div className="flex w-full items-center justify-start rounded-md bg-red-500 p-3 text-white">
        <div className="flex">
          <AlertTriangle className=" " />
          <span className="ml-3 font-medium">
            You can only see this key once. Make sure you store it safely.
          </span>
        </div>
      </div>
    </>
  );
};

export default ApiWarning;
