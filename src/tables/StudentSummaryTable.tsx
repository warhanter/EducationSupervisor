import React from "react";
export function StudentSummaryTablePrint({
  yesterdayCount,
  todayCount,
  newCount,
  goneCount,
}) {
  return (
    <table className="print-only w-full text-center">
      <thead>
        <tr>
          <th>الأمس</th>
          <th>اليوم</th>
          <th>الدخول</th>
          <th>الخروج</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{yesterdayCount}</td>
          <td>{todayCount}</td>
          <td>{newCount}</td>
          <td>{goneCount}</td>
        </tr>
      </tbody>
    </table>
  );
}
