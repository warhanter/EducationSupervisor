import React from "react";
import "../styles/Students.css";
import { reverseString } from "../contexts/AppFunctions";
const StudentTable = ({ data, tableName }) => {
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
          {tableName === "moghadirin" && <th>تاريخ التحويل</th>}
          {tableName === "wafidin" && <th>تاريخ الدخول</th>}
          {tableName === "machtobin" && <th>تاريخ الشطب</th>}
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
                  {reverseString(
                    new Date(student.student_DOB).toLocaleDateString("fr"),
                    "/"
                  )}
                </td>
                <td>{student.level}</td>
                <td>{student.class_name}</td>
                <td>{student.class_number}</td>
                <td>{student.student_status}</td>
                {tableName === "moghadirin" && (
                  <td>
                    {reverseString(
                      new Date(student.createdAt).toLocaleDateString("fr"),
                      "/"
                    )}
                  </td>
                )}
                {tableName === "wafidin" && <td>{student.student_DOI}</td>}
                {tableName === "machtobin" && (
                  <td>
                    {reverseString(
                      new Date(student.createdAt).toLocaleDateString("fr"),
                      "/"
                    )}
                  </td>
                )}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default StudentTable;
