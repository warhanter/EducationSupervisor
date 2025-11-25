import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectProps = {
  selectLabel: string;
  firstItem: string;
  items: string[] | null;
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
};

export function AppSelectItems({
  selectLabel,
  items,
  selectedClass,
  setSelectedClass,
  firstItem,
}: SelectProps) {
  return (
    <Select value={selectedClass} onValueChange={setSelectedClass} dir="rtl">
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder={selectLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          <SelectItem value={"الكل"}>{firstItem}</SelectItem>
          {items &&
            items.map((item) => <SelectItem value={item}>{item}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
