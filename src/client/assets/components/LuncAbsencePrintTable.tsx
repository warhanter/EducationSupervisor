import React from "react";

export default function LuncAbsencePrintTable({ data, date }) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <div className="flex justify-between">
        <p className="text-lg font-bold mb-4">غيابات المطعم ليوم: {fdate}</p>
        <p className="text-lg font-bold mb-4">عدد الغيابات : {data?.length}</p>
      </div>
      <table className="w-full  print:text-[13px] font-medium ">
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
              رقـم الطاولة
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              المبرر
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((student, index) => {
              return (
                <tr key={student.id}>
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
                    {student.class}
                  </td>
                  <td className="border border-collapse py-1 px-1">
                    {student.tableNumber}
                  </td>
                  <td className="border border-collapse py-1 px-1">
                    {student.justification}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <p className="font-bold text-xl flex justify-end m-8">
        مستشــــار التربيـــــة
      </p>
    </div>
  );
}
