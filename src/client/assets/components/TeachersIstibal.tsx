import React from "react";
import { PDFPrintTablesProps } from "./PDFPrintTables";
import { filter, groupBy } from "lodash";
import { Student, StudentList } from "@/client/providers/StudentProvider";

type MaafiyinPrintTableProps = PDFPrintTablesProps & {
  title: string;
  table?: string;
  multi?: boolean;
};

export default function TeachersIsti9bal({
  data,
  classrooms,
  date,
  title,
  table,
  multi,
}: MaafiyinPrintTableProps) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });

  const studentsGroupedByClass = groupBy(data, "full_class_name");
  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <div className="text-center">
        <h2>الجمهورية الجزائرية الديمقراطية الشعبية</h2>
        <h2>وزارة التربية الوطنية</h2>
      </div>
      <div className="flex m-0 justify-between">
        <div>
          <h3>مديرية التربية لولاية باتنة</h3>
          <h3>ثانوية : المختلطة مروانة</h3>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3>السنة الدراسية : 2025/2024</h3>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-2 text-center">{title}</h1>
      <table className="w-full print:text-[14px] font-medium ">
        <thead className="border-separate border border-zinc-500 bg-gray-200">
          <tr>
            <th className="border-separate border border-zinc-500 p-0 bg-gray-200">
              الرقم
            </th>
            <th className="border-separate border border-zinc-500 p-0 bg-gray-200 w-36">
              المادة
            </th>
            <th className="border-separate border border-zinc-500 p-0 bg-gray-200 w-36">
              اللقب والاسم
            </th>
            <th className="border-separate border border-zinc-500 p-0 bg-gray-200 w-20">
              اليوم
            </th>
            <th className="border-separate border border-zinc-500 p-0 bg-gray-200 w-16">
              التوقيت
            </th>
            <th className="border-separate border border-zinc-500 p-0 bg-gray-200">
              الأقسام المسندة
            </th>
          </tr>
        </thead>
        <tbody className="text-sm font-bold">
          {data &&
            data.map((student, index) => {
              return (
                <tr key={student.id.toString()}>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {index + 1}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {student.module_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {student.full_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {student.isti9bal_time &&
                      student.isti9bal_time?.toLocaleDateString("ar-DZ", {
                        weekday: "long",
                      })}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {student.isti9bal_time &&
                      `${
                        student.isti9bal_time?.getHours() < 13
                          ? student.isti9bal_time?.getHours() + ":00"
                          : student.isti9bal_time?.getHours() + ":30"
                      }`}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1.5">
                    {student.professor_classes.map((c) => (
                      <span className="bg-gray-100 m-1 border border-zinc-500 rounded-sm text-xs">
                        {" " +
                          filter(
                            classrooms,
                            (classroom) =>
                              classroom.id.toString() === c.toString()
                          )[0]?.class_prefix +
                          " "}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex flex-col  items-end m-2">
        <p className="text-sm font-bold">
          مروانة في : <input className="w-40" defaultValue={fdate}></input>
        </p>
      </div>
      <div className="flex justify-between text-sm font-bold">
        <p>مستشــــار التربيـــــة</p>
        <p>الناظـــــــــــر</p>
        <p>المديـــــــــــر</p>
      </div>
    </div>
  );
}
