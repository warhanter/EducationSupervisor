import React from "react";
export function TeacherAbsenceTablePrint({
  absencesByTeacher,
  missedHours,
  setMissedHours,
  totalHours,
  setTotalHours,
  ratio,
}) {
  return (
    <table className="print-only w-full text-center border-collapse">
      <thead>
        <tr>
          <th>#</th>
          <th>الأستاذ</th>
          <th>المادة</th>
          <th>عدد الحصص</th>
          {/* hours */}
        </tr>
      </thead>

      <tbody>
        {Object.entries(absencesByTeacher).map(([teacher, absences], i) => (
          <tr key={teacher}>
            <td>{i + 1}</td>
            <td>{teacher}</td>
            <td>{absences[0].module_name}</td>
            <td>{absences.length}</td>
          </tr>
        ))}

        <tr>
          <td colSpan={3}>مجموع الساعات الضائعة</td>
          <td>
            <input
              defaultValue={missedHours}
              onChange={(e) => setMissedHours(+e.target.value)}
            />
          </td>
          <td colSpan={2}>الحجم الساعي</td>
          <td>
            <input
              defaultValue={totalHours}
              onChange={(e) => setTotalHours(+e.target.value)}
            />
          </td>
          <td>{ratio}%</td>
        </tr>
      </tbody>
    </table>
  );
}
