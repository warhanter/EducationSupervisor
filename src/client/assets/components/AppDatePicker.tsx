"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDateContext } from "../contexts/DateContext";

export default function DateTimePicker({
  studentAbsenceDate,
}: {
  studentAbsenceDate: Date | null;
}) {
  const [open, setOpen] = React.useState(false);

  const { absenceDate, updateAbsenceDate } = useDateContext();

  const [time, setTime] = React.useState<string>(
    studentAbsenceDate
      ? `${String(new Date(studentAbsenceDate).getHours()).padStart(
          2,
          "0"
        )}:${String(new Date(studentAbsenceDate).getMinutes()).padStart(
          2,
          "0"
        )}`
      : "08:30"
  ); // e.g., "HH:mm"
  console.log("Absence Date: ", absenceDate);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    // If we already have a time, parse it and combine
    const [hours, minutes] = time.split(":").map(Number);
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);
    selectedDate.setSeconds(0);
    updateAbsenceDate(selectedDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (absenceDate) {
      const updated = new Date(absenceDate); // clone
      const [hours, minutes] = newTime.split(":").map(Number);
      updated.setHours(hours);
      updated.setMinutes(minutes);
      updated.setSeconds(0);
      updateAbsenceDate(updated);
    }
  };

  return (
    <div className="flex  gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
              disabled={studentAbsenceDate ? true : false}
            >
              {studentAbsenceDate
                ? new Date(studentAbsenceDate).toLocaleDateString("ar")
                : absenceDate
                ? new Date(absenceDate).toLocaleDateString("ar")
                : "اختر التاريخ"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={absenceDate ?? undefined}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="60" // e.g., minutes granularity
          value={time}
          onChange={handleTimeChange}
          min="08:00" // ⬅️ minimum allowed time
          max="17:30"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden ..."
          disabled={studentAbsenceDate ? true : false}
        />
      </div>
      <div>
        <Button disabled variant="outline" className="">
          {time && Number(time.split(":")[0]) < 12 ? "صباحا" : "مساءََ"}
        </Button>
      </div>
    </div>
  );
}
