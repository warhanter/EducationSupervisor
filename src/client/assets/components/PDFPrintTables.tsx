import React from "react";
import { reverseString } from "../contexts/AppFunctions";
import { Student } from "@/client/providers/StudentProvider";
import { sortBy } from "lodash";

export type PDFPrintTablesProps = {
  data: Student[] | undefined;
  classrooms: Student[] | undefined;
  date: number;
};
export default function PDFPrintTables({ data, date }: PDFPrintTablesProps) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  const absencesData = sortBy(data, (student) => student.class_abbreviation);
  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <div className="flex justify-between">
        <p className="text-base font-bold mb-4">
          التلاميذ الغائبين الى غاية نهاية يوم: {fdate}
        </p>
        <p className="text-base font-bold mb-4">
          عدد الغيابات : {data?.length}
        </p>
      </div>
      <table className="w-full   print:text-[13px] font-medium ">
        <thead className="border-separate border border-zinc-500 bg-gray-200">
          <tr>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              الرقم
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              اللقب
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              الاسم
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              القسم
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              غائب منذ
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              سا/غ
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              الأيام
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              الإجراء
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              المبرر
            </th>
          </tr>
        </thead>
        <tbody>
          {absencesData &&
            absencesData.map((student, index) => {
              return (
                <tr key={student.id}>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {index + 1}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.last_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.first_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.class}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {reverseString(student.absence_date, "/")}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.missed_hours}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.absence_days}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.noticeName}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.medical_leave}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* <p className="font-bold text-xl flex justify-end m-8">
        مستشــــار التربيـــــة
      </p> */}
      <table className="w-full   print:text-[13px] font-medium mt-8">
        <thead>
          <tr>
            <th className="border border-collapse border-zinc-500 py-1 px-1">
              ملاحظات مستشار التربية:{" "}
              <span className="text-xs">
                (النظافة،الصيانة،الإتلافات،الحوادث،النشاط الثقافي و الرياضي،دروس
                الدعم،الزيارات)
              </span>
            </th>
            <th className="border border-collapse border-zinc-500 py-1 px-1">
              الختم و الإمضاء
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td className="border border-collapse border-zinc-500 ">
              <textarea
                rows={5}
                className="resize-none w-full m-0 py-0 px-5"
              ></textarea>
            </td>
            <td className="border border-collapse border-zinc-500 px-1"></td>
          </tr>
        </tbody>
      </table>
      <table className="w-full   print:text-[13px] font-medium mt-2">
        <thead>
          <tr>
            <th className="border border-collapse border-zinc-500 py-1 px-60">
              اقتراحــات النـاظـــــــــر:
            </th>
            <th className="border border-collapse border-zinc-500 py-1 px-1">
              الختم و الإمضاء
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td className="border border-collapse border-zinc-500 ">
              <textarea
                rows={3}
                className="resize-none w-full m-0 py-0 px-5"
              ></textarea>
            </td>
            <td className="border border-collapse border-zinc-500 px-1"></td>
          </tr>
        </tbody>
      </table>
      <table className="w-full   print:text-[13px] font-medium mt-2">
        <thead>
          <tr>
            <th className="border border-collapse border-zinc-500 py-1 px-56">
              توصيات مدير المؤسسة:
            </th>
            <th className="border border-collapse border-zinc-500 py-1 px-1">
              الختم و الإمضاء
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td className="border border-collapse border-zinc-500 ">
              <textarea
                rows={3}
                className="resize-none w-full m-0 py-0 px-5"
              ></textarea>
            </td>
            <td className="border border-collapse border-zinc-500 px-1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
