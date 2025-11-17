import { useStudents } from "@/client/providers/StudentProvider";
import { sortBy } from "lodash";
import React from "react";

export default function StudentCard() {
  const { nisfDakhili } = useStudents();
  nisfDakhili.filter((s) => s.gender === "ذكر");
  let MaleTableNumber = 0;
  let FemaleTableNumber = 0;

  return (
    <div id="section-to-print" className="w-full p-4">
      <div className="grid grid-cols-2 gap-8">
        {nisfDakhili &&
          sortBy(
            nisfDakhili.filter((s) => s.gender === "ذكر"),
            "rakm_tasjil"
          ).map((student, index) => {
            if (index % 12 === 0) MaleTableNumber++;

            return (
              <>
                {index % 8 === 0 && <div className="col-span-full h-4 p-0" />}
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
              </>
            );
          })}
      </div>
      <div className="col-span-full chapter mb-10" />
      <div className="grid grid-cols-2 gap-8">
        {nisfDakhili &&
          sortBy(
            nisfDakhili.filter((s) => s.gender === "أنثى"),
            "rakm_tasjil"
          ).map((student, index) => {
            if (index % 12 === 0) FemaleTableNumber++;

            return (
              <>
                {index % 8 === 0 && <div className="col-span-full h-4 p-0" />}
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
              </>
            );
          })}
      </div>
    </div>
  );
}
