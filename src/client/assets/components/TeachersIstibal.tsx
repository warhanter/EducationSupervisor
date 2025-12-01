import React from "react";
import _ from "lodash";
import { Tables } from "@/supabase/database.types";
import { useStudents } from "@/client/providers/StudentProvider";

type MaafiyinPrintTableProps = {
  title: string;
  data: (Tables<"professors"> & { subjects: Tables<"subjects"> })[];
  classrooms: Tables<"classrooms">[];
  date: number;
};

export default function TeachersIsti9bal({
  data,
  date,
  title,
}: MaafiyinPrintTableProps) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });

  const { classroom_professors } = useStudents();

  const professorsWithClassrooms = _.groupBy(
    _.orderBy(classroom_professors, ["classrooms.class_prefix"], ["asc"]),
    "professor_id"
  );
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
          <h3>السنة الدراسية : 2026/2025</h3>
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
            _.orderBy(data, ["subjects.subject"]).map((teacher, index) => {
              return (
                <tr key={teacher.id.toString()}>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {index + 1}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {teacher.subjects?.subject}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {teacher.full_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {teacher.isti9bal_time &&
                      new Date(teacher.isti9bal_time).toLocaleDateString(
                        "ar-DZ",
                        {
                          weekday: "long",
                        }
                      )}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1">
                    {teacher.isti9bal_time &&
                      `${
                        new Date(teacher.isti9bal_time).getHours() < 13
                          ? new Date(teacher.isti9bal_time).getHours() + ":00"
                          : new Date(teacher.isti9bal_time).getHours() + ":30"
                      }`}
                  </td>
                  <td className="border border-collapse border-zinc-500 p-1.5">
                    {professorsWithClassrooms[teacher.id]?.map((c) => (
                      <span className="bg-gray-100 m-1 border border-zinc-500 rounded-sm text-xs">
                        {" " + c.classrooms.class_prefix + " "}
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
