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
  recordsColumns,
  sortedColumns,
  studentsColumns,
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
import { filter } from "lodash";
import HeaderNavbar from "./HeaderNavbar";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useLocation } from "react-router-dom";
import { FemaleImage, MaleImage } from "./images";
import { Badge } from "@/components/ui/badge";
import { MonthlyAbsences } from "./MonthlyAbsences";

export default function NewTable({ queryTbale }: { queryTbale: string }) {
  const location = useLocation();
  const columns =
    queryTbale === "Absence"
      ? absencesColumns
      : queryTbale === "sortedAbsences"
      ? sortedColumns
      : queryTbale === "studentAbsencesRecords"
      ? recordsColumns
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
  } = useStudents();
  React.useEffect(() => {
    setAbsencesData(generateRapportTableData());
  }, []);
  const [rapportDate, setRapportDate] = React.useState(new Date().setHours(23));
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
      default:
        return [];
    }
  };
  let absenceByDate = React.useCallback(() => {
    return filter(
      // absences,
      // (i) =>
      //   (new Date(i.date_of_return) > rapportDate || !i.date_of_return) &&
      //   new Date(i.date_of_absence) <= rapportDate
      motamadrisin,
      (i) => i.is_absent
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
      i += 1;
      const dateOfAbsence = new Date(student.absence_date);
      const daysOfAbcence = Math.round(
        (rapportDate - dateOfAbsence.setHours(0)) / (1000 * 60 * 60 * 24)
      );
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
        return daysOfAbcence < 4
          ? "/"
          : daysOfAbcence >= 4 && daysOfAbcence < 10
          ? "إشعار 1"
          : daysOfAbcence >= 11 && daysOfAbcence < 18
          ? "إشعار 2"
          : daysOfAbcence >= 18 && daysOfAbcence < 32
          ? "إعذار"
          : "شطب";
      };
      studentObject.number = index.toString();
      studentObject.id = i.toString();
      studentObject._id = student._id;
      studentObject.full_name = student.full_name;
      studentObject.level = student.level;
      studentObject.class_name = student.class_name;
      studentObject.class_number = student.class_number;
      studentObject.student_status = student.student_status;
      studentObject.full_className =
        student.level + " " + student.class_name + " " + student.class_number;
      studentObject.gender = student.gender;
      studentObject.student_DOB = student.student_DOB;
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
  const labels = table.getColumn("full_className")?.getFacetedUniqueValues();
  let vals: { label: string; value: string }[] = [];
  labels?.forEach((_, b) => vals.push({ label: b, value: b }));
  vals.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
  const isFiltered2 = table.getColumn("full_className")?.getIsFiltered();
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
              <div className="w-1/3 relative">
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
              <div className="flex content-center justify-center">
                {table.getColumn("full_className") && (
                  <DataTableFacetedFilter
                    column={table.getColumn("full_className")}
                    title="القسم"
                    options={vals}
                  />
                )}
                {isFiltered2 && (
                  <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="mx-2 lg:mx-3"
                  >
                    حذف
                    <Cross2Icon className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <div className="inline-flex gap-x-2">
                <a
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
                </a>
                {queryTbale === "Absence" && (
                  <MonthlyAbsences data={absences} />
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
              {filter(students, (a) => a._id === data[0].student_id)[0]
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
                  {data[0].full_className}
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
