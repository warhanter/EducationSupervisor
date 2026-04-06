import React from "react";

export function StudentLevelTable({
  levelName,
  studentsByClass,
  absencesByClass,
  totalStudents,
  totalAbsences,
  minCells,
}) {
  return (
    <>
      <thead>
        <tr>
          <th>{levelName}</th>
          {Object.keys(studentsByClass).map((c) => (
            <th key={c}>{c}</th>
          ))}
          {Array.from({
            length: minCells - Object.keys(studentsByClass).length,
          }).map((_, i) => (
            <th key={i} />
          ))}
          <th>المجموع</th>
          <th>نسبة الغياب</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>التعداد</td>
          {Object.keys(studentsByClass).map((c) => (
            <td key={c}>{studentsByClass[c].length}</td>
          ))}
          <td>{totalStudents}</td>
          <td rowSpan={2}>
            {((totalAbsences * 100) / totalStudents).toFixed(2)}%
          </td>
        </tr>

        <tr>
          <td>الغياب</td>
          {Object.keys(studentsByClass).map((c) => (
            <td key={c}>{absencesByClass[c]?.length || 0}</td>
          ))}
          <td>{totalAbsences}</td>
        </tr>
      </tbody>
    </>
  );
}
