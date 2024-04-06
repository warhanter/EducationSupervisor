import React, { useEffect, useMemo, useState } from "react";
import "../styles/Students.css";
import {
  Alert,
  Badge,
  Button,
  Dropdown,
  DropdownButton,
  Modal,
} from "react-bootstrap";
import { filter } from "lodash";
import { reverseString } from "../contexts/AppFunctions";
import app from "../../realm";

const mongo = app.currentUser?.mongoClient("mongodb-atlas");
const holidaysCollection = mongo.db("todo").collection("Holidays");
const holidays = await holidaysCollection.find();

Date.prototype.between = function (a, b) {
  let min = Math.min.apply(Math, [a.getTime(), b.getTime()]);
  let max = Math.max.apply(Math, [a.getTime(), b.getTime()]);
  return this >= min && this <= max;
};
const hours = {
  Sunday: 7,
  Monday: 7,
  Tuesday: 4,
  Wednesday: 7,
  Thursday: 7,
  Friday: 0,
  Saturday: 0,
};

const AbsencesTable = ({
  data,
  rapportDate,
  itemOffset,
  fullDataForCounting,
  selectedClass,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteData, setDeleteData] = useState();
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

    data?.map((student) => {
      let studentObject = {};
      i += 1;
      const dateOfAbsence = new Date(student.date_of_absence);
      // const date1 = rapportDate;
      // const date1 = dateOfA.getTime(); //date of return
      // const date2 = student.absence_date.getTime(); //date of absence
      const daysOfAbcence = Math.round(
        (rapportDate - dateOfAbsence) / (1000 * 60 * 60 * 24)
      );

      const dailyMissedHours = () => {
        const start = parseInt(
          new Intl.DateTimeFormat("fr", options11)
            .format(dateOfAbsence)
            .slice(0, 2)
        );
        const weekday = new Intl.DateTimeFormat("fr", {
          weekday: "long",
        }).format(Date.now());
        return weekday === "mardi" && daysOfAbcence > 1
          ? `4  -  0`
          : weekday === "mardi" && daysOfAbcence <= 1
          ? `${12 - start}  -  0`
          : daysOfAbcence > 1
          ? `4  -  3`
          : start > 12
          ? `0  -  ${16 - start}`
          : `${12 - start}  -  3`;
      };

      const calcMissedHoursByDay = (day) => {
        const start = parseInt(
          new Intl.DateTimeFormat("fr", options11)
            .format(dateOfAbsence)
            .slice(0, 2),
          10
        );
        const end = parseInt(
          new Intl.DateTimeFormat("fr", options11)
            .format(new Date())
            .slice(0, 2),
          10
        );
        const weekday1 = new Intl.DateTimeFormat("fr", {
          weekday: "long",
        }).format(new Date());
        const weekday2 = new Intl.DateTimeFormat("fr", {
          weekday: "long",
        }).format(new Date(dateOfAbsence));
        switch (day) {
          case "first_day":
            return weekday2 === "mardi"
              ? 12 - start
              : start > 12
              ? 16 - start
              : 12 - start + 3;
          case "last_day":
            return weekday1 === "mardi"
              ? end - 8
              : end > 12
              ? 4 + end - 13
              : end - 8;
          default:
            return weekday1 === "mardi" && end > 12
              ? 12 - start
              : weekday1 === "mardi" && end <= 12
              ? end - start
              : start > 12
              ? end - start
              : end < 12
              ? end - start
              : 12 - start + end - 13;
        }
      };

      const totalMissedHours = () => {
        let sums = 0;

        const first_day = calcMissedHoursByDay("first_day");
        const last_day = calcMissedHoursByDay("last_day");
        const same_day = calcMissedHoursByDay("same_day");

        if (daysOfAbcence < 1) {
          sums += same_day;
        } else {
          sums += first_day;
          sums += last_day;
          for (let i = 1; i < daysOfAbcence; i++) {
            try {
              holidays.map((day) => {
                if (
                  new Date(
                    new Date(
                      new Date(dateOfAbsence).getTime() + 86400000 * i
                    ).toLocaleDateString("en-CA")
                  ).between(
                    new Date(day.start_date.toLocaleDateString("en-CA")),
                    new Date(day.end_date.toLocaleDateString("en-CA"))
                  )
                ) {
                  const dayName = new Intl.DateTimeFormat("en", {
                    weekday: "long",
                  }).format(new Date(dateOfAbsence).getTime() + 86400000 * i);
                  sums -= hours[dayName];
                }
              });
              const dayName = new Intl.DateTimeFormat("en", {
                weekday: "long",
              }).format(new Date(dateOfAbsence).getTime() + 86400000 * i);
              sums += hours[dayName];
            } catch (error) {
              console.log(error);
            }
          }
        }
        return sums;
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
      studentObject.student_id = student.student_id;
      studentObject.absence_id = student._id;
      studentObject.last_name = student.last_name;
      studentObject.first_name = student.first_name;
      studentObject.student_status = student.student_status;
      studentObject.absence_status = student.absence_status;
      studentObject.full_className = student.full_className;
      studentObject.absence_date = new Intl.DateTimeFormat(
        "fr",
        date_format2
      ).format(dateOfAbsence);
      studentObject.missed_hours = dailyMissedHours();
      studentObject.calculated_missed_hours = totalMissedHours();
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
  const absencesData = generateRapportTableData();

  const filterData = (filterName) => {
    return filter(
      fullDataForCounting,
      (item) => item.student_status === filterName
    );
  };

  const handleDeleteAbsence = () => {
    try {
      const StudentCollection = app.currentUser
        .mongoClient("mongodb-atlas")
        .db("todo")
        .collection("Student");
      const AbsenceCollection = app.currentUser
        .mongoClient("mongodb-atlas")
        .db("todo")
        .collection("Absence");
      StudentCollection.updateOne(
        { _id: deleteData?.student_id },
        { $set: { is_absent: false, absence_date: null } }
      );
      AbsenceCollection.updateOne(
        { _id: deleteData?.absence_id },
        {
          $set: {
            absence_status: false,
            date_of_return: new Date(),
            missed_hours: deleteData?.missed_hours,
          },
        }
      );
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleOpenModal = (
    student_id,
    absence_id,
    missed_hours,
    last_name,
    first_name
  ) => {
    setDeleteData({
      student_id: student_id,
      absence_id: absence_id,
      missed_hours: missed_hours,
      last_name: last_name,
      first_name: first_name,
    });
    setShowModal(true);
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header dir="rtl" closeButton>
          <Modal.Title>رسالة تأكيد</Modal.Title>
        </Modal.Header>
        <Modal.Body dir="rtl">
          {`هل تريد حذف التلميذ(ة) ${
            deleteData?.last_name + " " + deleteData?.first_name
          } من قائمة الغيابات؟`}
        </Modal.Body>
        <Modal.Footer dir="rtl">
          <Button variant="secondary" onClick={handleCloseModal}>
            تراجع
          </Button>
          <Button variant="danger" onClick={handleDeleteAbsence}>
            حــــذف
          </Button>
        </Modal.Footer>
      </Modal>
      {!selectedClass && (
        <div className="my-3 w-100 d-flex justify-content-end align-content-center">
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
            >{`عدد الغيابات : ${fullDataForCounting?.length}`}</Badge>
          </h4>
        </div>
      )}
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
            <th>المبرر</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {absencesData &&
            absencesData.map((student, i) => {
              return (
                <tr key={i}>
                  <td>{itemOffset + i + 1}</td>
                  <td>{student.last_name}</td>
                  <td>{student.first_name}</td>
                  <td>{student.full_className}</td>
                  <td>{reverseString(student.absence_date, "/")}</td>
                  <td>{student.missed_hours}</td>
                  <td>{student.absence_days}</td>
                  <td>{student.noticeName}</td>
                  <td>{student.medical_leave ? "ش طبية" : ""}</td>
                  {student.absence_status ? (
                    <td className="d-flex justify-content-center align-items-center">
                      <Button
                        onClick={
                          () =>
                            handleOpenModal(
                              student.student_id,
                              student.absence_id,
                              student.calculated_missed_hours,
                              student.last_name,
                              student.first_name
                            )
                          // console.log(student.calculated_missed_hours)
                        }
                        variant="danger"
                      >
                        حذف
                      </Button>
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AbsencesTable;
