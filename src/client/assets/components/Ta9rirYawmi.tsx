import React, { useState } from "react";
import { PDFPrintTablesProps } from "./PDFPrintTables";
import { filter, groupBy, max, sortBy } from "lodash";
import { Student, StudentList } from "@/client/providers/StudentProvider";
import { Button } from "@/components/ui/button";

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
  const [minTeachersCells, setMinTeachersCells] = useState(5);
  const [missedHoursByTeachers, setMissedHoursByTeachers] = useState("");
  const [totalhours, setTotalHours] = useState("");
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  const lastEducationDay = new Date("2025-06-30");
  const yesterdayDate = new Date(new Date(date).setHours(0, 0, 0));
  const todayDate = new Date(new Date(date).setHours(23, 0, 0));
  const yesterdayCount = filter(
    allStudents,
    (student) =>
      student.student_inscription_date < yesterdayDate &&
      !(
        student.switched_school == true &&
        yesterdayDate > student.student_leave_date
      )
  );
  const todayCount = filter(
    allStudents,
    (student) =>
      student.student_inscription_date < todayDate &&
      !(
        (student.switched_school == true || student.is_fired == true) &&
        student.student_leave_date < todayDate
      )
  );
  console.log(yesterdayCount.length);
  const studentsGroupedByLevel = groupBy(todayCount, "level");
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

  const newStudents = (student_status, gender) => {
    return filter(
      allStudents,
      (s) =>
        s.is_new === true &&
        new Date(s.student_inscription_date).setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0) &&
        s.student_status === student_status &&
        s.gender === gender
    ).length;
  };
  const allNewStudentsByGender = (gender) => {
    return filter(
      allStudents,
      (s) =>
        s.is_new === true &&
        new Date(s.student_inscription_date).setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0) &&
        s.gender === gender
    ).length;
  };
  const allNewStudents = () => {
    return filter(
      allStudents,
      (s) =>
        s.is_new === true &&
        new Date(s.student_inscription_date).setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0)
    );
  };
  const goneStudents = (student_status, gender) => {
    return filter(
      allStudents,
      (s) =>
        (s.switched_school || s.is_fired) &&
        s.createdAt.setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0) &&
        s.student_status === student_status &&
        s.gender === gender
    ).length;
  };
  const AllGoneStudentsByGender = (gender) => {
    return filter(
      allStudents,
      (s) =>
        (s.switched_school || s.is_fired) &&
        s.createdAt.setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0) &&
        s.gender === gender
    ).length;
  };
  const AllGoneStudents = () => {
    return filter(
      allStudents,
      (s) =>
        (s.switched_school || s.is_fired) &&
        s.createdAt.setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0)
    );
  };

  const minTransferCells = max([
    allNewStudents().length,
    AllGoneStudents().length,
    3,
  ]);
  // const minTeachersCells = max([5]);

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
      <h1 className="text-xl font-bold my-5 text-center">
        {title} <input type="text" className="w-10" />
      </h1>

      <div className="flex justify-between">
        <p className="font-bold text-lg">
          1. الدراســــــــة: <span className="text-sm">دروس لم تقدم</span>
        </p>
        <p className="font-bold">ليـــــــوم: {fdate}</p>
      </div>
      <table className="text-center w-full">
        <thead className="border-separate border bg-gray-400">
          <tr>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              الرقم
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              لقب واسم الأستاذ
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              المادة
            </th>
            <th
              rowSpan={2}
              className="border-separate border p-0 w-14 bg-gray-400 text-xs"
            >
              عدد الساعات
            </th>
            <th colSpan={4} className="border-separate border p-0 bg-gray-400">
              صباحا
            </th>

            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400 w-8"
            >
              /
            </th>
            <th colSpan={4} className="border-separate border p-0 bg-gray-400">
              مساء
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              سبب الغياب
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              ملاحظة
            </th>
          </tr>
          <tr className="p-0">
            <th className="border p-0">1</th>
            <th className="border p-0">2</th>
            <th className="border p-0">3</th>
            <th className="border p-0">4</th>
            <th className="border p-0">1</th>
            <th className="border p-0">2</th>
            <th className="border p-0">3</th>
            <th className="border p-0">4</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {Array.from({ length: minTeachersCells }).map((_, i) => (
            <tr>
              <td className="border border-collapse py-1 px-1">{i + 1}</td>
              <td className="border border-collapse py-1 px-1">
                <input type="text" className="w-32 m-0 text-center" />
              </td>
              <td className="border border-collapse py-1 px-1">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input
                  // type="number"
                  className="w-14 m-0 text-center"
                  // onChange={(e) =>
                  //   setMissedHoursByTeachers([
                  //     ...missedHoursByTeachers,
                  //     e.target.value,
                  //   ])
                  // }
                />
              </td>
              <td className="border border-collapse py-1 px-1">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border-separate border py-1 px-1 bg-gray-400 w-8"></td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border p-0 w-14">
                <input type="text" className="w-14 m-0 text-center" />
              </td>
              <td className="border border-collapse p-0">
                <input className="w-20 m-0 text-center" type="text" />
              </td>
              <td className="border border-collapse p-0">
                <input className="w-16 m-0 text-center" type="text"></input>
              </td>
            </tr>
          ))}
          <tr>
            <td className="border border-collapse p-0" colSpan={3}>
              مجموع الساعات الضائعة
            </td>
            <td className="border border-collapse p-0" colSpan={1}>
              <input
                name=""
                type="number"
                className="w-14 m-0 text-center"
                onChange={(e) => setMissedHoursByTeachers(e.target.value)}
              />
            </td>
            <td className="border border-collapse p-0" colSpan={5}>
              الحجم الساعي اليومي
            </td>
            <td className="border border-collapse p-0" colSpan={2}>
              <input
                name=""
                type="number"
                className="w-14 m-0 text-center"
                onChange={(e) => setTotalHours(e.target.value)}
              />
            </td>
            <td className="border border-collapse p-0" colSpan={3}>
              نسبة الساعات الضائعة
            </td>
            <td className="border border-collapse p-0">
              {"% " +
                (
                  (Number(missedHoursByTeachers) * 100) /
                  Number(totalhours)
                ).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between print:hidden">
        <Button onClick={() => setMinTeachersCells(minTeachersCells + 1)}>
          +
        </Button>
        <Button
          variant="destructive"
          onClick={() => setMinTeachersCells(minTeachersCells - 1)}
        >
          -
        </Button>
      </div>
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
              colSpan={minNumberOfCells - 5}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              التعداد الكلي للتلاميذ
            </th>
            <th
              colSpan={1}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              {todayCount.length}
            </th>
            <th
              colSpan={4}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              التعداد الكلي للغياب
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
              نسبة الغياب
            </th>
            <th
              rowSpan={2}
              className="border-separate border py-1 px-1 bg-gray-400"
            >
              {((data?.length * 100) / todayCount?.length).toFixed(2) + " %"}
            </th>
          </tr>
        </thead>
      </table>
      <div className="flex justify-between">
        <table className="w-2/3">
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
              <TableHead>إ</TableHead>
              <TableHead>ذ</TableHead>
              <TableHead>إ</TableHead>
              <TableHead>ذ</TableHead>
              <TableHead>إ</TableHead>
              <TableHead>ذ</TableHead>
              <TableHead>إ</TableHead>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr className="text-center">
              <TableCell colSpan={2}>تعداد الأمس</TableCell>
              <TableCell>
                {
                  filter(
                    yesterdayCount,
                    (s) => s.student_status == "داخلي" && s.gender == "ذكر"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    yesterdayCount,
                    (s) => s.student_status == "داخلي" && s.gender == "أنثى"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    yesterdayCount,
                    (s) => s.student_status == "نصف داخلي" && s.gender == "ذكر"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    yesterdayCount,
                    (s) => s.student_status == "نصف داخلي" && s.gender == "أنثى"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    yesterdayCount,
                    (s) => s.student_status == "خارجي" && s.gender == "ذكر"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    yesterdayCount,
                    (s) => s.student_status == "خارجي" && s.gender == "أنثى"
                  ).length
                }
              </TableCell>
              <TableCell>
                {filter(yesterdayCount, (s) => s.gender == "ذكر").length}
              </TableCell>
              <TableCell>
                {filter(yesterdayCount, (s) => s.gender == "أنثى").length}
              </TableCell>
              <TableCell>{yesterdayCount.length}</TableCell>
            </tr>
            <tr>
              <TableCell rowSpan={2}>التغييرات</TableCell>
              <TableCell>دخول</TableCell>
              <TableCell>{newStudents("داخلي", "ذكر")}</TableCell>
              <TableCell>{newStudents("داخلي", "أنثى")}</TableCell>
              <TableCell>{newStudents("نصف داخلي", "ذكر")}</TableCell>
              <TableCell>{newStudents("نصف داخلي", "أنثى")}</TableCell>
              <TableCell>{newStudents("خارجي", "ذكر")}</TableCell>
              <TableCell>{newStudents("خارجي", "أنثى")}</TableCell>
              <TableCell>{allNewStudentsByGender("ذكر")}</TableCell>
              <TableCell>{allNewStudentsByGender("أنثى")}</TableCell>
              <TableCell>{allNewStudents().length}</TableCell>
            </tr>
            <tr>
              <TableCell>خروج</TableCell>
              <TableCell>{goneStudents("داخلي", "ذكر")}</TableCell>
              <TableCell>{goneStudents("داخلي", "أنثى")}</TableCell>
              <TableCell>{goneStudents("نصف داخلي", "ذكر")}</TableCell>
              <TableCell>{goneStudents("نصف داخلي", "أنثى")}</TableCell>
              <TableCell>{goneStudents("خارجي", "ذكر")}</TableCell>
              <TableCell>{goneStudents("خارجي", "أنثى")}</TableCell>
              <TableCell>{AllGoneStudentsByGender("ذكر")}</TableCell>
              <TableCell>{AllGoneStudentsByGender("أنثى")}</TableCell>
              <TableCell>{AllGoneStudents().length}</TableCell>
            </tr>
            <tr>
              <TableCell colSpan={2}>تعداد اليوم</TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) => s.student_status == "داخلي" && s.gender == "ذكر"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) => s.student_status == "داخلي" && s.gender == "أنثى"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) => s.student_status == "نصف داخلي" && s.gender == "ذكر"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) => s.student_status == "نصف داخلي" && s.gender == "أنثى"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) => s.student_status == "خارجي" && s.gender == "ذكر"
                  ).length
                }
              </TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) => s.student_status == "خارجي" && s.gender == "أنثى"
                  ).length
                }
              </TableCell>
              <TableCell>
                {filter(todayCount, (s) => s.gender == "ذكر").length}
              </TableCell>
              <TableCell>
                {filter(todayCount, (s) => s.gender == "أنثى").length}
              </TableCell>
              <TableCell>
                {
                  filter(
                    todayCount,
                    (s) =>
                      !(
                        (s.switched_school == true || s.is_fired) &&
                        s.student_leave_date < todayDate
                      )
                  )?.length
                }
              </TableCell>
            </tr>
          </tbody>
        </table>
        <div>
          <table className="text-center">
            <caption className="font-bold text-lg">
              3. غيابات مشرفي التربية:
            </caption>
            <thead>
              <tr>
                <TableHead>الرقم</TableHead>
                <TableHead>اللقب والإسم</TableHead>
                <TableHead>سبب الغياب</TableHead>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>1</TableCell>
                <TableCell>
                  <input type="text" className="w-32 m-0 text-center" />{" "}
                </TableCell>
                <TableCell>
                  <input type="text" className="w-24 m-0 text-center" />{" "}
                </TableCell>
              </tr>
              <tr>
                <TableCell>2</TableCell>
                <TableCell>
                  <input type="text" className="w-32 m-0 text-center" />{" "}
                </TableCell>
                <TableCell>
                  <input type="text" className="w-24 m-0 text-center" />{" "}
                </TableCell>
              </tr>
              <tr>
                <TableCell>3</TableCell>
                <TableCell>
                  <input type="text" className="w-32 m-0 text-center" />{" "}
                </TableCell>
                <TableCell>
                  <input type="text" className="w-24 m-0 text-center" />{" "}
                </TableCell>
              </tr>
              <tr>
                <TableCell>4</TableCell>
                <TableCell>
                  <input type="text" className="w-32 m-0 text-center" />{" "}
                </TableCell>
                <TableCell>
                  <input type="text" className="w-24 m-0 text-center" />{" "}
                </TableCell>
              </tr>
              <tr>
                <TableCell colSpan={2}>النسبة اليومية للغيابات</TableCell>
                <TableCell>
                  <input type="text" className="w-24 m-0 text-center" />{" "}
                </TableCell>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-4 justify-between m-4">
        <table className="text-center w-full">
          <caption className="font-bold text-lg">1.4. الدخول الجديد:</caption>
          <thead>
            <tr>
              <TableHead>الرقم</TableHead>
              <TableHead>اللقب والاسم</TableHead>
              <TableHead>القسم</TableHead>
              <TableHead>الصفة</TableHead>
              <TableHead>ملاحظة</TableHead>
            </tr>
          </thead>
          <tbody>
            {sortBy(allNewStudents(), (s) => s.class_abbriviation)?.map(
              (s, index) => {
                return (
                  <tr>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{s.full_name}</TableCell>
                    <TableCell>{s.class_abbriviation}</TableCell>
                    <TableCell>{s.student_status}</TableCell>
                    <TableCell> </TableCell>
                  </tr>
                );
              }
            )}
            {allNewStudents().length < minTransferCells &&
              Array.from({
                length: minTransferCells - allNewStudents().length,
              }).map((_, index) => (
                <tr>
                  <TableCell>{index + allNewStudents().length + 1}</TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="text-center w-full">
          <caption className="font-bold text-lg">2.4. الخروج الجديد:</caption>
          <thead>
            <tr>
              <TableHead>الرقم</TableHead>
              <TableHead>اللقب والاسم</TableHead>
              <TableHead>القسم</TableHead>
              <TableHead>الصفة</TableHead>
              <TableHead>ملاحظة</TableHead>
            </tr>
          </thead>
          <tbody>
            {sortBy(AllGoneStudents(), (s) => s.class_abbriviation)?.map(
              (s, index) => {
                return (
                  <tr>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{s.full_name}</TableCell>
                    <TableCell>{s.class_abbriviation}</TableCell>
                    <TableCell>{s.student_status}</TableCell>
                    <TableCell> </TableCell>
                  </tr>
                );
              }
            )}
            {AllGoneStudents().length < minTransferCells &&
              Array.from({
                length: minTransferCells - AllGoneStudents().length,
              }).map((_, index) => (
                <tr>
                  <TableCell>{index + AllGoneStudents().length + 1}</TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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
