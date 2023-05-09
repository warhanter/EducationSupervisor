import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Html from "react-pdf-html";
import jsPDF from "jspdf";
import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
// import app from "../../realm";
import * as Realm from "realm-web";
import { Button } from "react-bootstrap";
import "../fonts/Janna LT Bold-normal.js";
import "../fonts/Janna LT Bold-bold.js";

const appID = "supervisorapp-nlsbq";
const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student`;
const dbAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Absence`;

// Create Document Component
const MyDocument = () => {
  const app = Realm.getApp(appID);
  const [accessToken, setAccessToken] = useState(app.currentUser?.accessToken);
  const [data, setData] = useState([]);
  const [currentItems2, setCurrentItems2] = useState([]);

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

  const daily_rapport = false;

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
    doc.setFont("Janna LT Bold", "normal", 400);
    doc.setLanguage("ar");
    doc.setLineHeightFactor(0.5);
    doc.text(
      `غيابات التلاميذ ليوم ${new Date().toLocaleDateString("fr")}`,
      200,
      15,
      null,
      null,
      "right"
    );
    doc.table(30, 20, generateData(), headers, {
      autoSize: true,
      fontSize: 8,
      printHeaders: true,
    });
    doc.save();
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
  const getDataAbsence = useCallback(async () => {
    return fetch(dbAbsences, {
      method: "GET",
      headers: headers,
    }).then((res) => (res.ok ? res.json() : undefined));
  }, []);

  const handleData = async () => {
    const data1 = await getDataStudent();
    const data2 = await getDataAbsence();
    if (data1 === undefined) {
      setError("Error loading Data, please logout and login again...   ");
      return;
    }
    if (data2 === undefined) {
      setError("Error loading Data, please logout and login again...   ");
      return;
    }
    setData(data1);
    setCurrentItems2(data2);
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

  return (
    <>
      <Button className="m-4" onClick={() => handleGeneratePdf()}>
        Print Table
      </Button>
      <PDFViewer style={{ height: "100%", width: "100%" }}>
        <Document>
          <Page size="A4"></Page>
        </Document>
      </PDFViewer>
    </>
  );
};

export default MyDocument;
