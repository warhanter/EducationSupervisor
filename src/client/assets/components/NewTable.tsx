import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Student,
  absencesColumns,
  nisfdakhiliColumns,
  recordsColumns,
  sortedColumns,
  studentsColumns,
  markAbsenceColumns,
} from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudents } from "@/client/providers/StudentProvider";
import { filter, sortBy } from "lodash";
import HeaderNavbar from "./HeaderNavbar";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Navigate, useLocation } from "react-router-dom";
import { FemaleImage, MaleImage } from "./images";
import { Badge } from "@/components/ui/badge";
import { MonthlyAbsences } from "./MonthlyAbsences";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { arDZ } from "date-fns/locale/ar-DZ";
import { format } from "date-fns";
import MarkAbsences from "./mark-absences";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewTable({ queryTbale }: { queryTbale: string }) {
  const location = useLocation();
  const columns =
    queryTbale === "Absence"
      ? absencesColumns
      : queryTbale === "sortedAbsences"
      ? sortedColumns
      : queryTbale === "studentAbsencesRecords"
      ? recordsColumns
      : queryTbale === "nisfdakhili"
      ? nisfdakhiliColumns
      : queryTbale === "markAbsences"
      ? markAbsenceColumns
      : studentsColumns;
  const [absencesData, setAbsencesData] = React.useState<Record<string, any>>(
    []
  );
  const {
    students,
    machtobin,
    maafiyin,
    moghadirin,
    absences,
    lunchAbsences,
    otlaMaradiya,
    motamadrisin,
    nisfDakhili,
    wafidin,
    mo3idin,
    mamnouhin,
    mosadidin,
    markAbsenceData,
  } = useStudents();
  const [rapportDate, setRapportDate] = React.useState(new Date().setHours(23));
  React.useEffect(() => {
    setAbsencesData(generateRapportTableData());
  }, [rapportDate]);
  // console.log(students);
  // const mosadidin = nisfDakhili?.filter(
  //   (student) => student.student_status === "نصف داخلي" && student.lunch_paid
  // ).length;
  const ghayrMosadidin = nisfDakhili?.filter(
    (student) =>
      student.student_status === "نصف داخلي" &&
      !student.lunch_paid &&
      !student.is_mamnouh
  ).length;
  // const mamnouhin = motamadrisin.filter(s => s.i3adda);
  // const mosadidin = motamadrisin.filter(s => s.i3adda);
  const studentsTablesData: any = () => {
    switch (queryTbale) {
      case "all":
        return { title: "كل التلاميذ", data: students };
      case "motamadrisin":
        return { title: "المتمدرسون", data: motamadrisin };
      case "nisfdakhili":
        return { title: "نصف داخلي", data: nisfDakhili };
      case "wafidin":
        return { title: "التلاميذ الوافدون", data: wafidin };
      case "moghadirin":
        return { title: "التلاميذ المغادرين", data: moghadirin };
      case "machtobin":
        return { title: "المشطوبين", data: machtobin };
      case "maafiyin":
        return { title: "المعفيين من الرياضة", data: maafiyin };
      case "mo3idin":
        return { title: "المعيدين", data: mo3idin };
      case "mosadidin":
        return { title: "المسددين", data: mosadidin };
      case "mamnouhin":
        return { title: "الممنوحين", data: mamnouhin };
      case "lunchAbsences":
        return { title: "غيابات المطعم", data: lunchAbsences };
      case "otlaMaradiya":
        return { title: "العطل المرضية للتلاميذ", data: otlaMaradiya };
      case "sortedAbsences":
        return { title: "التلاميذ الاكثر غيابا", data: [] };
      case "studentAbsencesRecords":
        return {
          title: "سجل الغيابات للتلميذ",
          data: [],
        };
      case "Absence":
        return {
          title: "الغيابات اليومية للتلاميذ",
          data: absencesData,
        };
      case "markAbsences":
        return {
          title: "تسجيل الغيابات اليومية للتلاميذ",
          data: markAbsenceData,
        };
      default:
        return [];
    }
  };
  let absenceByDate = React.useCallback(() => {
    return filter(
      absences,
      (i) =>
        (new Date(i.date_of_return).getTime() > rapportDate ||
          !i.date_of_return) &&
        new Date(i.date_of_absence).getTime() <= rapportDate
    );
  }, [rapportDate, absences]);
  const generateRapportTableData = () => {
    let result: any = [];
    let i = 0;

    absenceByDate()?.map((student, index) => {
      let studentObject: any = {};
      if (student.is_absent === false) {
        return;
      }
      const studentFROMDB = motamadrisin.filter(
        (res) => res.id === student.student_id
      )[0];
      i += 1;
      const dateOfAbsence = new Date(student.date_of_absence);
      const daysOfAbcence = Math.round(
        (rapportDate - dateOfAbsence.setHours(0)) / (1000 * 60 * 60 * 24)
      );
      const medicalLeave =
        studentFROMDB?.medical_leave === true &&
        rapportDate < new Date(studentFROMDB?.medical_leave_endDate).setHours(23);
      const missedHours = () => {
        const start = parseInt(
          new Intl.DateTimeFormat("fr", { hour: "numeric", minute: "numeric" })
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
        return medicalLeave
          ? "عطلة مرضية"
          : daysOfAbcence < 4
          ? "/"
          : daysOfAbcence >= 4 && daysOfAbcence < 11
          ? "إشعار 1"
          : daysOfAbcence >= 11 && daysOfAbcence < 19
          ? "إشعار 2"
          : daysOfAbcence >= 19 && daysOfAbcence < 32
          ? "إعذار"
          : "شطب";
      };
      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject.id = student.student_id;
      studentObject.full_name = student.students.full_name;
      studentObject.level = student.class_level;
      studentObject.class_name = student.class_name;
      studentObject.class_number = student.class_number;
      studentObject.student_status = student.student_status;
      // studentObject.full_class_name =
      //   student.level + " " + student.class_name + " " + student.class_number;
      studentObject.full_class_name = student.students.full_class_name;
      studentObject.gender = students?.filter(
        (a) => a.id === student.student_id
      )[0].gender;
      studentObject.student_dob = students?.filter(
        (a) => a.id === student.student_id
      )[0].student_dob;
      studentObject.absence_date = new Intl.DateTimeFormat("en-ZA").format(
        dateOfAbsence
      );
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
  let data: Student[] = studentsTablesData()?.data;
  let tableTitle: string = studentsTablesData()?.title;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isTableModalOpen, setIsTableModalOpen] = React.useState(false);
  const [customTitle, setCustomTitle] = React.useState("");
  const [customLabel, setCustomLabel] = React.useState("");

  if (typeof location.state === "object" && location.state !== null) {
    data = location?.state;
  }

  function calcTotalMissedHours() {
    let total = 0;
    data?.map(
      (a) =>
        (total +=
          (a.missed_hours ? a.missed_hours : 0) +
          (a.justified_missed_hours ? a.justified_missed_hours : 0))
    );
    return total;
  }
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // row selection
    enableRowSelection: true,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (isTableModalOpen) {
      setCustomTitle(tableTitle);
      const classFilters =
        (table.getColumn("full_class_name")?.getFilterValue() as string[]) ||
        [];
      const categoryFilters =
        (table.getColumn("is_mamnouh")?.getFilterValue() as string[]) || [];
      const combinedFilters = [...classFilters, ...categoryFilters];
      setCustomLabel(combinedFilters.join(" - "));
      setSorting([{ id: "full_class_name", desc: false }]);
    }
  }, [isTableModalOpen, tableTitle, table]);

  const labels = table.getColumn("full_class_name")?.getFacetedUniqueValues();
  const labels2 = new Map([
    ["نصف داخلي", nisfDakhili.length],
    ["الممنوحين", mamnouhin.length],
    ["المسددين", mosadidin.length],
    ["الغير مسددين", ghayrMosadidin],
  ]);

  let vals: { label: string; value: string }[] = [];
  let vals2: { label: string; value: string }[] = [];
  labels?.forEach((_, b) => vals.push({ label: b, value: b }));
  labels2?.forEach((a, b) => vals2.push({ label: b + ": " + a, value: b }));
  vals.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
  const isFiltered1 = table.getColumn("full_class_name")?.getIsFiltered();
  const isFiltered2 = table.getColumn("is_mamnouh")?.getIsFiltered();
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderNavbar />
      <div className="bg-white border border-gray-200 m-8 max-sm:mx-0 max-sm:my-4 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
        {queryTbale !== "studentAbsencesRecords" ? (
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {tableTitle}
              </h2>
            </div>
            <div className="flex flex-1 flex-row-reverse justify-between w-full">
              <div className="w-1/3 relative flex gap-2">
                <Dialog
                  open={isTableModalOpen}
                  onOpenChange={setIsTableModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      عرض الجدول
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    id="student-table-print"
                    className="max-w-[90vw] max-h-[90vh] overflow-auto print:max-w-full print:max-h-full print:m-0 print:p-4 print:border-0 print:shadow-none print:fixed print:inset-0 print:z-[9999] print:bg-white"
                  >
                    <style>{`
                      @media print {
                        @page {
                          size: A4 portrait;
                          margin: 10mm 10mm 15mm 10mm;
                          @bottom-center {
                            content: "صفحة " counter(page) " من " counter(pages);
                            font-size: 10px;
                            font-family: "Tajawal", sans-serif;
                            direction: rtl;
                            text-align: center;
                          }
                        }
                        * {
                          -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important;
                        }
                        body {
                          margin: 0 !important;
                          padding: 0 !important;
                          visibility: hidden !important;
                        }
                        body > *:not([data-radix-portal]) {
                          display: none !important;
                          visibility: hidden !important;
                        }
                        body > [data-radix-portal] {
                          position: fixed !important;
                          left: 0 !important;
                          top: 0 !important;
                          right: 0 !important;
                          bottom: 0 !important;
                          width: 100% !important;
                          height: 100% !important;
                          z-index: 9999 !important;
                          margin: 0 !important;
                          padding: 0 !important;
                          visibility: visible !important;
                          display: block !important;
                        }
                        [data-radix-dialog-overlay] {
                          display: none !important;
                        }
                        #student-table-print {
                          position: relative !important;
                          left: auto !important;
                          top: auto !important;
                          right: auto !important;
                          bottom: auto !important;
                          margin: 0 !important;
                          padding: 10mm !important;
                          max-width: 100% !important;
                          max-height: none !important;
                          width: 100% !important;
                          height: auto !important;
                          min-height: auto !important;
                          transform: none !important;
                          translate: none !important;
                          background: white !important;
                          overflow: visible !important;
                          display: block !important;
                          visibility: visible !important;
                        }
                        #student-table-print button[data-radix-dialog-close] {
                          display: none !important;
                        }
                        #student-table-print > div:first-child {
                          margin-bottom: 10mm !important;
                          text-align: center !important;
                        }
                        #student-table-print > div:last-child {
                          overflow: visible !important;
                          height: auto !important;
                          max-height: none !important;
                          width: 100% !important;
                          display: block !important;
                        }
                        #student-table-print table {
                          width: 100% !important;
                          table-layout: fixed !important;
                          font-size: 9px !important;
                          page-break-inside: auto !important;
                          border-collapse: collapse !important;
                          direction: rtl !important;
                          margin: 0 !important;
                        }
                        #student-table-print thead {
                          display: table-header-group !important;
                        }
                        #student-table-print thead tr {
                          background-color: #f3f4f6 !important;
                          -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important;
                        }
                        #student-table-print tbody {
                          display: table-row-group !important;
                        }
                        #student-table-print tbody tr {
                          page-break-inside: avoid !important;
                          page-break-after: auto !important;
                          break-inside: avoid !important;
                        }
                        #student-table-print th {
                          padding: 8px 6px !important;
                          font-size: 9px !important;
                          font-weight: bold !important;
                          border: 1px solid #000 !important;
                          text-align: right !important;
                          background-color: #f3f4f6 !important;
                          -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important;
                        }
                        #student-table-print td {
                          padding: 6px 4px !important;
                          font-size: 9px !important;
                          border: 1px solid #000 !important;
                          text-align: right !important;
                          word-wrap: break-word !important;
                        }
                        #student-table-print th:nth-child(1),
                        #student-table-print td:nth-child(1) {
                          width: 5% !important;
                        }
                        #student-table-print th:nth-child(2),
                        #student-table-print td:nth-child(2) {
                          width: 18% !important;
                        }
                        #student-table-print th:nth-child(3),
                        #student-table-print td:nth-child(3) {
                          width: 18% !important;
                        }
                        #student-table-print th:nth-child(4),
                        #student-table-print td:nth-child(4) {
                          width: 25% !important;
                        }
                        #student-table-print th:nth-child(5),
                        #student-table-print td:nth-child(5) {
                          width: 18% !important;
                        }
                        #student-table-print th:nth-child(6),
                        #student-table-print td:nth-child(6) {
                          width: 16% !important;
                        }
                        #student-table-print {
                          counter-reset: page;
                        }
                      }
                    `}</style>

                    <DialogHeader className="print:mb-4 print:text-center">
                      <DialogTitle className="print:text-2xl print:font-bold">
                        {customTitle}
                      </DialogTitle>
                      <p className="hidden print:block text-lg font-medium text-gray-600">
                        {customLabel}
                      </p>
                      <div className="print:hidden flex justify-center gap-4 py-2">
                        <Input
                          placeholder="عنوان الجدول"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="max-w-md text-center font-bold"
                        />
                        <Input
                          placeholder="التسمية المختارة"
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          className="max-w-md text-center font-bold text-blue-600"
                        />
                      </div>
                    </DialogHeader>
                    <div className="overflow-auto print:overflow-visible print:w-full">
                      <table
                        className="print:border-2 print:border-gray-800 print:w-full"
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          direction: "rtl",
                          textAlign: "right",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "#f3f4f6",
                              borderBottom: "2px solid #e5e7eb",
                            }}
                            className="print:bg-gray-200"
                          >
                            <th
                              style={{
                                padding: "12px",
                                border: "1px solid #e5e7eb",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                              className="print:border-2 print:border-gray-800"
                            >
                              الرقم
                            </th>
                            <th
                              style={{
                                padding: "12px",
                                border: "1px solid #e5e7eb",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                              className="print:border-2 print:border-gray-800"
                            >
                              اللقب والإسم
                            </th>
                            <th
                              style={{
                                padding: "12px",
                                border: "1px solid #e5e7eb",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                              className="print:border-2 print:border-gray-800"
                            >
                              القسم
                            </th>
                            <th
                              style={{
                                padding: "12px",
                                border: "1px solid #e5e7eb",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                              className="print:border-2 print:border-gray-800"
                            >
                              الصفة
                            </th>
                            <th
                              style={{
                                padding: "12px",
                                border: "1px solid #e5e7eb",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                              className="print:border-2 print:border-gray-800"
                            >
                              تاريخ الازدياد
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {table
                            .getSortedRowModel()
                            .rows.map((row, index) => {
                              const student = row.original;
                              return (
                                <tr
                                  key={student.id || index}
                                  style={{
                                    borderBottom: "1px solid #e5e7eb",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #e5e7eb",
                                      textAlign: "right",
                                    }}
                                    className="print:border print:border-gray-600"
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #e5e7eb",
                                      textAlign: "right",
                                    }}
                                    className="print:border print:border-gray-600"
                                  >
                                    {student.full_name || "-"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #e5e7eb",
                                      textAlign: "right",
                                    }}
                                    className="print:border print:border-gray-600"
                                  >
                                    {student.full_class_name || "-"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #e5e7eb",
                                      textAlign: "right",
                                    }}
                                    className="print:border print:border-gray-600"
                                  >
                                    {student.student_status || "-"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #e5e7eb",
                                      textAlign: "right",
                                    }}
                                    className="print:border print:border-gray-600"
                                  >
                                    {student.student_dob
                                      ? (() => {
                                          try {
                                            const dob = new Date(
                                              student.student_dob
                                            );
                                            return isNaN(dob.getTime())
                                              ? "-"
                                              : format(dob, "yyyy-MM-dd", {
                                                  locale: arDZ,
                                                });
                                          } catch {
                                            return "-";
                                          }
                                        })()
                                      : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </DialogContent>
                </Dialog>
                <Input
                  type="search"
                  placeholder="بحث عن تلميذ"
                  value={
                    (table
                      .getColumn("full_name")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("full_name")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-full"
                />
              </div>
              <div className="flex content-center justify-center gap-4">
                {table.getColumn("full_class_name") && (
                  <DataTableFacetedFilter
                    column={table.getColumn("full_class_name")}
                    title="القسم"
                    options={vals}
                  />
                )}
                {(isFiltered1 || isFiltered2) && (
                  <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="mx-2 lg:mx-3"
                  >
                    حذف
                    <Cross2Icon className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {table.getColumn("is_mamnouh") && (
                  <DataTableFacetedFilter
                    column={table.getColumn("is_mamnouh")}
                    title="التعداد"
                    options={vals2}
                  />
                )}
              </div>
            </div>

            <div>
              <div className="inline-flex gap-x-2">
                {/* <a
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  // href="#"
                >
                  عرض الكل
                </a>

                <a
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  // href="#"
                >
                  <svg
                    className="flex-shrink-0 size-3"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2.63452 7.50001L13.6345 7.5M8.13452 13V2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  إضافة تلميذ
                </a> */}
                {queryTbale === "Absence" && (
                  <>
                    <MonthlyAbsences data={absences} students={students} />
                    <MarkAbsences />
                    <Popover>
                      <PopoverTrigger className="print:hidden" asChild>
                        <Button>
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
                            setRapportDate(value?.setHours(23));
                          }}
                          initialFocus
                          locale={arDZ}
                        />
                      </PopoverContent>
                    </Popover>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-center px-6 py-4 ">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {tableTitle}
            </h2>
            <div className="flex items-center gap-x-3">
              {filter(students, (a) => a.id === data[0].student_id)[0]
                .gender === "ذكر" ? (
                <MaleImage />
              ) : (
                <FemaleImage />
              )}
              <div className="grow">
                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {data[0].full_name}
                </span>
                <span className="block text-sm text-gray-500">
                  {data[0].full_class_name}
                </span>
              </div>
            </div>
            <div className="flex-1  text-center font-bold">
              إجمالي الساعات الضائعة:
              <Badge className="mx-2 px-4 text-base">
                {calcTotalMissedHours()}
              </Badge>
              ساعة
            </div>
          </div>
        )}
        <div className="border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="bg-gray-50  text-gray-900 p-0  my-0 text-right text-xs font-bold tracking-wide "
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="py-2  pr-4 whitespace-nowrap"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    لا توجد بيانات.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4">
          <div className="flex-1 flex gap-2 space-x-2">
            <Button
              className="left-button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              السابق
            </Button>
            <Button
              className="right-button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              التالي
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows?.length} من أصل{" "}
            {table.getFilteredRowModel().rows?.length} تلميذا تم تحديده.
          </div>
        </div>
      </div>
    </div>
  );
}
