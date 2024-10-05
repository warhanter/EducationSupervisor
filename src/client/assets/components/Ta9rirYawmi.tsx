import React from "react";
import { PDFPrintTablesProps } from "./PDFPrintTables";
import { filter, groupBy, max, sortBy } from "lodash";
import { Student, StudentList } from "@/client/providers/StudentProvider";

type Ta9rirYawmiProps = PDFPrintTablesProps & {
  title: string;
  table?: string;
  multi?: boolean;
  allStudents?: StudentList;
};

export default function Ta9rirYawmi({
  data,
  date,
  title,
  allStudents,
  table,
  multi,
}: Ta9rirYawmiProps) {
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });

  console.log(new Date(new Date(date).setHours(0, 0, 0)));
  // const yesterdayCount = filter(allStudents, (student)=>  student.);
  const studentsGroupedByLevel = groupBy(allStudents, "level");
  const absencesGroupedByLevel = groupBy(data, "level");
  const studentsGroupedByClass1 = groupBy(
    sortBy(studentsGroupedByLevel["أولى"], "class_abbriviation"),
    "class_abbriviation"
  );
  const studentsGroupedByClass2 = groupBy(
    sortBy(studentsGroupedByLevel["ثانية"], "class_abbriviation"),
    "class_abbriviation"
  );
  const studentsGroupedByClass3 = groupBy(
    sortBy(studentsGroupedByLevel["ثالثة"], "class_abbriviation"),
    "class_abbriviation"
  );
  const absencesGroupedByClass = groupBy(data, "class_abbriviation");
  // const studentsGroupedByClass1 = groupBy(data, "full_className");

  const minNumberOfCells = max(
    Object.keys(studentsGroupedByLevel).map(
      (level) =>
        Object.keys(
          groupBy(studentsGroupedByLevel[level], "class_abbriviation")
        ).length
    )
  );
  console.log(minNumberOfCells);

  const TableCell = ({
    children,
    ...otherProps
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <td className="border border-collapse py-1 px-1" {...otherProps}>
        {children}
      </td>
    );
  };
  const TableHead = ({
    children,
    ...otherProps
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <th
        className="border-separate border py-1 px-1 bg-gray-400"
        {...otherProps}
      >
        {children}
      </th>
    );
  };

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
      <h1 className="text-xl font-bold my-5 text-center">{title}</h1>

      <div className="flex justify-between">
        <p className="font-bold text-lg">
          1. الدراســــــــة: <span className="text-sm">دروس لم تقدم</span>
        </p>
        <p className="font-bold">ليـــــــوم: {fdate}</p>
      </div>
      <table className="w-full print:text-[14px] font-medium ">
        <thead className="border-separate border bg-gray-400">
          <tr>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              الرقم
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              لقب واسم الأستاذ
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              المادة
            </th>
            <th className="border-separate border p-0 w-14 bg-gray-400 text-xs">
              عدد الساعات
            </th>
            <th className="border-separate border p-0 bg-gray-400">
              <table className="w-full p-0">
                <tr>
                  <th colSpan={4}>صباحا</th>
                </tr>
                <tr className="p-0">
                  <th className="border w-10">1</th>
                  <th className="border w-10">2</th>
                  <th className="border w-10">3</th>
                  <th className="border w-10">4</th>
                </tr>
              </table>
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400 w-8">
              /
            </th>
            <th className="border-separate border p-0 bg-gray-400">
              <table className="w-full p-0">
                <tr>
                  <th colSpan={4}>مساء</th>
                </tr>
                <tr className="p-0">
                  <th className="border w-10">5</th>
                  <th className="border w-10">6</th>
                  <th className="border w-10">7</th>
                  <th className="border w-10">8</th>
                </tr>
              </table>
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              سبب الغياب
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              ملاحظة
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-collapse text-center ">1</td>
            <td className="border border-collapse py-1 px-1">الاسم واللقب</td>
            <td className="border border-collapse py-1 px-1">المادة</td>
            <td className="border border-collapse py-1 px-1 text-center">5</td>
            <td className="border border-collapse p-0">
              <table className="w-full p-0">
                <tr className="text-center text-xs">
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    1 ع ت1
                  </td>
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    ج م ع 1
                  </td>
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    2اف
                  </td>
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    3ع4
                  </td>
                </tr>
              </table>
            </td>
            <td className="border border-collapse bg-slate-600"></td>
            <td className="border border-collapse p-0">
              <table className="w-full p-0">
                <tr className="text-center text-xs">
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    1 ع ت1
                  </td>
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    ج م ع 1
                  </td>
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    2اف
                  </td>
                  <td className="border-x border-collapse py-1 px-1 w-10">
                    3ع4
                  </td>
                </tr>
              </table>
            </td>
            <td className="border border-collapse p-0 text-center">
              <input type="text" className="w-24 m-0 text-center" />
            </td>
            <td className="border border-collapse p-0 text-center">
              <input type="text" className="w-20 m-0 text-center" />
            </td>
          </tr>
          <tr className="text-center p-0">
            <td colSpan={2} className="border border-collapse">
              الحجم الساعي اليومي:
            </td>
            <td className="border border-collapse">184</td>
            <td colSpan={2} className="border border-collapse">
              مجموع ساعات الغياب:
            </td>
            <td className="border border-collapse">10</td>
            <td colSpan={2} className="border border-collapse">
              نسبـة الغيابـات:
            </td>
            <td className="border border-collapse">10.05%</td>
          </tr>
        </tbody>
      </table>
      <p className="font-bold text-lg">2. التعــــــــداد:</p>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              1 ثانوي
            </th>
            {Object.keys(studentsGroupedByClass1).map((student) => {
              return (
                <th className="border-separate border py-1 px-1 bg-gray-400">
                  {student}
                </th>
              );
            })}
            {Object.keys(studentsGroupedByClass1).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass1).length,
              }).map(() => (
                <th className="border-separate border py-1 px-1 bg-gray-400"></th>
              ))}
            <th className="border-separate border py-1 px-1 bg-gray-400">
              المجموع
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              نسبة الغياب
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-collapse">التعداد</td>
            {Object.keys(studentsGroupedByClass1).map((student) => {
              return (
                <td className="border border-collapse">
                  {studentsGroupedByClass1[student].length}
                </td>
              );
            })}
            {Object.keys(studentsGroupedByClass1).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass1).length,
              }).map(() => <td className="border border-collapse"></td>)}
            <td className="border border-collapse">
              {studentsGroupedByLevel["أولى"].length}
            </td>
            <td rowSpan={2} className="border border-collapse">
              {(
                (absencesGroupedByLevel["أولى"].length * 100) /
                studentsGroupedByLevel["أولى"].length
              ).toFixed(2) + " %"}
            </td>
          </tr>
          <tr className="text-center">
            <td className="border border-collapse">الغياب</td>
            {Object.keys(studentsGroupedByClass1).map((student) => {
              const numberOfAbsences = absencesGroupedByClass[student]?.length
                ? absencesGroupedByClass[student]?.length
                : 0;
              return (
                <td className="border border-collapse">{numberOfAbsences}</td>
              );
            })}
            {Object.keys(studentsGroupedByClass1).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass1).length,
              }).map(() => <td className="border border-collapse"></td>)}
            <td className="border border-collapse">
              {absencesGroupedByLevel["أولى"].length}
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              2 ثانوي
            </th>
            {Object.keys(studentsGroupedByClass2).map((student) => {
              return (
                <th className="border-separate border py-1 px-1 bg-gray-400">
                  {student}
                </th>
              );
            })}
            {Object.keys(studentsGroupedByClass2).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass2).length,
              }).map(() => (
                <th className="border-separate border py-1 px-1 bg-gray-400"></th>
              ))}
            <th className="border-separate border py-1 px-1 bg-gray-400">
              المجموع
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              نسبة الغياب
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-collapse">التعداد</td>
            {Object.keys(studentsGroupedByClass2).map((student) => {
              return (
                <td className="border border-collapse">
                  {studentsGroupedByClass2[student].length}
                </td>
              );
            })}
            {Object.keys(studentsGroupedByClass2).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass2).length,
              }).map(() => <td className="border border-collapse"></td>)}
            <td className="border border-collapse">
              {studentsGroupedByLevel["ثانية"].length}
            </td>
            <td rowSpan={2} className="border border-collapse">
              {(
                (absencesGroupedByLevel["ثانية"].length * 100) /
                studentsGroupedByLevel["ثانية"].length
              ).toFixed(2) + " %"}
            </td>
          </tr>
          <tr className="text-center">
            <td className="border border-collapse">الغياب</td>
            {Object.keys(studentsGroupedByClass2).map((student) => {
              const numberOfAbsences = absencesGroupedByClass[student]?.length
                ? absencesGroupedByClass[student]?.length
                : 0;
              return (
                <td className="border border-collapse">{numberOfAbsences}</td>
              );
            })}
            {Object.keys(studentsGroupedByClass2).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass2).length,
              }).map(() => <td className="border border-collapse"></td>)}
            <td className="border border-collapse">
              {absencesGroupedByLevel["ثانية"].length}
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              3 ثانوي
            </th>
            {Object.keys(studentsGroupedByClass3).map((student) => {
              return (
                <th className="border-separate border py-1 px-1 bg-gray-400">
                  {student}
                </th>
              );
            })}
            {Object.keys(studentsGroupedByClass3).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass3).length,
              }).map(() => (
                <th className="border-separate border py-1 px-1 bg-gray-400"></th>
              ))}
            <th className="border-separate border py-1 px-1 bg-gray-400">
              المجموع
            </th>
            <th className="border-separate border py-1 px-1 bg-gray-400">
              نسبة الغياب
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-collapse">التعداد</td>
            {Object.keys(studentsGroupedByClass3).map((student) => {
              return (
                <td className="border border-collapse">
                  {studentsGroupedByClass3[student].length}
                </td>
              );
            })}
            {Object.keys(studentsGroupedByClass3).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass3).length,
              }).map(() => <td className="border border-collapse"></td>)}
            <td className="border border-collapse">
              {studentsGroupedByLevel["ثالثة"].length}
            </td>
            <td rowSpan={2} className="border border-collapse">
              {(
                (absencesGroupedByLevel["ثالثة"].length * 100) /
                studentsGroupedByLevel["ثالثة"].length
              ).toFixed(2) + " %"}
            </td>
          </tr>
          <tr className="text-center">
            <td className="border border-collapse">الغياب</td>
            {Object.keys(studentsGroupedByClass3).map((student) => {
              const numberOfAbsences = absencesGroupedByClass[student]?.length
                ? absencesGroupedByClass[student]?.length
                : 0;
              return (
                <td className="border border-collapse">{numberOfAbsences}</td>
              );
            })}
            {Object.keys(studentsGroupedByClass3).length < minNumberOfCells &&
              Array.from({
                length:
                  minNumberOfCells -
                  Object.keys(studentsGroupedByClass3).length,
              }).map(() => <td className="border border-collapse"></td>)}
            <td className="border border-collapse">
              {absencesGroupedByLevel["ثالثة"].length}
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th
              colSpan={1 + minNumberOfCells}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              المجموع الكلي للغياب / النسبة الكلية للغياب
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              {data?.length}
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              {((data?.length * 100) / allStudents?.length).toFixed(2) + " %"}
            </th>
          </tr>
        </thead>
      </table>
      <div className="flex justify-between">
        <table>
          <thead>
            <tr>
              <TableHead colSpan={2} rowSpan={2}>
                تعداد التلاميذ
              </TableHead>
              <TableHead colSpan={2}>داخلي</TableHead>
              <TableHead colSpan={2}>ن/داخلي</TableHead>
              <TableHead colSpan={2}>خارجي</TableHead>
              <TableHead colSpan={2}>المجموع</TableHead>
              <TableHead rowSpan={2}>المجموع العام</TableHead>
            </tr>
            <tr>
              <TableHead>ذ</TableHead>
              <TableHead>أ</TableHead>
              <TableHead>ذ</TableHead>
              <TableHead>أ</TableHead>
              <TableHead>ذ</TableHead>
              <TableHead>أ</TableHead>
              <TableHead>ذ</TableHead>
              <TableHead>أ</TableHead>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr className="text-center">
              <TableCell colSpan={2}>تعداد الأمس</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>935</TableCell>
            </tr>
            <tr>
              <TableCell rowSpan={2}>التغييرات</TableCell>
              <TableCell>دخول</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>935</TableCell>
            </tr>
            <tr>
              <TableCell>خروج</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>935</TableCell>
            </tr>
            <tr>
              <TableCell colSpan={2}>التعداد الكلي</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>15</TableCell>
              <TableCell>935</TableCell>
            </tr>
          </tbody>
        </table>
        <div>
          <p className="font-bold text-lg">3. غيابات مشرفي التربية:</p>
          <table className="text-center">
            <thead>
              <tr>
                <TableHead>الرقم</TableHead>
                <TableHead>اللقب والإسم</TableHead>
                <TableHead>السبب</TableHead>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>1</TableCell>
                <TableCell>سعيدي وليد</TableCell>
                <TableCell>عطلة مرضية</TableCell>
              </tr>
              <tr>
                <TableCell>2</TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
              </tr>
              <tr>
                <TableCell>3</TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
              </tr>
              <tr>
                <TableCell>4</TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
              </tr>
              <tr>
                <TableCell colSpan={2}>النسبة اليومية للغيابات</TableCell>
                <TableCell>12.60%</TableCell>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-around m-4">
        <p className="font-bold text-lg">1.4. الدخول الجديد:</p>
        <p className="font-bold text-lg">2.4. الخروج الجديد:</p>
      </div>
      <table className="text-center w-full">
        <thead>
          {/* <tr>
            <TableCell  colSpan={4}>1.4 التسجيلات الجديدة:</TableCell>
            <TableCell colSpan={4}>الخروج الجديد:</TableCell>
          </tr> */}
          <tr>
            <TableHead>الرقم</TableHead>
            <TableHead>اللقب والاسم</TableHead>
            <TableHead>القسم</TableHead>
            <TableHead>ملاحظة</TableHead>
            <TableHead>الرقم</TableHead>
            <TableHead>اللقب والاسم</TableHead>
            <TableHead>القسم</TableHead>
            <TableHead>ملاحظة</TableHead>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>1</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>1</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
          <tr>
            <TableCell>2</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>2</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
          <tr>
            <TableCell>3</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>3</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
          <tr>
            <TableCell>4</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>4</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
          <tr>
            <TableCell>5</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>5</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
          <tr>
            <TableCell>6</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>6</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
          <tr>
            <TableCell>7</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>7</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col  items-end m-8">
        <p className="text-lg font-bold"> مروانة في : {fdate}</p>
      </div>
      <div className="flex justify-between">
        <p className="font-bold text-xl ">مستشــــار التربيـــــة</p>
        <p className="font-bold text-xl ">الناظـــــــــــر</p>
        <p className="font-bold text-xl ">المديـــــــــــر</p>
      </div>
    </div>
  );
}
