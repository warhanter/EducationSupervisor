import { title } from "process";
import React from "react";

export default function MaafiyinPrintTable({ data, date, title }) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  // console.log(data);
  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
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
          <h3>السنة الدراسية : 2024/2023</h3>
        </div>
      </div>
      <h1 className="text-xl font-bold my-5 text-center">
        قائمـــــــــة: {title}
      </h1>
      <table className="w-full print:text-[14px] font-medium ">
        <thead className="border-separate border bg-gray-400">
          <tr>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              الرقم
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              اللقب
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              الاسم
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              القسم
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              تاريخ الازدياد
            </th>
            {/* <th className="border-separate border py-1 px-1 bg-gray-400">
              تاريخ العودة
            </th> */}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((student, index) => {
              return (
                <tr key={student.student_id}>
                  <td className="border border-collapse py-1 px-1">
                    {index + 1}
                  </td>
                  <td className="border border-collapse py-1 px-1">
                    {student.last_name}
                  </td>
                  <td className="border border-collapse py-1 px-1">
                    {student.first_name}
                  </td>
                  <td className="border border-collapse py-1 px-1">
                    {student.full_className}
                  </td>
                  <td className="border border-collapse py-1 px-1">
                    {student.student_DOB?.toLocaleDateString("en-ZA")}
                  </td>
                  {/* <td className="border border-collapse py-1 px-1">
                    {student.medical_leave_endDate.toLocaleDateString("en-ZA")}
                  </td> */}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex flex-col  items-end m-8">
        <p className="text-lg font-bold"> مروانة في : {fdate}</p>
        <p className="font-bold text-xl ">مستشــــار التربيـــــة</p>
      </div>
    </div>
  );
}
