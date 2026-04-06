import React from "react";
import { shouldExcludeStudent } from "../utils/absenceUtils";

interface MonthlyAbsenceTableProps {
  students: any[];
  monthDays: number;
  year: number;
  month: number;
  dailyAbsences: Record<string, Array<{ id: string; missedHours: number }>>;
  onDataCalculated: (totalMissed: number, totalClass: number, numStudents: number) => void;
}

export const MonthlyAbsenceTable: React.FC<MonthlyAbsenceTableProps> = ({
  students,
  monthDays,
  year,
  month,
  dailyAbsences,
  onDataCalculated,
}) => {
  let studentNumber = 0;
  let totalRealMissedHours = 0;
  const activeStudents = students.filter(
    (student) => !shouldExcludeStudent(student, year, month)
  );

  return (
    <table className="border-separate border border-zinc-500 border-slate-500 text print:w-screen">
      <thead className="sticky top-0 z-10 bg-white">
        <tr>
          <th className="border border-slate-600 px-5">الرقم</th>
          <th className="border border-slate-600 px-5">الاسم واللقب</th>
          {Array.from(Array(monthDays).keys()).map((num) => (
            <th key={num} className="border border-slate-600 px-2">
              {num + 1}
            </th>
          ))}
          <th className="border border-slate-600 px-5">المجموع</th>
        </tr>
      </thead>
      <tbody>
        {activeStudents.map((student, index) => {
          studentNumber++;
          let studentTotal = 0;

          return (
            <tr key={student.id || index}>
              <td className="border border-slate-700 px-5">{studentNumber}</td>
              <td className="border border-slate-700 px-5">
                {student.full_name}
              </td>

              {Array.from(Array(monthDays).keys()).map((num) => {
                const dayKey = `${year}-${month}-${num + 1}`;
                const dayAbsences = dailyAbsences[dayKey] || [];
                const studentAbsence = dayAbsences.find(
                  (a) => a.id === student.id
                );
                const missedHours = studentAbsence?.missedHours || 0;

                studentTotal += missedHours;
                totalRealMissedHours += missedHours;

                return (
                  <td key={num} className="border border-slate-700 px-2">
                    {missedHours || ""}
                  </td>
                );
              })}

              <td className="border border-slate-700 px-2">
                {studentTotal || ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
