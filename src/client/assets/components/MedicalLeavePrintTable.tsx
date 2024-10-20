import React from "react";

export default function MedicalLeavePrintTable({ data, date, title }) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
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
          <h3>السنة الدراسية : 2025/2024</h3>
        </div>
      </div>
      <h1 className="text-xl font-bold my-5 text-center">
        قائمـــــــــة: {title}
      </h1>
      <table className="w-full  print:text-[13px] font-medium ">
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
              تاريخ البداية
            </th>
            <th className="border-separate border border-zinc-500 py-1 px-1 bg-gray-200">
              تاريخ العودة
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((student, index) => {
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
                    {student.full_className}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.medical_leave_startDate.toLocaleDateString(
                      "en-ZA"
                    )}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-1 px-1">
                    {student.medical_leave_endDate.toLocaleDateString("en-ZA")}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex flex-col  items-end m-2">
        <p className="text-sm font-bold"> مروانة في : {fdate}</p>
        <p className="font-bold text-sm ">مستشــــار التربيـــــة</p>
      </div>
    </div>
  );
}
