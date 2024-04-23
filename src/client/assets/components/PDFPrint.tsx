import React, { useEffect, useState } from "react";
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
// import { PDFViewer } from "@react-pdf/renderer";
// import TableView from "./TableView";
// import TableLuncheAbsenceView from "./TableLuncheAbsenceView";
import { Student, useStudents } from "@/client/providers/StudentProvider";
import _, { groupBy } from "lodash";
import { AlertInfo } from "./Alert";
import LoadingSpinnerNew from "./LoadingSpinnerNew";
import PDFPrintTables from "./PDFPrintTables";
import LuncAbsencePrintTable from "./LuncAbsencePrintTable";
import MedicalLeavePrintTable from "./MedicalLeavePrintTable";
import MaafiyinPrintTable from "./MaafiyinPrintTale";

function PDFPrint() {
  const {
    absences,
    lunchAbsences,
    students,
    otlaMaradiya,
    maafiyin,
    moghadirin,
    wafidin,
    motamadrisin,
  } = useStudents();

  const [loading, setLoading] = useState(true);
  const [absencesData, setabsencesData] = useState<Student[]>();
  const [table, setTable] = useState("ghiyabat");
  const [lunchabsenceData, setlunchabsenceData] = useState<Student[]>();
  const tasrih_charafi = motamadrisin.filter(
    (student) => student.lunch_absence_justification
  );
  const [rapportDate, setRapportDate] = useState<number>(
    new Date().setHours(23)
  );
  const studentsGroupedByClass = groupBy(motamadrisin, "full_className");

  const filtredghiyabat = absences?.filter(
    (student) =>
      !students?.filter((b) => b._id === student.student_id)[0]?.is_fired
  );
  const generateRapportTableData = async () => {
    let result: any = [];
    let i = 0;
    // const data11 = useMemo(() => {
    //   return _.filter(
    //     absences,
    //     (i) =>
    //       (new Date(i.date_of_return).getTime() > rapportDate ||
    //         !i.date_of_return) &&
    //       new Date(i.date_of_absence).getTime() <= rapportDate
    //   );
    // }, [rapportDate]);
    const data11 = _.filter(
      filtredghiyabat,
      (i) =>
        (new Date(i.date_of_return).getTime() > rapportDate ||
          !i.date_of_return) &&
        new Date(i.date_of_absence).getTime() <= rapportDate
    );
    data11?.map((student, index) => {
      let studentObject: any = {};
      if (student.is_absent === false) {
        return;
      }
      i += 1;
      const dateOfAbsence = new Date(student.date_of_absence);
      const date1 = rapportDate;
      const date2 = new Date(student.date_of_absence).getTime();
      const daysOfAbcence = Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
      const missedHours = () => {
        const start = parseInt(
          new Intl.DateTimeFormat("fr", {
            hour: "numeric",
            minute: "numeric",
          })
            .format(dateOfAbsence)
            .slice(0, 2)
        );
        const weekday = new Intl.DateTimeFormat("fr", {
          weekday: "long",
        }).format(rapportDate);
        return weekday === "mardi" && daysOfAbcence >= 1
          ? `4  -  0`
          : (weekday === "mardi" ||
              weekday === "tuesday" ||
              weekday === "Tuesday") &&
            daysOfAbcence < 1
          ? `${12 - start}  -  0`
          : daysOfAbcence > 1
          ? `4  -  3`
          : start > 12
          ? `0  -  ${16 - start}`
          : `${12 - start}  -  3`;
      };
      const noticeName = () => {
        return daysOfAbcence <= 3
          ? "/"
          : daysOfAbcence > 3 && daysOfAbcence <= 10
          ? "إشعار 1"
          : daysOfAbcence > 10 && daysOfAbcence <= 18
          ? "إشعار 2"
          : daysOfAbcence > 18 && daysOfAbcence <= 31
          ? "إعذار"
          : "شطب";
      };
      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject.last_name = student.last_name;
      studentObject.first_name = student.first_name;
      studentObject.medical_leave = student.medical_leave ? "ش طبية" : "";
      studentObject.class = `${student.class_level} ${student.class_name} ${student.class_number}`;
      studentObject.absence_date = new Intl.DateTimeFormat("fr", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateOfAbsence);
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
  const generateLunchAbsenceTableData = async () => {
    let result: any = [];
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
      let studentObject: any = {};
      i += 1;

      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject.absence_date = student.absence_date;
      studentObject.last_name = studentdataobject[0]?.last_name;
      studentObject.first_name = studentdataobject[0]?.first_name;
      studentObject.tableNumber = studentdataobject[0]?.lunch_table_number;
      studentObject.justification = studentdataobject[0]
        ?.lunch_absence_justification
        ? "تصريـــح شرفي"
        : // : studentdataobject[0]?.is_absent
          // ? "غائب صباحا"
          "";
      studentObject.class = `${studentdataobject[0]?.level} ${studentdataobject[0]?.class_name} ${studentdataobject[0]?.class_number}`;
      result.push(Object.assign({}, studentObject));
    });
    return result;
  };
  async function getData() {
    const absencesData: Student[] = await generateRapportTableData();
    const lunchabsenceData: Student[] = await generateLunchAbsenceTableData();
    absencesData.sort((a, b) => (a.class > b.class ? -1 : 1));
    lunchabsenceData.sort((a, b) => (a.class > b.class ? 1 : -1));
    setabsencesData(absencesData);
    setlunchabsenceData(lunchabsenceData);
    setLoading(false);
  }
  useEffect(() => {
    setLoading(true);
    getData();
  }, [rapportDate]);
  return loading ? (
    <LoadingSpinnerNew />
  ) : (
    <div className="flex flex-col min-h-screen w-full">
      <HeaderNavbar />
      <main className="grid grid-cols-1 md:grid-cols-4 p-4 md:gap-4">
        <div className="flex flex-col gap-2  mb-4">
          <AlertInfo
            className="md:hidden"
            title="كيفية التحميل بالنسبة للهاتف"
            message="اختر التاريخ المراد طباعة تقريره وستم تحميل الملف بشكل تلقائي للهاتف."
          />
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
                selected={new Date(rapportDate)}
                onSelect={(value) => {
                  setLoading(true);
                  setRapportDate(value.setHours(23));
                }}
                initialFocus
                locale={arDZ}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className={cn(
              table === "ghiyabat" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("ghiyabat");
            }}
          >
            غيابات التلاميذ
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "nisfdakhili" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("nisfdakhili");
            }}
          >
            غيابات المطعم
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "motamadrisin" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("motamadrisin");
            }}
          >
            القائمة الاسمية للتلاميذ
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "motamadrisinByclass" &&
                "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("motamadrisinByclass");
            }}
          >
            القائمة الاسمية لكل قسم
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "wafidin" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("wafidin");
            }}
          >
            التلاميذ الوافدين
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "moghadirin" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("moghadirin");
            }}
          >
            التلاميذ المغادرين
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "otla" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("otla");
            }}
          >
            العطل المرضية
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "maafiyin" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("maafiyin");
            }}
          >
            المعفيين من الرياضة
          </Button>
          <Button
            variant="outline"
            className={cn(
              table === "tasrih_charafi" && "bg-accent text-accent-foreground"
            )}
            onClick={() => {
              setTable("tasrih_charafi");
            }}
          >
            المعفيين من النصف داخلي
          </Button>
          <Button onClick={() => window.print()}>طبــــاعة</Button>
        </div>
        <div className="col-span-3 h-[50rem]">
          <div
            className="col-span-3 h-[50rem] overflow-scroll w-full"
            // id="section-to-print"
          >
            {table === "ghiyabat" && !loading && (
              <PDFPrintTables data={absencesData} date={rapportDate} />
            )}
            {table === "nisfdakhili" && !loading && (
              <LuncAbsencePrintTable
                data={lunchabsenceData}
                date={rapportDate}
              />
            )}
            {table === "otla" && !loading && (
              <MedicalLeavePrintTable
                data={otlaMaradiya.sort((a, b) =>
                  a.class_abbriviation > b.class_abbriviation
                    ? 1
                    : b.class_abbriviation > a.class_abbriviation
                    ? -1
                    : 0
                )}
                date={rapportDate}
                title="العطل المرضية للتلاميذ"
              />
            )}
            {table === "maafiyin" && !loading && (
              <MaafiyinPrintTable
                data={maafiyin.sort((a, b) =>
                  a.class_abbriviation > b.class_abbriviation
                    ? 1
                    : b.class_abbriviation > a.class_abbriviation
                    ? -1
                    : 0
                )}
                table="maafiyin"
                date={rapportDate}
                title="التلاميذ المعفيين من الرياضة"
              />
            )}
            {table === "wafidin" && !loading && (
              <MaafiyinPrintTable
                data={wafidin.sort((a, b) =>
                  a.class_abbriviation > b.class_abbriviation
                    ? 1
                    : b.class_abbriviation > a.class_abbriviation
                    ? -1
                    : 0
                )}
                table="wafidin"
                date={rapportDate}
                title="التلاميذ الوافدين"
              />
            )}
            {table === "moghadirin" && !loading && (
              <MaafiyinPrintTable
                data={moghadirin.sort((a, b) =>
                  a.createdAt > b.createdAt
                    ? 1
                    : b.createdAt > a.createdAt
                    ? -1
                    : 0
                )}
                table="moghadirin"
                date={rapportDate}
                title="التلاميذ المغادرين"
              />
            )}
            {table === "motamadrisin" && !loading && (
              <MaafiyinPrintTable
                data={motamadrisin.sort((a, b) =>
                  a.class_abbriviation > b.class_abbriviation
                    ? 1
                    : b.class_abbriviation > a.class_abbriviation
                    ? -1
                    : 0
                )}
                table="motamadrisin"
                date={rapportDate}
                title="الاسمية للتلاميذ"
              />
            )}
            {table === "motamadrisinByclass" && !loading && (
              <MaafiyinPrintTable
                data={motamadrisin.sort((a, b) =>
                  a.class_abbriviation > b.class_abbriviation
                    ? 1
                    : b.class_abbriviation > a.class_abbriviation
                    ? -1
                    : 0
                )}
                multi={true}
                table="motamadrisinByclass"
                date={rapportDate}
                title="الاسمية للتلاميذ"
              />
            )}
            {table === "tasrih_charafi" && !loading && (
              <MaafiyinPrintTable
                table="tasrih_charafi"
                data={tasrih_charafi.sort((a, b) =>
                  a.class_abbriviation > b.class_abbriviation
                    ? 1
                    : b.class_abbriviation > a.class_abbriviation
                    ? -1
                    : 0
                )}
                date={rapportDate}
                title="المعفيين من النصف داخلي بتصريح شرفي"
              />
            )}
            {/* <iframe
              width="100%"
              height="100%"
              src="/#/pdf-print-table"
            ></iframe> */}
            {/* {dailyRapport && !loading && (
              <PDFViewer style={{ height: "100%", width: "100%" }}>
                <TableView data={absencesData} date={rapportDate} />
              </PDFViewer>
            )}
            {nisfdakhiliRapport && !loading && (
              <PDFViewer style={{ height: "100%", width: "100%" }}>
                <TableLuncheAbsenceView
                  data={lunchabsenceData}
                  date={rapportDate}
                />
              </PDFViewer>
            )} */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PDFPrint;
