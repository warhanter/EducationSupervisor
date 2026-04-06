import React from "react";
import { SelectItems } from "./SelectItems";
import { YEARS, MONTHS } from "../constants/absenceConstants";

interface AbsenceFiltersProps {
  levels: any[];
  selectedLevel: string;
  selectedMonth: number;
  selectedYear: number;
  onLevelChange: (level: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export const AbsenceFilters: React.FC<AbsenceFiltersProps> = ({
  levels,
  selectedLevel,
  selectedMonth,
  selectedYear,
  onLevelChange,
  onMonthChange,
  onYearChange,
}) => {
  return (
    <div className="flex gap-5 items-center">
      <p>القسم</p>
      <SelectItems
        iconTitle="اختر القسم"
        title="الاقسام"
        items={levels}
        itemName="full_class_name"
        setLevel={onLevelChange}
      />
      
      <p>الشهر</p>
      <SelectItems
        iconTitle="اختر الشهر"
        title="الأشهر"
        items={MONTHS}
        itemName="full_class_name"
        setLevel={onMonthChange}
      />
      
      <p>السنة</p>
      <SelectItems
        iconTitle="اختر السنة"
        title="السنوات"
        items={YEARS}
        itemName="full_class_name"
        setLevel={onYearChange}
      />
    </div>
  );
};
