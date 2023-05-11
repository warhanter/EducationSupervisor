import React, { useEffect, useState } from "react";
import "./Students.css";
import { Badge } from "react-bootstrap";
import _ from "lodash";

const AbsencesTable = ({ data }) => {
  const options11 = {
    hour: "numeric",
    minute: "numeric",
  };
  const date_format2 = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const generateRapportTableData = () => {
    let result = [];
    let i = 0;

    data.map((student) => {
      let studentObject = {};
      if (student.is_absent === false) {
        return;
      }
      i += 1;
      const dateOfAbsence = new Date(student.absence_date);
      const date1 = Date.now();
      // const date2 = student.absence_date.getTime();
      const date2 = new Date(student.absence_date);
      const daysOfAbcence = Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
      const missedHours = () => {
        const start = parseInt(
          new Intl.DateTimeFormat("fr", options11)
            .format(dateOfAbsence)
            .slice(0, 2)
        );
        const weekday = new Intl.DateTimeFormat("fr", {
          weekday: "long",
        }).format(Date.now());
        return (weekday === "mardi") & (daysOfAbcence >= 1)
          ? `4  -  0`
          : (weekday === "mardi") & (daysOfAbcence < 1)
          ? `${12 - start}  -  0`
          : daysOfAbcence >= 1
          ? `4  -  3`
          : start > 12
          ? `0  -  ${16 - start}`
          : `${12 - start}  -  3`;
      };
      const noticeName = () => {
        return daysOfAbcence < 3
          ? "/"
          : (daysOfAbcence >= 3) & (daysOfAbcence < 7)
          ? "إشعار 1"
          : (daysOfAbcence >= 7) & (daysOfAbcence < 15)
          ? "إشعار 2"
          : (daysOfAbcence >= 15) & (daysOfAbcence < 31)
          ? "إعذار"
          : "شطب";
      };
      studentObject.id = i.toString();
      studentObject.last_name = student.last_name;
      studentObject.first_name = student.first_name;
      studentObject.student_status = student.student_status;
      studentObject.class = `${student.level} ${student.class_name} ${student.class_number}`;
      studentObject.absence_date = new Intl.DateTimeFormat(
        "fr",
        date_format2
      ).format(dateOfAbsence);
      studentObject.missed_hours = missedHours();
      studentObject.absence_days =
        daysOfAbcence < 1
          ? "01"
          : daysOfAbcence.toLocaleString("fr", {
              minimumIntegerDigits: 2,
            });
      studentObject.noticeName = noticeName();
      result.push(Object.assign({}, studentObject));
    });
    return result;
  };

  let absencesData = generateRapportTableData();
  absencesData = _.orderBy(absencesData, ["class", "absence_days"], ["asc"]);

  const filterData = (filterName) => {
    return _.filter(absencesData, (item) => item.student_status === filterName);
  };

  return (
    <div>
      <div className="my-3 w-100 d-flex justify-content-end">
        <h4>
          <Badge bg="danger">{`نصف داخلي : ${
            filterData("نصف داخلي").length
          }`}</Badge>
        </h4>
        <h4>
          <Badge className="mx-4" bg="danger">{`خارجي : ${
            filterData("خارجي").length
          }`}</Badge>
        </h4>
        <h4>
          <Badge
            className="ml-4"
            bg="danger"
          >{`عدد الغيابات : ${absencesData.length}`}</Badge>
        </h4>
      </div>
      <table id="studentsTable">
        <thead>
          <tr>
            <th>الرقم</th>
            <th>اللقب</th>
            <th>الاسم</th>
            <th>القسم</th>
            <th>تاريخ الغياب</th>
            <th>سا/غ</th>
            <th>الايام</th>
            <th>الاجراء</th>
          </tr>
        </thead>
        <tbody>
          {absencesData &&
            absencesData.map((student, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{student.last_name}</td>
                  <td>{student.first_name}</td>
                  <td>{student.class}</td>
                  <td>
                    {new Date(student.absence_date).toLocaleDateString("fr")}
                  </td>
                  <td>{student.missed_hours}</td>
                  <td>{student.absence_days}</td>
                  <td>{student.noticeName}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AbsencesTable;
