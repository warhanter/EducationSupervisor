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

import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import {
  buildMonthlyAttendanceGrid,
  getAbsentStudentsForDate,
  missedHours,
} from "@/utils/utils/dateHelpers";

// Fetch holidays
const { data: holidays, error: holidaysError } = await supabase
  .from("calendar_events")
  .select("*");

if (holidaysError) {
  console.error("Error fetching holidays:", holidaysError);
}

// Fetch classroom with program and professor details (JOIN equivalent)
const { data: selectedClassProgram, error: classProgramError } =
  await supabase.from("classrooms").select(`
    *,
    program:class_programs!class_programs_classroom_id_fkey (
      *,
      module:professors!class_programs_professor_id_fkey (*)
    )
  `);

if (classProgramError) {
  console.error("Error fetching class program:", classProgramError);
}

// Fetch all absences with student details
const { data: absencesData, error: absencesError } = await supabase
  .from("absences")
  .select("*")
  .order("student_id");

if (absencesError) {
  console.error("Error fetching absences:", absencesError);
}

export function MonthlyAbsences({
  data,
  students,
}: {
  data: Record<string, any>[];
  students: Record<string, any>[];
}) {
  const [level, setLevel] = useState("");
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const todaysDate = new Date().setHours(23);

  const levels = _.sortBy(
    _.uniqBy(data, (e) => e.full_class_name),
    "class_abbreviation",
  );

  const program = selectedClassProgram?.filter(
    (a) => a?.class_fullName === level,
  )[0]?.program;

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  const allClassStudents = useMemo(
    () =>
      students
        .filter((student) => student.full_class_name === level)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [level],
  );

  const absentClassData = useMemo(
    () => data.filter((student) => student.full_class_name === level),
    [level],
  );

  // Students currently absent as of the selected todaysDate
  const currentlyAbsent = getAbsentStudentsForDate(absentClassData, todaysDate);
  const studentsData = currentlyAbsent.map((student, i) => ({
    number: i + 1,
    name: student.full_name,
    className: student.full_class_name,
    missedHours: missedHours(
      new Date(student.date_of_absence).getTime(),
      todaysDate,
      program,
    ),
    date: new Date(todaysDate).toLocaleDateString("en-ZA"),
  }));

  // Monthly attendance grid (one entry per school day)
  const { grid: studentsData2, classHours } = buildMonthlyAttendanceGrid(
    year,
    month,
    absentClassData,
    program,
    holidays ?? [],
  );

  const numdays = Object.keys(studentsData2).length;
  const monthDays = new Date(year, month, 0).getDate();
  let numOfStudents = 0;
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
                itemName="full_class_name"
                setLevel={setLevel}
              />
              <p>الشهر</p>
              <SelectItems
                iconTitle="اختر الشهر"
                title="الأشهر"
                items={months}
                itemName="full_class_name"
                setLevel={setMonth}
              />
              <p>السنة</p>
              <SelectItems
                iconTitle="اختر السنة"
                title="السنوات"
                items={years}
                itemName="full_class_name"
                setLevel={setYear}
              />
            </div>
            <div className="w-full overflow-scroll print:overflow-visible print:h-screen h-[600px]">
              <table className="border-separate border  border-slate-500 text print:w-screen">
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
                            const dayKey = `${year}-${month}-${num + 1}`;
                            const missedH =
                              studentsData2[dayKey]?.find(
                                (a) => a.id === student.id,
                              )?.missedHours ?? 0;
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
