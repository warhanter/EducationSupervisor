import React from "react";
export function NewStudentsTable({ students, minRows }) {
  return (
    <table className="w-full text-center font-bold">
      <caption>الدخول الجديد</caption>
      <thead>{/* headers */}</thead>
      <tbody>
        {students.map((s, i) => (
          <tr key={s.id}>
            <td>{i + 1}</td>
            <td>{s.full_name}</td>
            <td>{s.prev_class_name ?? s.class_abbreviation}</td>
            <td>{s.student_status}</td>
            <td />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
