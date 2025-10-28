import React from "react";
import { PDFPrintTablesProps } from "./PDFPrintTables";
import { groupBy } from "lodash";

type TableType = "moghadirin" | "wafidin" | "marda" | "mandoubin" | "yatama";

type MaafiyinPrintTableProps = PDFPrintTablesProps & {
  title: string;
  table?: TableType;
  date: number;
};

// Reusable header component
const DocumentHeader = () => (
  <>
    <div className="text-center">
      <h2>الجمهورية الجزائرية الديمقراطية الشعبية</h2>
      <h2>وزارة التربية الوطنية</h2>
    </div>
    <div className="flex mt-5 justify-between">
      <div>
        <h3>مديرية التربية لولاية باتنة</h3>
        <h3>ثانوية : المختلطة مروانة</h3>
      </div>
      <div className="flex flex-col items-center text-center">
        <h3>السنة الدراسية : 2026/2025</h3>
      </div>
    </div>
  </>
);

// Reusable footer component
const DocumentFooter = ({ date }: { date: string }) => {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });

  return (
    <div className="flex flex-col items-end m-2">
      <p className="text-sm font-bold">مروانة في : {fdate}</p>
      <p className="font-bold text-sm">مستشــــار التربيـــــة</p>
    </div>
  );
};

// Table header component
const StatsTableHeader = ({ dakhili }: { dakhili: number }) => {
  return (
    <thead className="text-center border-separate border border-zinc-500 bg-gray-200">
      <tr>
        <th
          rowSpan={2}
          className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
        >
          القسم
        </th>
        {/* {dakhili && (
          <th
            colSpan={3}
            className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200 "
          >
            داخلي
          </th>
        )} */}
        <th
          colSpan={3}
          className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
        >
          نصف داخلي
        </th>
        <th
          colSpan={3}
          className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
        >
          ممنوحين
        </th>
        <th
          colSpan={3}
          className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
        >
          مسددين
        </th>
        <th
          colSpan={3}
          className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
        >
          خارجي
        </th>
        <th
          colSpan={3}
          className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
        >
          الكل
        </th>
      </tr>
      <tr>
        {/* {dakhili && (
          <>
            <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              ذ
            </th>
            <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              إ
            </th>
            <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              م
            </th>
          </>
        )} */}
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          ذ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          إ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          م
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          ذ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          إ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          م
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          ذ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          إ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          م
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          ذ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          إ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          م
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          ذ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          إ
        </th>
        <th className="text-center border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
          م
        </th>
      </tr>
    </thead>
  );
};

// Table row component
const StatsTableRow = ({
  key,
  stats,
  className,
}: {
  key: string;
  stats: any;
  className: string;
  dakhili: number;
}) => {
  const dakhili = stats.dakhiliMales + stats.dakhiliFemales;
  return (
    <tr key={key}>
      <td className="border border-collapse border-zinc-500 py-1 px-1">
        {className}
      </td>
      {/* {dakhili && (
        <>
          <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
            {stats.dakhiliMales}
          </td>
          <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
            {stats.dakhiliFemales}
          </td>
          <td className="text-center border border-collapse border-zinc-500 py-1 px-1 bg-gray-200">
            {stats.dakhiliMales + stats.dakhiliFemales}
          </td>
        </>
      )} */}
      {/* //nisfDakhili */}
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.nisfDakhiliMales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.nisfDakhiliFemales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1 bg-gray-200">
        {stats.nisfDakhiliMales + stats.nisfDakhiliFemales}
      </td>
      {/* //mamnouhin */}
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.mamnouhinMales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.mamnouhinFemales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1 bg-gray-200">
        {stats.mamnouhinMales + stats.mamnouhinFemales}
      </td>
      {/* //mosadidin */}
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.mosadidinMales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.mosadidinFemales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1 bg-gray-200">
        {stats.mosadidinMales + stats.mosadidinFemales}
      </td>
      {/* //khariji */}
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.kharijiMales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.kharijiFemales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1 bg-gray-200">
        {stats.kharijiMales + stats.kharijiFemales}
      </td>
      {/* // total */}
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.dakhiliMales + stats.nisfDakhiliMales + stats.kharijiMales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1">
        {stats.dakhiliFemales + stats.nisfDakhiliFemales + stats.kharijiFemales}
      </td>
      <td className="text-center border border-collapse border-zinc-500 py-1 px-1 bg-gray-200">
        {stats.dakhiliMales +
          stats.nisfDakhiliMales +
          stats.kharijiMales +
          stats.dakhiliFemales +
          stats.nisfDakhiliFemales +
          stats.kharijiFemales}
      </td>
    </tr>
  );
};

// Single class table component
const ClassTable = ({
  students,
  className,
}: {
  students: any[];
  className: string;
}) => {
  const males = students?.filter((s) => s.gender === "ذكر");
  const females = students?.filter((s) => s.gender === "أنثى");

  const stats: Record<string, number> = {};

  stats.dakhiliMales = males?.filter(
    (s) => s.student_status === "داخلي"
  ).length;
  stats.dakhiliFemales = females?.filter(
    (s) => s.student_status === "داخلي"
  ).length;

  stats.nisfDakhiliMales = males?.filter(
    (s) => s.student_status === "نصف داخلي"
  ).length;
  stats.nisfDakhiliFemales = females?.filter(
    (s) => s.student_status === "نصف داخلي"
  ).length;

  stats.mamnouhinMales = males?.filter(
    (s) => s.student_status === "نصف داخلي" && s.is_mamnouh
  ).length;
  stats.mamnouhinFemales = females?.filter(
    (s) => s.student_status === "نصف داخلي" && s.is_mamnouh
  ).length;

  stats.mosadidinMales = males?.filter(
    (s) => s.student_status === "نصف داخلي" && !s.is_mamnouh
  ).length;
  stats.mosadidinFemales = females?.filter(
    (s) => s.student_status === "نصف داخلي" && !s.is_mamnouh
  ).length;

  stats.kharijiMales = males?.filter(
    (s) => s.student_status === "خارجي"
  ).length;
  stats.kharijiFemales = females?.filter(
    (s) => s.student_status === "خارجي"
  ).length;
  return <StatsTableRow key={className} stats={stats} className={className} />;
};

// Main component
export default function StatsTable({
  data,
  date,
  title,
}: MaafiyinPrintTableProps) {
  const studentsGroupedByClass = groupBy(data, "full_class_name");
  const dakhili = data?.filter((s) => s.student_status === "داخلي").length;

  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <DocumentHeader />
      <h1 className="text-xl font-bold my-5 text-center">{title}</h1>
      <table className="w-full print:text-[14px] font-medium">
        <StatsTableHeader dakhili={dakhili ?? 0} />
        <tbody>
          {Object.entries(studentsGroupedByClass).map(
            ([className, students]) => (
              <ClassTable
                key={className}
                students={students}
                className={className}
                date={date}
                dakhili={dakhili}
              />
            )
          )}
        </tbody>
      </table>
      <DocumentFooter date={date} />
    </div>
  );
}
