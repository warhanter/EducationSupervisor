import { supabase } from "@/lib/supabaseClient";
import { filter } from "lodash";
import React, { useEffect, useState } from "react";

export default function LuncAbsencePrintTable({ data, date, students }) {
  const [lunch_note, setLunch_note] = useState<string | null>(null);
  const [lunch_plates, setLunch_Plates] = useState<string | null>(null);
  const fetchNotes = async () => {
    let { data: note, error } = await supabase
      .from("daily_notes")
      .select("*")
      .eq("report_date", new Date(date).toLocaleDateString())
      .maybeSingle();
    if (error) console.error("Errors fetching data:", error);
    console.log("fetching ", note);
    if (note) {
      setLunch_note(note.lunch_note);
      setLunch_Plates(note.lunch_plates);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, [date]);

  const handleUpsertLunchNote = async (noteContent: string) => {
    const { data, error } = await supabase
      .from("daily_notes")
      .upsert(
        {
          report_date: new Date(date).toLocaleDateString(), // Replace with your specific date
          lunch_note: noteContent,
        },
        {
          onConflict: "report_date",
        }
      )
      .select();

    if (error) {
      console.error("Error saving note:", error);
    } else {
      console.log("Note saved:", data);
    }
  };

  const handleUpsertLunchPlates = async (noteContent: string) => {
    const { data, error } = await supabase
      .from("daily_notes")
      .upsert(
        {
          report_date: new Date(date).toLocaleDateString(), // Replace with your specific date
          lunch_plates: noteContent,
        },
        {
          onConflict: "report_date",
        }
      )
      .select();

    if (error) {
      console.error("Error saving note:", error);
    } else {
      console.log("Note saved:", data);
    }
  };

  const dakhiliDokour = filter(
    students,
    (student) => student.student_status === "داخلي" && student.gender === "ذكر"
  ).length;
  const dakhiliInath = filter(
    students,
    (student) => student.student_status === "داخلي" && student.gender === "إنثى"
  ).length;
  const nisfDakhiliDokour = filter(
    students,
    (student) =>
      student.student_status === "نصف داخلي" && student.gender === "ذكر"
  ).length;
  const nisfDakhiliInath = filter(
    students,
    (student) =>
      student.student_status === "نصف داخلي" && student.gender === "أنثى"
  ).length;
  const dakhiliDokourAbsences = filter(
    data,
    (student) => student.student_status === "داخلي" && student.gender === "ذكر"
  ).length;
  const dakhiliInathAbsences = filter(
    data,
    (student) => student.student_status === "داخلي" && student.gender === "إنثى"
  ).length;
  const nisfDakhiliDokourAbsences = filter(
    data,
    (student) =>
      student.student_status === "نصف داخلي" && student.gender === "ذكر"
  ).length;
  const nisfDakhiliInathAbsences = filter(
    data,
    (student) =>
      student.student_status === "نصف داخلي" && student.gender === "أنثى"
  ).length;
  const hadirinDokour =
    dakhiliDokour +
    nisfDakhiliDokour -
    dakhiliDokourAbsences -
    nisfDakhiliDokourAbsences;
  const hadirinInath =
    dakhiliInath +
    nisfDakhiliInath -
    dakhiliInathAbsences -
    nisfDakhiliInathAbsences;
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      {/* <div className="flex justify-between">
        <p className="text-lg font-bold mb-4">غيابات المطعم ليوم: {fdate}</p>
        <p className="text-lg font-bold mb-4">عدد الغيابات : {data?.length}</p>
      </div> */}
      <div className="flex flex-row gap-4">
        {/* <div className="bg-slate-700 h-full w-full"></div> */}
        <div className="w-[700px] text-base font-bold text-center">
          <table className="w-full  print:text-[13px] font-medium mb-16">
            <caption className="text-base font-bold p-2">
              النظام الداخلي و النصف داخلي
            </caption>
            <thead className="border-separate border border-zinc-500 bg-gray-200 p-1">
              <tr>
                <th
                  rowSpan={2}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                ></th>
                <th
                  colSpan={3}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                >
                  قاعة المذاكرة
                </th>
                <th
                  colSpan={3}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                >
                  المطعم
                </th>
                <th
                  rowSpan={2}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                >
                  ملاحظات
                </th>
              </tr>
              <tr>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  ذكور
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  إناث
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  مجموع
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  ذكور
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  إناث
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  مجموع
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  مسجلون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1"></td>
              </tr>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  غائبون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1"></td>
              </tr>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  حاضرون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1"></td>
              </tr>
            </tbody>
          </table>
          <table className="w-full  print:text-[13px] font-medium mb-10">
            <thead className="border-separate border border-zinc-500 bg-gray-200 p-1">
              <tr>
                <th
                  rowSpan={2}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                ></th>
                <th
                  colSpan={3}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                >
                  الغداء
                </th>
                <th
                  colSpan={3}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                >
                  العشاء
                </th>
                <th
                  rowSpan={2}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                >
                  ملاحظات
                </th>
              </tr>
              <tr>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  ذكور
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  إناث
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  مجموع
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  ذكور
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  إناث
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                  مجموع
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  مسجلون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {dakhiliDokour + nisfDakhiliDokour}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {dakhiliInath + nisfDakhiliInath}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {dakhiliDokour +
                    nisfDakhiliDokour +
                    dakhiliInath +
                    nisfDakhiliInath}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1"></td>
              </tr>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  غائبون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0
                    ? dakhiliDokour + nisfDakhiliDokour
                    : dakhiliDokourAbsences + nisfDakhiliDokourAbsences}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0
                    ? dakhiliInath + nisfDakhiliInath
                    : dakhiliInathAbsences + nisfDakhiliInathAbsences}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data?.length === 0
                    ? dakhiliDokour +
                      nisfDakhiliDokour +
                      dakhiliInath +
                      nisfDakhiliInath
                    : data?.length}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1"></td>
              </tr>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  حاضرون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0 ? 0 : hadirinDokour}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0 ? 0 : hadirinInath}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0
                    ? 0
                    : dakhiliDokour +
                      nisfDakhiliDokour +
                      dakhiliInath +
                      nisfDakhiliInath -
                      data?.length}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  0
                </td>
                <td className="border border-collapse border-zinc-500 p-1"></td>
              </tr>
            </tbody>
          </table>
          <table className="w-full  print:text-[13px] font-medium mb-20">
            <caption className="text-base font-bold p-2">
              الوجبات الغذائية
            </caption>
            <tbody className="border-separate border border-zinc-500">
              <tr>
                <th className="border-separate border border-zinc-500 bg-gray-200 px-1 py-2">
                  فطـــور
                </th>
                <td className="border border-collapse border-zinc-500 px-1 py-2">
                  <input
                    className="w-80 text-center font-bold m-0"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <th className="border-separate border border-zinc-500 bg-gray-200 px-1 py-2">
                  غــــــداء
                </th>

                <td className="border border-collapse border-zinc-500 px-1 py-2">
                  <input
                    className="w-80 text-center font-bold m-0"
                    type="text"
                    defaultValue={lunch_plates || ""}
                    onBlur={(e) => handleUpsertLunchPlates(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th className="border-separate border border-zinc-500 bg-gray-200 px-1 py-2">
                  عشـــاء
                </th>
                <td className="border border-collapse border-zinc-500 px-1 py-2">
                  <input
                    className="w-80 text-center font-bold m-0"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <table className="w-full   print:text-[13px] font-medium mt-8">
            <thead>
              <tr>
                <th className="border border-collapse border-zinc-500 py-1 px-1">
                  ملاحظات مستشار التربية:
                </th>
                <th className="border border-collapse border-zinc-500 py-1 px-1">
                  الختم و الإمضاء
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-collapse border-zinc-500 ">
                  <textarea
                    rows={5}
                    className="resize-none w-full m-0 py-0 px-5"
                    defaultValue={lunch_note || ""}
                    onBlur={(e) => handleUpsertLunchNote(e.target.value)}
                  />
                </td>
                <td className="border border-collapse border-zinc-500 px-1"></td>
              </tr>
            </tbody>
          </table>
          <table className="w-full   print:text-[13px] font-medium mt-2">
            <thead>
              <tr>
                <th className="border border-collapse border-zinc-500 py-1 px-1">
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
                <th className="border border-collapse border-zinc-500 py-1 px-1">
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
                    rows={5}
                    className="resize-none w-full m-0 py-0 px-5"
                  ></textarea>
                </td>
                <td className="border border-collapse border-zinc-500 px-1"></td>
              </tr>
            </tbody>
          </table>
        </div>
        {data.length > 0 ? (
          <table className="w-full  print:text-[13px] font-medium ">
            <caption className="text-base font-bold p-2">
              غيابات المطعم ليوم: {fdate}
            </caption>
            <thead className="border-separate border border-zinc-500 bg-gray-200">
              <tr>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  الرقم
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  اللقب
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  الاسم
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  القسم
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  طاولة
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  المبرر
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              {data &&
                data.map((student, index) => {
                  return (
                    <tr key={student.id}>
                      <td className="border border-collapse border-zinc-500 py-0 px-1">
                        {index + 1}
                      </td>
                      <td className="border border-collapse border-zinc-500 py-0 px-1">
                        {student.last_name}
                      </td>
                      <td className="border border-collapse border-zinc-500 py-0 px-1">
                        {student.first_name}
                      </td>
                      <td className="border border-collapse border-zinc-500 py-0 px-1">
                        {student.class}
                      </td>
                      <td className="border border-collapse border-zinc-500 py-0 px-1">
                        {student.tableNumber}
                      </td>
                      <td className="border border-collapse border-zinc-500 py-0 px-1">
                        {student.justification}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <table className="w-full  print:text-[13px] font-medium ">
            <caption className="text-base font-bold p-2">
              غيابات المطعم ليوم: {fdate}
            </caption>
            <thead className="border-separate border border-zinc-500 bg-gray-200">
              <tr className="h-10">
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  الرقم
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  اللقب
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  الاسم
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  القسم
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  طاولة
                </th>
                <th className="border-separate border border-zinc-500 bg-gray-200">
                  المبرر
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              <tr>
                <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
                <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
                <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
                <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
                <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
                <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {/* <p className="font-bold text-base flex justify-end m-1">
        مستشــــار التربيـــــة
      </p> */}
    </div>
  );
}
