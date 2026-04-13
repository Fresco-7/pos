"use client";
import { Input } from "@/components/ui/inputCounter";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export const Counter = ({
  value,
  onChangeProp,
  onRemove,
}: {
  value: string;
  onChangeProp: (newValue: string) => void;
  onRemove: () => void;
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleIncrement = () => {
    const newValue = String(parseInt(currentValue, 10) + 1);
    setCurrentValue(newValue);
    onChangeProp(newValue);
  };

  const handleDecrement = () => {
    const newValue = String(Math.max(parseInt(currentValue, 10) - 1, 0));
    setCurrentValue(newValue);
    onChangeProp(newValue);
    if (parseInt(newValue, 10) === 0) {
      onRemove();
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button disabled={parseInt(value) === 1} className={`cursor-pointer px-2 ${parseInt(value) === 1 && 'text-muted-foreground' } `} onClick={handleDecrement}>
        <Minus className="h-3 w-3" />
      </button>

      <Input
        className="flex h-9 w-9 justify-center"
        value={currentValue}
        readOnly
      />

      <button className="cursor-pointer px-2" onClick={handleIncrement}>
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
};
