import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectItemsProps {
  iconTitle: string;
  title: string;
  items: any[];
  itemName: string;
  setLevel: (value: any) => void;
}

export const SelectItems: React.FC<SelectItemsProps> = ({
  iconTitle,
  title,
  items,
  itemName,
  setLevel,
}) => {
  const handleValueChange = (value: string) => {
    // Try to parse as number if it's a numeric string
    const numericValue = Number(value);
    const finalValue = !isNaN(numericValue) && value !== "" ? numericValue : value;
    setLevel(finalValue);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={iconTitle} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item, index) => {
          // Handle both object items and primitive values
          const displayValue = typeof item === "object" ? item[itemName] : item;
          const selectValue = String(displayValue);

          return (
            <SelectItem key={index} value={selectValue}>
              {displayValue}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
