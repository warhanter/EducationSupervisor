import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useMemo,
} from "react";
import { PDFViewer } from "@react-pdf/renderer";
import * as Realm from "realm-web";
import { Button, Container } from "react-bootstrap";
import TableView from "./TableView.jsx";
import TableLuncheAbsenceView from "./TableLuncheAbsenceView.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { filter } from "lodash";
import _ from "lodash";
import { useStudents } from "../../providers/StudentProvider";

// Create Document Component
const MyDocument = () => {
  const { absences, lunchAbsences, students } = useStudents();
  const [currentItems2, setCurrentItems2] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [rapportDate, setRapportDate] = useState(new Date().setHours(23));
  const [nisfdakhiliRapportDate, setNisfdakhiliRapportDate] = useState(
    new Date()
  );
  const [dailyRapport, setDailyRapport] = useState(true);
  const [nisfdakhiliRapport, setNisfdakhiliRapport] = useState(false);

  const data11 = useMemo(() => {
    return _.filter(
      absences,
      (i) =>
        (new Date(i.date_of_return) > rapportDate || !i.date_of_return) &&
        new Date(i.date_of_absence) <= rapportDate
    );
  }, [rapportDate]);

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="w-100 mb-3 btn btn-primary" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

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

    data11?.map((student, index) => {
      let studentObject = {};
      if (student.is_absent === false) {
        return;
      }
      i += 1;
      const dateOfAbsence = new Date(student.date_of_absence);
      const date1 = rapportDate;
      const date2 = new Date(student.date_of_absence);
      const daysOfAbcence = Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
      const missedHours = () => {
        const start = parseInt(
          new Intl.DateTimeFormat("fr", options11)
            .format(dateOfAbsence)
            .slice(0, 2)
        );
        const weekday = new Intl.DateTimeFormat("fr", {
          weekday: "long",
        }).format(rapportDate);
        return (weekday === "mardi") & (daysOfAbcence >= 1)
          ? `4  -  0`
          : (weekday === "mardi" ||
              weekday === "tuesday" ||
              weekday === "Tuesday") &
            (daysOfAbcence < 1)
          ? `${12 - start}  -  0`
          : daysOfAbcence > 1
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
      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject.last_name = student.last_name;
      studentObject.first_name = student.first_name;
      studentObject.medical_leave = student.medical_leave ? "ش طبية" : "";
      studentObject.class = `${student.class_level} ${student.class_name} ${student.class_number}`;
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
  const generateLunchAbsenceTableData = () => {
    let result = [];
    let i = 0;
    const date1 = nisfdakhiliRapportDate.setHours(7);
    const date2 = nisfdakhiliRapportDate.setHours(23);
    let filteredAbsenceData = _.filter(
      lunchAbsences,
      (i) =>
        new Date(i.absence_date).getTime() > date1 &&
        new Date(i.absence_date).getTime() < date2
    );
    filteredAbsenceData.map((student, index) => {
      let studentdataobject = _.filter(
        students,
        (i) => i?._id === student?.student
      );
      let studentObject = {};
      i += 1;

      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject.absence_date = student.absence_date;
      studentObject.last_name = studentdataobject[0]?.last_name;
      studentObject.first_name = studentdataobject[0]?.first_name;
      studentObject.tableNumber = studentdataobject[0]?.lunch_table_number;
      studentObject.justification =
        studentdataobject[0]?.lunch_absence_justification == true
          ? "تصريـــح شرفي"
          : "";
      studentObject.class = `${studentdataobject[0]?.level} ${studentdataobject[0]?.class_name} ${studentdataobject[0]?.class_number}`;
      result.push(Object.assign({}, studentObject));
    });
    return result;
  };

  const absencesData = generateRapportTableData();
  const lunchabsenceData = generateLunchAbsenceTableData();
  absencesData.sort((a, b) => (a.class > b.class ? -1 : 1));
  lunchabsenceData.sort((a, b) => (a.class > b.class ? 1 : -1));
  return (
    <Container
      style={{ fontFamily: "serif" }}
      className="d-flex flex-row-reverse"
    >
      <div className="d-flex flex-column align-items-end mt-4 pe-4 w-25">
        <Button
          variant="dark"
          className="w-100 mb-3"
          onClick={() => {
            setDailyRapport(true);
            setNisfdakhiliRapport(false);
          }}
        >
          غيابات التلاميذ
        </Button>
        <DatePicker
          showIcon
          selected={rapportDate}
          onChange={(date) => setRapportDate(date.setHours(23))}
          customInput={<ExampleCustomInput />}
        />
        <Button
          variant="dark"
          className="w-100 mb-3"
          onClick={() => {
            setDailyRapport(false);
            setNisfdakhiliRapport(true);
          }}
        >
          غيابات ن داخلي
        </Button>
        <DatePicker
          showIcon
          selected={nisfdakhiliRapportDate}
          onChange={(date) => setNisfdakhiliRapportDate(date)}
          customInput={<ExampleCustomInput />}
        />
        <Button className="w-100 mb-3">استدعاء</Button>
        <Button className="w-100 mb-3">تقرير بتلميذ</Button>
        <Button className="w-100 mb-3">التقرير اليومي</Button>
      </div>
      <div className="w-100 vh-100 mt-4">
        {dailyRapport && (
          <PDFViewer style={{ height: "100%", width: "100%" }}>
            <TableView data={absencesData} date={rapportDate} />
          </PDFViewer>
        )}

        {nisfdakhiliRapport && (
          <PDFViewer style={{ height: "100%", width: "100%" }}>
            <TableLuncheAbsenceView
              data={lunchabsenceData}
              date={nisfdakhiliRapportDate}
            />
          </PDFViewer>
        )}
      </div>
    </Container>
  );
};

export default MyDocument;
