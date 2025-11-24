import { useStudents } from "@/client/providers/StudentProvider";
import _ from "lodash";
import React, { useMemo } from "react";
import HeaderNavbar from "./HeaderNavbar";
import { cn } from "@/lib/utils";

export default function StudentCard() {
  const { nisfDakhili } = useStudents();

  let MaleTableNumber = 0;
  let FemaleTableNumber = 0;
  const nisfDakhiliFemales = useMemo(
    () =>
      _.sortBy(
        nisfDakhili.filter((s) => s.gender === "أنثى"),
        "rakm_tasjil"
      ),
    [nisfDakhili]
  );
  const nisfDakhiliMales = useMemo(
    () =>
      _.sortBy(
        nisfDakhili.filter((s) => s.gender === "ذكر"),
        "rakm_tasjil"
      ),
    [nisfDakhili]
  );

  return (
    <div className="w-full">
      <HeaderNavbar />
      <div className="w-full bg-white border border-gray-200 m-8 max-sm:mx-0 max-sm:my-4 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
        <div className="bg-gradient-to-r bg-slate-800 text-white mb-4">
          <div className="flex justify-center items-center  p-6">
            <h1 className="text-2xl md:text-3xl text-center font-bold">
              بطاقات النصف داخلي
            </h1>
          </div>
        </div>
        <div id="section-to-print">
          <div className="grid grid-cols-2 gap-8">
            {nisfDakhili &&
              nisfDakhiliMales.map((student, index) => {
                if (index % 12 === 0) MaleTableNumber++;

                return (
                  <div
                    className={cn(
                      "flex",
                      index % 2 === 0 ? "justify-end" : "justify-start"
                    )}
                  >
                    {index % 8 === 0 && (
                      <div className="col-span-full h-4 p-0" />
                    )}
                    <div>
                      <table className="p-4">
                        <tbody className="border text-center">
                          <tr>
                            <td className="py-2">وزارة التربية الوطنية</td>
                            <td className="border p-10" rowSpan={4}>
                              صورة
                            </td>
                          </tr>
                          <tr className="font-bold text-lg">
                            <td>بطاقة التلميذ نصف داخلي</td>
                          </tr>
                          <tr>
                            <td className="p-2  font-bold">
                              المؤسسة: الثانوية المختلطة مروانة
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold text-sm">
                              اللقب والاسم: {student.full_name}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-sm">
                              تاريخ الازدياد: {student.student_dob}
                            </td>
                            <td>2025/2026</td>
                          </tr>
                          <tr>
                            <td className="font-bold text-sm">
                              ممنوح: {student.is_mamnouh ? "نعم" : "لا"}
                            </td>
                            <td rowSpan={2}>الطاولة: {MaleTableNumber}</td>
                          </tr>
                          <tr>
                            <td className="text-xs font-bold p-1">
                              القسم: {student.full_class_name}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {(index + 1) % 8 === 0 && (
                      <div className="col-span-full chapter" />
                    )}
                  </div>
                );
              })}
          </div>
          <div className="col-span-full chapter mb-10" />
          <div className="grid grid-cols-2 gap-8">
            {nisfDakhili &&
              nisfDakhiliFemales.map((student, index) => {
                if (index % 12 === 0) FemaleTableNumber++;

                return (
                  <div className="flex justify-center">
                    {index % 8 === 0 && (
                      <div className="col-span-full h-4 p-0" />
                    )}
                    <div>
                      <table className="p-4">
                        <tbody className="border text-center">
                          <tr>
                            <td className="py-2">وزارة التربية الوطنية</td>
                            <td className="border p-10" rowSpan={4}>
                              صورة
                            </td>
                          </tr>
                          <tr className="font-bold text-lg">
                            <td>بطاقة التلميذ نصف داخلي</td>
                          </tr>
                          <tr>
                            <td className="p-2  font-bold">
                              المؤسسة: الثانوية المختلطة مروانة
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold text-sm">
                              اللقب والاسم: {student.full_name}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-sm">
                              تاريخ الازدياد: {student.student_dob}
                            </td>
                            <td>2025/2026</td>
                          </tr>
                          <tr>
                            <td className="font-bold text-sm">
                              ممنوح: {student.is_mamnouh ? "نعم" : "لا"}
                            </td>
                            <td rowSpan={2}>الطاولة: {FemaleTableNumber}</td>
                          </tr>
                          <tr>
                            <td className="text-xs font-bold p-1">
                              القسم: {student.full_class_name}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {(index + 1) % 8 === 0 && (
                      <div className="col-span-full chapter" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
