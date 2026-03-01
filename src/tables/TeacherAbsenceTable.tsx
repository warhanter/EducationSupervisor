import React from "react";
import {
  formatPercentage,
  getAbsenceInHourSlot,
} from "@/utils/utils/dateHelpers";

const MORNING_SLOTS = [8, 9, 10, 11];
const AFTERNOON_SLOTS = [13.5, 14.5, 15.5, 16.5];

export function TeacherAbsenceTable({
  groupedByTeacher,
  todayDate,
  minRows,
  missedHours,
  setMissedHours,
  totalHours,
  setTotalHours,
}) {
  const teacherKeys = Object.keys(groupedByTeacher);

  return (
    <table className="w-full text-center mb-2">
      <thead>{/* full header unchanged */}</thead>
      <tbody className="text-sm font-bold">
        {teacherKeys.map((teacher, i) => {
          const records = groupedByTeacher[teacher];
          const date = new Date(todayDate);

          return (
            <tr key={teacher}>
              <td>{i + 1}</td>
              <td>{teacher}</td>
              <td>{records[0].module_name}</td>
              <td>{records.length}</td>

              {/* Morning time slots */}
              {MORNING_SLOTS.map((h) => (
                <td key={h}>
                  {getAbsenceInHourSlot(records, date, h)?.class_name}
                </td>
              ))}

              <td className="bg-gray-200" />

              {/* Afternoon time slots */}
              {AFTERNOON_SLOTS.map((h) => (
                <td key={h}>
                  {getAbsenceInHourSlot(records, date, h)?.class_name}
                </td>
              ))}

              <td />
              <td />
            </tr>
          );
        })}

        {/* Footer */}
        <tr className="bg-gray-200">
          <td colSpan={3}>مجموع الساعات الضائعة</td>
          <td>
            <input
              defaultValue={missedHours}
              onChange={(e) => setMissedHours(+e.target.value)}
            />
          </td>
          <td colSpan={5}>الحجم الساعي اليومي</td>
          <td>
            <input
              defaultValue={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
            />
          </td>
          <td colSpan={4}>النسبة</td>
          <td>{formatPercentage(missedHours, totalHours)}</td>
        </tr>
      </tbody>
    </table>
  );
}
