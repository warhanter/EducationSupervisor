import React from "react";
import { PDFPrintTablesProps } from "./PDFPrintTables";
import { groupBy } from "lodash";

type TableType = "moghadirin" | "wafidin" | "marda" | "mandoubin" | "yatama";

type MaafiyinPrintTableProps = PDFPrintTablesProps & {
  title: string;
  table?: TableType;
  date: number;
};

const calcLength = (
  students: Record<string, any>[],
  student_status: string,
  mamnouh?: boolean
) => {
  if (mamnouh !== undefined) {
    const len = students?.filter(
      (s: any) =>
        s.student_status === student_status && s.is_mamnouh === mamnouh
    ).length;
    return len;
  }
  const len = students?.filter(
    (s: any) => s.student_status === student_status
  ).length;
  return len;
};

const calcStats = (students: any[]) => {
  const males = students?.filter((s) => s.gender === "ذكر");
  const females = students?.filter((s) => s.gender === "أنثى");
  const stats: Record<string, number> = {};

  stats.dakhiliMales = calcLength(males, "داخلي");
  stats.dakhiliFemales = calcLength(females, "داخلي");

  stats.nisfDakhiliMales = calcLength(males, "نصف داخلي");
  stats.nisfDakhiliFemales = calcLength(females, "نصف داخلي");

  stats.mamnouhinMales = calcLength(males, "نصف داخلي", true);
  stats.mamnouhinFemales = calcLength(females, "نصف داخلي", true);

  stats.mosadidinMales = calcLength(males, "نصف داخلي", false);
  stats.mosadidinFemales = calcLength(females, "نصف داخلي", false);

  stats.kharijiMales = calcLength(males, "خارجي");
  stats.kharijiFemales = calcLength(females, "خارجي");
  return stats;
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

export const TableRowData = ({
  text,
  colSpan = 1,
  rowSpan = 1,
  type = "data",
}) => {
  if (type === "head") {
    return (
      <th
        colSpan={colSpan}
        rowSpan={rowSpan}
        className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200"
      >
        {text}
      </th>
    );
  }
  return (
    <td
      colSpan={colSpan}
      rowSpan={rowSpan}
      className="text-center border-separate border border-zinc-500 py-1 px-1"
    >
      {text}
    </td>
  );
};

// Table header component
const StatsTableHeader = ({ dakhili }: { dakhili: number }) => {
  return (
    <thead className="text-center border-separate border border-zinc-500 bg-gray-200">
      <tr>
        <TableRowData type="head" rowSpan={2} text="القسم" />
        {/* {dakhili && (
          <TableRowData type="head"
            colSpan={3}
            text="داخلي"
          />
        )} */}
        <TableRowData type="head" colSpan={3} text="نصف داخلي" />
        <TableRowData type="head" colSpan={3} text="ممنوحين" />
        <TableRowData type="head" colSpan={3} text="مسددين" />
        <TableRowData type="head" colSpan={3} text="خارجي" />
        <TableRowData type="head" colSpan={3} text="الكل" />
      </tr>
      <tr>
        {/* {dakhili && (
          <>
            <TableRowData type="head" text="ذ"
              
            />
            <TableRowData type="head" text=""
              
            />
            <TableRowData type="head" text="م"
              
            />
          </>
        )} */}
        <TableRowData type="head" text="ذ" />
        <TableRowData type="head" text="إ" />
        <TableRowData type="head" text="م" />
        <TableRowData type="head" text="ذ" />
        <TableRowData type="head" text="إ" />
        <TableRowData type="head" text="م" />
        <TableRowData type="head" text="ذ" />
        <TableRowData type="head" text="إ" />
        <TableRowData type="head" text="م" />
        <TableRowData type="head" text="ذ" />
        <TableRowData type="head" text="إ" />
        <TableRowData type="head" text="م" />
        <TableRowData type="head" text="ذ" />
        <TableRowData type="head" text="إ" />
        <TableRowData type="head" text="م" />
      </tr>
    </thead>
  );
};

// Table header component
const StatsTableFooter = ({
  students,
  dakhili,
}: {
  students: Record<string, any>[];
  dakhili: number;
}) => {
  const stats = calcStats(students);

  return (
    <tfoot className="text-center border-separate border border-zinc-500 bg-gray-200">
      <tr key={"الجمــــــــوع"}>
        <td className="border border-collapse border-zinc-500 py-1 px-1">
          {"الجمــــــــوع"}
        </td>
        {dakhili >= 1 && (
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
        )}
        {/* //nisfDakhili */}
        <TableRowData type="head" text={stats.nisfDakhiliMales} />
        <TableRowData type="head" text={stats.nisfDakhiliFemales} />
        <TableRowData
          type="head"
          text={stats.nisfDakhiliMales + stats.nisfDakhiliFemales}
        />
        {/* //mamnouhin */}
        <TableRowData type="head" text={stats.mamnouhinMales} />
        <TableRowData type="head" text={stats.mamnouhinFemales} />
        <TableRowData
          type="head"
          text={stats.mamnouhinMales + stats.mamnouhinFemales}
        />
        {/* //mosadidin */}
        <TableRowData type="head" text={stats.mosadidinMales} />
        <TableRowData type="head" text={stats.mosadidinFemales} />
        <TableRowData
          type="head"
          text={stats.mosadidinMales + stats.mosadidinFemales}
        />
        {/* //khariji */}
        <TableRowData type="head" text={stats.kharijiMales} />
        <TableRowData type="head" text={stats.kharijiFemales} />
        <TableRowData
          type="head"
          text={stats.kharijiMales + stats.kharijiFemales}
        />
        {/* // total */}
        <TableRowData
          type="head"
          text={
            stats.dakhiliMales + stats.nisfDakhiliMales + stats.kharijiMales
          }
        />
        <TableRowData
          type="head"
          text={
            stats.dakhiliFemales +
            stats.nisfDakhiliFemales +
            stats.kharijiFemales
          }
        />
        <TableRowData
          type="head"
          text={
            stats.dakhiliMales +
            stats.nisfDakhiliMales +
            stats.kharijiMales +
            stats.dakhiliFemales +
            stats.nisfDakhiliFemales +
            stats.kharijiFemales
          }
        />
      </tr>
    </tfoot>
  );
};

// Table row component
const StatsTableRow = ({
  key,
  stats,
  className,
  type,
}: {
  key: string;
  stats: any;
  className: string;
  type?: string;
}) => {
  const dakhili = stats.dakhiliMales + stats.dakhiliFemales;
  return (
    <tr key={key}>
      <TableRowData type={type} text={className} />
      {dakhili >= 1 && (
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
      )}
      {/* //nisfDakhili */}
      <TableRowData type={type} text={stats.nisfDakhiliMales} />
      <TableRowData type={type} text={stats.nisfDakhiliFemales} />
      <TableRowData
        type="head"
        text={stats.nisfDakhiliMales + stats.nisfDakhiliFemales}
      />
      {/* //mamnouhin */}
      <TableRowData type={type} text={stats.mamnouhinMales} />
      <TableRowData type={type} text={stats.mamnouhinFemales} />
      <TableRowData
        type="head"
        text={stats.mamnouhinMales + stats.mamnouhinFemales}
      />
      {/* //mosadidin */}
      <TableRowData type={type} text={stats.mosadidinMales} />
      <TableRowData type={type} text={stats.mosadidinFemales} />
      <TableRowData
        type="head"
        text={stats.mosadidinMales + stats.mosadidinFemales}
      />
      {/* //khariji */}
      <TableRowData type={type} text={stats.kharijiMales} />
      <TableRowData type={type} text={stats.kharijiFemales} />
      <TableRowData
        type="head"
        text={stats.kharijiMales + stats.kharijiFemales}
      />
      {/* // total */}
      <TableRowData
        type={type}
        text={stats.dakhiliMales + stats.nisfDakhiliMales + stats.kharijiMales}
      />
      <TableRowData
        type={type}
        text={
          stats.dakhiliFemales + stats.nisfDakhiliFemales + stats.kharijiFemales
        }
      />
      <TableRowData
        type="head"
        text={
          stats.dakhiliMales +
          stats.nisfDakhiliMales +
          stats.kharijiMales +
          stats.dakhiliFemales +
          stats.nisfDakhiliFemales +
          stats.kharijiFemales
        }
      />
    </tr>
  );
};

// const StatsTableFooter = ({students}) => {
//   const

// }

// Single class table component
const ClassTable = ({
  students,
  className,
}: {
  students: any[];
  className: string;
}) => {
  const studentsGroupedByClass = groupBy(students, "full_class_name");
  const stats = calcStats(students);

  // return <StatsTableRow key={className} stats={stats} className={className} />;
  return (
    <>
      {Object.entries(studentsGroupedByClass).map(([class_name, students]) => {
        const stats = calcStats(students);
        return (
          <StatsTableRow
            key={class_name}
            stats={stats}
            className={class_name}
          />
        );
      })}
      {Object.entries(studentsGroupedByClass).length > 1 && (
        <StatsTableRow
          key={className}
          stats={stats}
          className={className}
          type="head"
        />
      )}
    </>
  );
};

// Main component
export default function StatsTable({
  data,
  date,
  title,
}: MaafiyinPrintTableProps) {
  const studentsGroupedByClassName = groupBy(
    data,
    (s) => `${s.level}_${s.class_name}`
  );

  const dakhili = data?.filter((s) => s.student_status === "داخلي").length;

  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <DocumentHeader />
      <h1 className="text-xl font-bold my-5 text-center">{title}</h1>
      <table className="w-full print:text-[14px] font-medium">
        <StatsTableHeader dakhili={dakhili ?? 0} />
        <tbody>
          {Object.entries(studentsGroupedByClassName).map(
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
        <StatsTableFooter students={data} dakhili={dakhili} />
      </table>
      <DocumentFooter date={date} />
    </div>
  );
}
