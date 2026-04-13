"use client";

import { LucideIcon } from "lucide-react";

interface CategoryBoxProps {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`
        flex
        flex-col

        gap-3
        rounded-xl
        border-2
        p-4
        ${!selected ? "hover:border-primary/40" : null}
        cursor-pointer
        transition-all
        ${selected ? "border-primary" : "border-border"}
      `}
    >
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryBox;
