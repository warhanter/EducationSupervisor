import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import _ from "lodash";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { SelectItems } from "./SelectItems";

const missedHours = (absence_date, rapport_date) => {
  const options11 = {
    hour: "numeric",
    minute: "numeric",
  };
  const daysOfAbcence = Math.round(
    (rapport_date - absence_date) / (1000 * 60 * 60 * 24)
  );
  const start = parseInt(
    new Intl.DateTimeFormat("fr", options11).format(absence_date).slice(0, 2)
  );
  const weekday = new Intl.DateTimeFormat("fr", {
    weekday: "long",
  }).format(rapport_date);
  return weekday === "mardi" && daysOfAbcence >= 1
    ? 4
    : (weekday === "mardi" || weekday === "tuesday" || weekday === "Tuesday") &&
      daysOfAbcence < 1
    ? 12 - start
    : daysOfAbcence > 1
    ? 7
    : start > 12
    ? 16 - start
    : 15 - start;
};
export function MonthlyAbsences({ data }: { data: Record<string, any>[] }) {
  const [date, setDate] = useState(new Date().setHours(23));
  const [level, setLevel] = useState("");
  const levels = _.sortBy(
    _.uniqBy(data, (e) => e.full_className),
    "class_abbriviation"
  );
  let studentsData = [];
  const classData = useMemo(
    () => data.filter((student) => student.full_className === level),
    [level]
  );
  const selectedDates = _.filter(
    classData,
    (i) =>
      (new Date(i.date_of_return).getTime() > date || !i.date_of_return) &&
      new Date(i.date_of_absence).getTime() <= date
  );
  selectedDates.map((student, i) => {
    studentsData.push({
      number: i + 1,
      name: student.full_name,
      className: student.full_className,
      missedHours: missedHours(student.date_of_absence.getTime(), date),
      date: new Date(date).toLocaleDateString("en-ZA"),
    });
  });

  return (
    <div className="rtl before:content['<']">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">النسبة الشهرية</Button>
        </DialogTrigger>
        <DialogContent className="min-w-[900px] flex flex-col items-center">
          <DialogHeader className="flex items-center">
            <p className="font-bold text-xl">
              {new Date(date).toLocaleDateString("ar-DZ", {
                dateStyle: "full",
              })}
            </p>
            <DialogDescription>
              جدول يبين الساعات الضائعة شهريا لكل تلميذ حسب الاقسام.
            </DialogDescription>
          </DialogHeader>
          <SelectItems
            iconTitle="اختر القسم"
            title="الاقسام"
            items={levels}
            itemName="full_className"
            setLevel={setLevel}
          />
          <div className="flex gap-8 items-center">
            <Button
              size="icon"
              onClick={() => setDate(date - 1000 * 60 * 60 * 24)}
              className="rounded-full"
            >
              <CircleArrowRight className="h-12 w-12" />
            </Button>
            <table className="border-separate border border-slate-500 text">
              <thead>
                <tr>
                  <th className="border border-slate-600 px-5">الرقم</th>
                  <th className="border border-slate-600 px-5">الاسم واللقب</th>
                  <th className="border border-slate-600 px-5">القسم</th>
                  <th className="border border-slate-600 px-5">
                    الساعات الضائعة
                  </th>
                </tr>
              </thead>
              {studentsData &&
                studentsData.map((student, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td className="border border-slate-700 px-5">
                          {student.number}
                        </td>
                        <td className="border border-slate-700 px-5">
                          {student.name}
                        </td>
                        <td className="border border-slate-700 px-5">
                          {student.className}
                        </td>
                        <td className="border border-slate-700 px-5">
                          {student.missedHours}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
            <Button
              size="icon"
              className="rounded-full"
              onClick={() => setDate(date + 1000 * 60 * 60 * 24)}
            >
              <CircleArrowLeft className="h-12 w-12" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
