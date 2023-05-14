import React, { useCallback, useEffect, useState } from "react";
import jsPDF from "jspdf";
import { PDFViewer, StyleSheet } from "@react-pdf/renderer";
import * as Realm from "realm-web";
import { Button, Container } from "react-bootstrap";
import TableView from "./TableView.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const appID = "supervisorapp-nlsbq";
const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student`;

// Create Document Component
const MyDocument = () => {
  const app = Realm.getApp(appID);
  const [accessToken, setAccessToken] = useState(app.currentUser?.accessToken);
  const [data, setData] = useState([]);
  const [currentItems2, setCurrentItems2] = useState([]);
  const [attribute, setAttribute] = useState(new jsPDF().output("bloburl"));
  const [startDate, setStartDate] = useState(new Date());

  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken,
  });
  const options11 = {
    hour: "numeric",
    minute: "numeric",
  };
  const date_format2 = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const handleGeneratePdf = () => {
    const absencesData = generateRapportTableData();
    absencesData.sort((a, b) => (a.class > b.class ? 1 : -1));
    var generateData = function () {
      var result = [];
      for (var i = 0; i < absencesData.length; i += 1) {
        absencesData[i]._id = (i + 1).toString();
        result.push(Object.assign({}, absencesData[i]));
      }
      return result;
    };

    function createHeaders(keys) {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: headersTitle[keys[i]],
          width: 80,
          align: "right",
          padding: 0,
          height: 40,
        });
      }
      return result;
    }

    const headersTitle = {
      _id: "الرقم",
      last_name: "اللقب",
      first_name: "الإسم",
      class: "القسم",
      absence_date: "تاريخ الغياب",
      missed_hours: "سا/غ",
      absence_days: "الأيام",
      noticeName: "الإجراء",
    };
    var headers = createHeaders([
      "noticeName",
      "absence_days",
      "missed_hours",
      "absence_date",
      "class",
      "first_name",
      "last_name",
      "_id",
    ]);

    currentItems2.forEach((student) => {
      Object.entries(student).forEach(([key, value]) => {
        student[key] = value.toString();
      });
    });

    var doc = new jsPDF({
      precision: 10,
      putOnlyUsedFonts: true,
      orientation: "p",
    });
    doc.setFont("Janna LT Bold");
    doc.setLanguage("ar");
    doc.setFontSize(14);
    doc.setLineHeightFactor(0.5);
    doc.text(
      `غيابات التلاميذ ليوم: ${new Date().toLocaleDateString("fr")}`,
      190,
      13,
      null,
      null,
      "right"
    );
    doc.table(20, 20, generateData(), headers, {
      autoSize: true,
      fontSize: 10,
      printHeaders: true,
    });
    // doc.save();

    setAttribute(doc.output("bloburl"));
  };

  useEffect(() => {
    handleData();
  }, []);

  const getDataStudent = useCallback(async () => {
    return fetch(dbAPI, {
      method: "GET",
      headers: headers,
    }).then((res) => (res.ok ? res.json() : undefined));
  }, []);
  const handleData = async () => {
    const data1 = await getDataStudent();
    if (data1 === undefined) {
      setError("Error loading Data, please logout and login again...   ");
      return;
    }
    setData(data1);
  };

  const generateRapportTableData = () => {
    let result = [];
    let i = 0;

    data.map((student, index) => {
      let studentObject = {};
      if (student.is_absent === false) {
        return;
      }
      i += 1;
      const dateOfAbsence = new Date(student.absence_date);
      const date1 = Date.now();
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
      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject.last_name = student.last_name;
      studentObject.first_name = student.first_name;
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

  const absencesData = generateRapportTableData();
  absencesData.sort((a, b) => (a.class > b.class ? 1 : -1));

  return (
    <Container
      style={{ fontFamily: "serif" }}
      className="d-flex flex-row-reverse"
    >
      <div className="d-flex flex-column align-items-end mt-4 pe-4 w-25">
        <DatePicker
        showIcon
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        />
        <Button className="w-100 mb-3" onClick={() => handleGeneratePdf()}>
          استدعاء
        </Button>
        <Button className="w-100 mb-3" onClick={() => handleGeneratePdf()}>
          تقرير بتلميذ
        </Button>
        <Button className="w-100 mb-3" onClick={() => handleGeneratePdf()}>
          التقرير اليومي
        </Button>
      </div>
      {/* {attribute && (
        <div className="w-100 vh-100 mt-4">
          <iframe
            id="main-iframe"
            src={attribute}
            style={{
              width: "100%",
              height: "100%",
              zIndex: 2,
              border: "none",
            }}
          />
        </div>
      )} */}
      <div className="w-100 vh-100 mt-4">
        <PDFViewer style={{ height: "100%", width: "100%" }}>
          <TableView data={absencesData} date={startDate}></TableView>
        </PDFViewer>
      </div>
    </Container>
  );
};

export default MyDocument;
