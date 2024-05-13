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

export function SelectItems({ iconTitle, title, items, itemName, setLevel }) {
  return (
    <Select onValueChange={(value) => setLevel(value)}>
      <SelectTrigger className="w-[180px] font-bold p-6">
        <SelectValue
          className="items-end flex flex-col px-5 font-bold"
          placeholder={iconTitle}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="items-end flex flex-col px-5 font-bold">
            {title}
          </SelectLabel>
          {items &&
            items.map((item, index) => (
              <SelectItem
                className="items-end flex flex-col px-5 font-bold"
                key={index}
                value={
                  typeof item === "object" ? item[itemName] : item.toString()
                }
              >
                {typeof item === "object" ? item[itemName] : item.toString()}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
