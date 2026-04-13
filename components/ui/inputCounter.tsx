"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  password?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, password, value, ...props }, ref) => {
    const [inputType, setInputType] = useState(type);
    const togglePassword = () => {
      inputType === "password"
        ? setInputType("text")
        : setInputType("password");
    };

    return (
      <div className="border-input bg-card flex items-center rounded-md border">
        <input
          type={inputType}
          value={value}
          className={cn(
            "bg-card placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border-none px-2 py-2 text-center text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {password && (
          <>
            <span onClick={togglePassword} className="mr-3">
              {inputType === "text" ? (
                <Eye className="text-primary/80 ml-1 mr-2 h-5 w-5 cursor-pointer" />
              ) : (
                <EyeOff className="text-primary/80 ml-1 mr-2 h-5 w-5 cursor-pointer" />
              )}
            </span>
          </>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
