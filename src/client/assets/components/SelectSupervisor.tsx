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
  items: { full_name: string | null; length: number }[];
  selectSupervisor: string;
  setSelectSupervisor: React.Dispatch<React.SetStateAction<string>>;
};

export function SelectSupervisor({
  selectLabel,
  items,
  selectSupervisor,
  setSelectSupervisor,
  firstItem,
}: SelectProps) {
  return (
    <Select
      value={selectSupervisor}
      onValueChange={setSelectSupervisor}
      dir="rtl"
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder={selectLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          <SelectItem value={"الكل"}>{firstItem}</SelectItem>
          {items &&
            items.map((item) => (
              <SelectItem
                className="flex w-full"
                value={item.full_name ?? "الكل"}
              >
                <div className="flex w-52 justify-between">
                  <div>{item.full_name}</div>
                  <div className="font-bold">{item.length}</div>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
