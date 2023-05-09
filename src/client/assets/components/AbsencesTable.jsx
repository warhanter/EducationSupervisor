import React from "react";
import "./Students.css";

const AbsencesTable = ({ data }) => {
  return (
    <table id="studentsTable">
      <thead>
        <tr>
          <th>الرقم</th>
          <th>اللقب</th>
          <th>الاسم</th>
          <th>تاريخ الميلاد</th>
          <th>السنة</th>
          <th>القسم</th>
          <th>الفوج</th>
          <th>الصفة</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((student, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{student.last_name}</td>
                <td>{student.first_name}</td>
                <td>
                  {new Date(student.date_of_absence).toLocaleDateString("fr")}
                </td>
                <td>{student.class_level}</td>
                <td>{student.class_name}</td>
                <td>{student.class_number}</td>
                <td>{student.student_status}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default AbsencesTable;
