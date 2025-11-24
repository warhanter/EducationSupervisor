import React, { useEffect, useMemo, useState } from "react";
import { reverseString } from "../contexts/AppFunctions";
import { Student } from "@/client/providers/StudentProvider";
import _ from "lodash";
import { supabase } from "@/lib/supabaseClient";
import { AppSelectItems } from "./AppSelectItems";

export type PDFPrintTablesProps = {
  data: Student[] | undefined;
  classrooms: Student[] | undefined;
  date: number;
};
export default function PDFPrintTables({ data, date }: PDFPrintTablesProps) {
  const [daily_note, setDaily_note] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("الكل");
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  const absencesData = useMemo(
    () =>
      _.sortBy(
        _.filter(data, (d) =>
          selectedClass === "الكل" ? true : d.class === selectedClass
        ),
        (student) => student.class_abbreviation
      ),
    [data, selectedClass]
  );

  const classes = useMemo(
    () => _.uniq(absencesData.map((student) => student.class).sort()),
    []
  );

  const fetchNotes = async () => {
    let { data: note, error } = await supabase
      .from("daily_notes")
      .select("*")
      .eq("report_date", new Date(date).toLocaleDateString())
      .maybeSingle();
    if (error) console.error("Errors fetching data:", error);
    console.log("fetching ", note);
    if (note) {
      setDaily_note(note.note);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, [date]);
  console.log("daily_notes", daily_note);
  const handleUpsertNote = async (noteContent: string) => {
    const { data, error } = await supabase
      .from("daily_notes")
      .upsert(
        {
          report_date: new Date(date).toLocaleDateString(), // Replace with your specific date
          note: noteContent,
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
  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <div className="flex  items-center justify-between mb-1">
        <p className="text-base font-bold">
          التلاميذ الغائبين الى غاية نهاية يوم: {fdate}
        </p>
        <div className="flex justify-center items-center gap-4">
          <p className="text-base font-bold">عدد الغيابات : {data?.length}</p>
          <AppSelectItems
            selectLabel="القسم"
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            items={classes}
          />
        </div>
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
          <tr>
            <td className="border border-zinc-500">
              <textarea
                className="resize-none w-full p-2 border-none outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                onBlur={(e) => handleUpsertNote(e.target.value)}
                defaultValue={daily_note || ""}
              />
            </td>
            <td className="border border-zinc-500 px-1"></td>
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
