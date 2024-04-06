import React from "react";
import "../styles/Students.css";
import { reverseString } from "../contexts/AppFunctions";

const MedicalLeaveTable = ({ data }) => {
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
          <th>بداية العطلة المرضية</th>
          <th>تاريخ العودة</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((student, i) => {
            const student_DOI = new Date(student.student_DOB);
            const startDate = new Date(student.medical_leave_startDate);
            const endDate = new Date(student.medical_leave_endDate);
            const todayDate = new Date();
            const textColor = todayDate >= endDate ? "red" : null;
            return (
              <tr style={{ color: textColor }} key={i}>
                <td>{i + 1}</td>
                <td>{student.last_name}</td>
                <td>{student.first_name}</td>
                <td>
                  {reverseString(student_DOI.toLocaleDateString("fr"), "/")}
                </td>
                <td>{student.level}</td>
                <td>{student.class_name}</td>
                <td>{student.class_number}</td>
                <td>{student.student_status}</td>
                <td>
                  {reverseString(startDate.toLocaleDateString("fr"), "/")}
                </td>
                <td>{reverseString(endDate.toLocaleDateString("fr"), "/")}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default MedicalLeaveTable;
