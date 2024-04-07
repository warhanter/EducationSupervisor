import React, { useMemo, useState } from "react";
import HeaderNavbar from "./HeaderNavbar";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale/ar-DZ";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PDFViewer } from "@react-pdf/renderer";
import TableView from "./TableView";
import TableLuncheAbsenceView from "./TableLuncheAbsenceView";
import { useStudents } from "@/client/providers/StudentProvider";
import _ from "lodash";
const date_format = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};
function PDFPrint() {
  const [date, setDate] = React.useState<Date>();
  const { absences, lunchAbsences, students } = useStudents();
  const [isSelected, setIsSelected] = useState(true);
  const [isSelected2, setIsSelected2] = useState(false);
  const [currentItems2, setCurrentItems2] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [rapportDate, setRapportDate] = useState(new Date().setHours(23));
  const [dailyRapport, setDailyRapport] = useState(true);
  const [nisfdakhiliRapport, setNisfdakhiliRapport] = useState(false);
  const generateRapportTableData = () => {
    let result = [];
    let i = 0;
    const data11 = useMemo(() => {
      return _.filter(
        absences,
        (i) =>
          (new Date(i.date_of_return) > rapportDate || !i.date_of_return) &&
          new Date(i.date_of_absence) <= rapportDate
      );
    }, [rapportDate]);

    const options11 = {
      hour: "numeric",
      minute: "numeric",
    };
    const date_format2 = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
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
    const date1 = new Date(rapportDate).setHours(1);
    const date2 = new Date(rapportDate).setHours(24);
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
    <div className="flex flex-col min-h-screen w-full">
      <HeaderNavbar />
      <main className="grid grid-cols-1 md:grid-cols-4 p-4 md:gap-4">
        <div className="flex flex-col gap-2  mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-center text-center font-normal",
                  !rapportDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-4 h-4 w-4" />
                {rapportDate ? (
                  format(rapportDate, "PPPP", { locale: arDZ })
                ) : (
                  <span>اختر التاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[auto] p-0">
              <Calendar
                mode="single"
                selected={rapportDate}
                onSelect={setRapportDate}
                initialFocus
                locale={arDZ}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className={cn(isSelected && "bg-accent text-accent-foreground")}
            onClick={() => {
              setDailyRapport(true);
              setNisfdakhiliRapport(false);
              setIsSelected(true);
              setIsSelected2(false);
            }}
          >
            غيابات التلاميذ
          </Button>
          <Button
            variant="outline"
            className={cn(isSelected2 && "bg-accent text-accent-foreground")}
            onClick={() => {
              setDailyRapport(false);
              setNisfdakhiliRapport(true);
              setIsSelected(false);
              setIsSelected2(true);
            }}
          >
            غيابات المطعم
          </Button>
          <Button variant="outline">اشعار</Button>
          <Button variant="outline">تقرير</Button>
        </div>
        <div className="col-span-3 h-[50rem]">
          {dailyRapport && (
            <PDFViewer style={{ height: "100%", width: "100%" }}>
              <TableView data={absencesData} date={rapportDate} />
            </PDFViewer>
          )}

          {nisfdakhiliRapport && (
            <PDFViewer style={{ height: "100%", width: "100%" }}>
              <TableLuncheAbsenceView
                data={lunchabsenceData}
                date={rapportDate}
              />
            </PDFViewer>
          )}
        </div>
      </main>
    </div>
  );
}

export default PDFPrint;
