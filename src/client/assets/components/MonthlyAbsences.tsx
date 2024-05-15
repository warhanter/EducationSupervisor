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
import { SelectItems } from "./SelectItems";
import app from "../../realm";
import { Badge } from "@/components/ui/badge";

const mongo = app.currentUser?.mongoClient("mongodb-atlas").db("todo");
const holidaysCollection = mongo?.collection("Holidays");
const holidays = await holidaysCollection?.find();
const selectedClassProgram = await mongo?.collection("Classroom").aggregate([
  {
    $lookup: {
      from: "ClassProgram",
      localField: "class_program",
      foreignField: "_id",
      pipeline: [
        {
          $lookup: {
            from: "Professor",
            localField: "professor",
            foreignField: "_id",
            as: "module",
          },
        },
      ],
      as: "program",
    },
  },
]);
Date.prototype.between = function (a, b) {
  let min = Math.min.apply(Math, [a.getTime(), b.getTime()]);
  let max = Math.max.apply(Math, [a.getTime(), b.getTime()]);
  return this.getTime() >= min && this.getTime() <= max;
};
const missedHours = (absence_date, rapport_date, eachDayMissedHours) => {
  const daysOfAbcence = Math.round(
    (rapport_date - absence_date) / (1000 * 60 * 60 * 24)
  );
  const start = new Date(absence_date).getHours();
  const weekday = new Intl.DateTimeFormat("fr", {
    weekday: "long",
  }).format(rapport_date);
  return weekday === "mardi" && daysOfAbcence >= 1
    ? 4
    : (weekday === "mardi" || weekday === "tuesday" || weekday === "Tuesday") &&
      daysOfAbcence < 1
    ? 12 - start
    : daysOfAbcence >= 1
    ? eachDayMissedHours
      ? eachDayMissedHours
      : 7
    : start > 12
    ? 16 - start
    : 15 - start;
};
export function MonthlyAbsences({
  data,
  students,
}: {
  data: Record<string, any>[];
  students: Record<string, any>[];
}) {
  const [date, setDate] = useState(new Date().setHours(23));
  const [level, setLevel] = useState("");
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const levels = _.sortBy(
    _.uniqBy(data, (e) => e.full_className),
    "class_abbriviation"
  );
  const program = selectedClassProgram.filter(
    (a) => a?.class_fullName === level
  )[0]?.program;
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  let studentsData = [];
  //const allClassStudents = useMemo(
  //  () => students.filter((student) => student.full_className === level),
  //  [level]
  //);
    const allClassStudents = useMemo(
    () => (students.filter((student) => student.full_className === level)).sort((a,b) => a.full_name - b.full_name),
    [level]
  );
  const absentClassData = useMemo(
    () => data.filter((student) => student.full_className === level),
    [level]
  );
  const selectedDates = _.filter(
    absentClassData,
    (i) =>
      (new Date(i.date_of_return).getTime() > date || !i.date_of_return) &&
      new Date(i.date_of_absence).getTime() <= date
  );
  selectedDates.map((student, i) => {
    studentsData.push({
      number: i + 1,
      name: student.full_name,
      className: student.full_className,
      missedHours: missedHours(
        student.date_of_absence.getTime(),
        date,
        program
      ),
      date: new Date(date).toLocaleDateString("en-ZA"),
    });
  });
  let studentsData2 = {};
  let classHours = 0;
  for (let i = 1; i < 31; i++) {
    let stdata = [];
    const newDate = new Date(`${year}-${month}-${i}`).setHours(23);
    const dateName = new Date(`${year}-${month}-${i}`).getDay();
    if (dateName === 5 || dateName === 6) {
      continue;
    }
    let isHoliday = false;
    holidays?.map((holiday) => {
      if (new Date(newDate).between(holiday.start_date, holiday.end_date)) {
        isHoliday = true;
        return;
      }
    });
    if (isHoliday) {
      continue;
    }
    const eachDayMissedHours = program?.filter(
      (p) =>
        p.day ===
        new Date(newDate).toLocaleDateString("ar-DZ", {
          weekday: "long",
        })
    ).length;
    classHours += eachDayMissedHours;

    const selectedDates = _.filter(
      absentClassData,
      (i) =>
        (new Date(i.date_of_return).getTime() > newDate || !i.date_of_return) &&
        new Date(i.date_of_absence).getTime() <= newDate
    );
    selectedDates.map((student, i) => {
      stdata.push({
        id: student.student_id,
        missedHours: missedHours(
          student.date_of_absence.getTime(),
          newDate,
          eachDayMissedHours
        ),
      });
    });
    Object.assign(studentsData2, { [`${year}-${month}-${i}`]: stdata });
  }
  let numOfStudents = 0;
  const numdays = Object.keys(studentsData2).length;
  const monthDays = new Date(year, month, 0).getDate();
  let realMissedHoursByClass = 0;
  let totalMissedHoursByClass = 0;
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">النسبة الشهرية</Button>
        </DialogTrigger>
        <DialogContent
          style={{ page: "wide" }}
          className="min-w-full min-h-full flex flex-col items-center"
        >
          <DialogHeader className="flex items-center">
            <DialogDescription>
              جدول يبين الساعات الضائعة شهريا لكل تلميذ حسب الاقسام.
            </DialogDescription>
          </DialogHeader>
          <div
            className="flex flex-col  items-center gap-5 print:w-screen print:h-screen"
            id="section-to-print-landscape"
          >
            <div className="flex gap-5 items-center">
              <p>القسم</p>
              <SelectItems
                iconTitle="اختر القسم"
                title="الاقسام"
                items={levels}
                itemName="full_className"
                setLevel={setLevel}
              />
              <p>الشهر</p>
              <SelectItems
                iconTitle="اختر الشهر"
                title="الأشهر"
                items={months}
                itemName="full_className"
                setLevel={setMonth}
              />
              <p>السنة</p>
              <SelectItems
                iconTitle="اختر السنة"
                title="السنوات"
                items={years}
                itemName="full_className"
                setLevel={setYear}
              />
            </div>
            <div className="w-full overflow-scroll print:overflow-visible print:h-screen h-[600px]">
              <table className="border-separate border border-slate-500 text print:w-screen">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr>
                    <th className="border border-slate-600 px-5">الرقم</th>
                    <th className="border border-slate-600 px-5">
                      الاسم واللقب
                    </th>
                    {Array.from(Array(monthDays).keys()).map((num) => (
                      <th className="border border-slate-600 px-2">
                        {num + 1}
                      </th>
                    ))}
                    <th className="border border-slate-600 px-5">المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {allClassStudents &&
                    allClassStudents.map((student, index) => {
                      let total = 0;
                      if (
                        student.createdAt < new Date(`${year}-${month}-30`) &&
                        (student.is_fired || student.switched_school)
                      ) {
                        return;
                      }
                      numOfStudents++;
                      return (
                        <tr key={index}>
                          <td className="border border-slate-700 px-5">
                            {numOfStudents}
                          </td>
                          <td className="border border-slate-700 px-5">
                            {student.full_name}
                          </td>

                          {Array.from(Array(monthDays).keys()).map((num) => {
                            const missedH =
                              studentsData2[
                                `${year}-${month}-${num + 1}`
                              ]?.filter((a) => a.id === student._id).length > 0
                                ? studentsData2[
                                    `${year}-${month}-${num + 1}`
                                  ].filter((a) => a.id === student._id)[0]
                                    .missedHours
                                : 0;
                            total += missedH;
                            realMissedHoursByClass += missedH;
                            totalMissedHoursByClass = classHours
                              ? numOfStudents * classHours
                              : numOfStudents * numdays * 6;
                            return (
                              <td className="border border-slate-700 px-2">
                                {missedH ? missedH : ""}
                              </td>
                            );
                          })}
                          <td className="border border-slate-700 px-2">
                            {total ? total : ""}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="flex w-full gap-6 justify-center">
              <Badge
                variant={"secondary"}
              >{`عدد الساعات الكلية: ${totalMissedHoursByClass} سا`}</Badge>
              <Badge
                variant={"secondary"}
              >{`عدد الساعات الضائعة: ${realMissedHoursByClass} سا`}</Badge>
              <Badge variant={"secondary"}>{`عدد الساعات الفعلية: ${
                totalMissedHoursByClass - realMissedHoursByClass
              } سا`}</Badge>
              <Badge variant={"default"}>{`نسبة الحضور : ${(
                ((totalMissedHoursByClass - realMissedHoursByClass) * 100) /
                totalMissedHoursByClass
              ).toFixed(2)} %`}</Badge>
              <Badge variant={"destructive"} className="p-2">{`نسبة الغياب : ${(
                (realMissedHoursByClass * 100) /
                totalMissedHoursByClass
              ).toFixed(2)} %`}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
