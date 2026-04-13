"use client"
import useLoginModal from "@/components/hooks/useLoginModal"
import { ArrowRightIcon } from "lucide-react"
import { HiOutlineLightBulb } from "react-icons/hi2";

const Actions = () => {
    const modal = useLoginModal();
    return (
        <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
            <a onClick={() => modal.onOpen()} className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg hover:bg-primary/90 text-primary-foreground bg-primary rounded-2xl sm:w-auto sm:mb-0">
                Get Started
                <ArrowRightIcon className="ml-1 size-0.5" />
            </a>
            <a onClick={() => modal.onOpen()} className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg bg-whi rounded-2xl sm:w-auto sm:mb-0">
                Learn More
                <HiOutlineLightBulb className="ml-1 size-0.5" />
            </a>
        </div>
    )
}
export default Actions