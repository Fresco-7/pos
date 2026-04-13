"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Clipboard, LucideIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { CommandShortcut } from "../ui/command";
export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon;
    clipboard?: boolean;
    iconClassName?: string;
    shortcut : string;
}

const InputIconCommand = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            required,
            icon: Icon,
            clipboard,
            disabled,
            value,
            iconClassName,
            shortcut,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                className={cn(
                    "bg-card flex cursor-default items-center rounded-md border",
                    className,
                )}
            >
                <Icon className={cn("text-primary ml-3 mr-1 h-5 w-5", iconClassName)} />
                <input
                    value={value}
                    disabled={disabled}
                    type={type}
                    className={cn(
                        "bg-card placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border-none px-2 py-2 text-sm file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50",
                        className,
                    )}
                    ref={ref}
                    {...props}
                />


                <>
                    <CommandShortcut className="mr-3 text-black text-sm">{shortcut}</CommandShortcut>
                </>

            </div>
        );
    },
);
InputIconCommand.displayName = "InputIconCommand";

export { InputIconCommand };
