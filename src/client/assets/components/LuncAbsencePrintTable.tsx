import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useMemo, useState } from "react";
import { Student } from "./columns";
import { calculateStudentStats } from "@/utils/calculateStudentsStats";

type LunchAbsencesProps = {
  data: Student[];
  date: Date;
  students: Student[];
};

const TABLE_ABSENCE_HEADERS = [
  "الرقم",
  "اللقب",
  "الاسم",
  "القسم",
  "طاولة",
  "المبرر",
];
const TABLE_GENDER_HEADERS = ["ذكور", "إناث", "مجموع"];

export default function LuncAbsencePrintTable({
  data,
  date,
  students,
}: LunchAbsencesProps) {
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

  // TO_BE_REMOVED-- this function is specifically for the current school as it requested
  // because the app doesn't record the lunch Absences in the lunchAbsence Table
  // instead the current LUNCH_ABSENCE Table have the present students on that lunch day.
  const absences = useMemo(
    () =>
      students.filter(
        (a) =>
          !data.some((b) => Number(b.ids) === a.id) &&
          a.student_status !== "خارجي"
      ),
    [data, students]
  );

  const numTables = Math.ceil(absences.length / 40);

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

  const allStudentsStats = calculateStudentStats(students);
  const absencesStats = calculateStudentStats(absences);

  const hadirinDokour =
    allStudentsStats["المطعم"]["ذكر"] - absencesStats["المطعم"]["ذكر"];
  const hadirinInath =
    allStudentsStats["المطعم"]["أنثى"] - absencesStats["المطعم"]["أنثى"];
  const fdate = new Date(date).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });

  const LunchAbsenceTable = ({
    absences,
    cellNumber,
  }: {
    absences: Student[];
    cellNumber: number;
  }) => {
    return (
      <table className="w-full text-sm print:text-[8px] font-medium ">
        <caption className="text-base font-bold p-2">
          غيابات المطعم ليوم: {fdate}
        </caption>
        <TableHead />
        <tbody className="text-sm font-bold">
          {absences &&
            absences.map((student, index) => {
              return (
                <tr key={student.id}>
                  <td className="border border-collapse border-zinc-500 py-0 px-1">
                    {index + 1 + cellNumber}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-0 px-1">
                    {student.last_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-0 px-1">
                    {student.first_name}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-0 px-1">
                    {student.class_abbreviation}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-0 px-1">
                    {student?.lunch_table_number}
                  </td>
                  <td className="border border-collapse border-zinc-500 py-0 px-1">
                    {student?.lunch_leave_justification}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };
  const TableHead = () => (
    <thead className=" text-sm print:text-[8px] font-medium border-separate border border-zinc-500 bg-gray-200">
      <tr className="h-6 txt-sm">
        {TABLE_ABSENCE_HEADERS.map((header) => (
          <th className="border-separate border border-zinc-500 bg-gray-200">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
  const DummyData = ({
    cellTitle,
    arrayNum,
    dummyText,
    emtyCell,
    row,
  }: {
    cellTitle?: string | undefined;
    arrayNum: number;
    dummyText?: string | undefined;
    emtyCell?: boolean | undefined;
    row?: boolean | undefined;
  }) =>
    row ? (
      <tr>
        {cellTitle && (
          <td className="border border-collapse border-zinc-500 p-1">
            {cellTitle}
          </td>
        )}
        {[...Array(arrayNum)].map((_, i) => (
          <td key={i} className="border border-collapse border-zinc-500 p-1">
            {dummyText}
          </td>
        ))}
        {emtyCell && (
          <td className="border border-collapse border-zinc-500 p-1" />
        )}
      </tr>
    ) : (
      [...Array(arrayNum)].map((_, i) => (
        <td key={i} className="border border-collapse border-zinc-500 p-1">
          {dummyText}
        </td>
      ))
    );

  const NotesTable = ({
    tableHeaders,
    onPress,
    defaultValue,
  }: {
    tableHeaders: string[];
    defaultValue?: string | null;
    onPress?: (e: any) => Promise<void>;
  }) => (
    <table className="w-full   print:text-[13px] font-medium mt-2">
      <thead>
        <tr>
          {tableHeaders.map((header) => (
            <th className="border border-collapse border-zinc-500 py-1 px-1">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-collapse border-zinc-500 ">
            <textarea
              rows={5}
              className="resize-none w-full m-0 py-0 px-5"
              onBlur={onPress}
              defaultValue={defaultValue ?? ""}
            />
          </td>
          <td className="border border-collapse border-zinc-500 px-1"></td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div id="section-to-print" className="w-full p-4 print:p-0 chapter">
      {/* <div className="flex justify-between">
        <p className="text-lg font-bold mb-4">غيابات المطعم ليوم: {fdate}</p>
        <p className="text-lg font-bold mb-4">عدد الغيابات : {data?.length}</p>
      </div> */}
      <div className="flex flex-row gap-4 chapter">
        {/* <div className="bg-slate-700 h-full w-full"></div> */}
        <div className="w-[700px] text-sm font-bold text-center">
          <table className="w-full  print:text-[13px] font-medium mb-2">
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
                {[...TABLE_GENDER_HEADERS, ...TABLE_GENDER_HEADERS].map(
                  (header) => (
                    <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {<DummyData cellTitle="مسجلون" arrayNum={6} emtyCell row />}
              {<DummyData cellTitle="غائبون" arrayNum={6} emtyCell row />}
              {<DummyData cellTitle="حاضرون" arrayNum={6} emtyCell row />}
            </tbody>
          </table>
          <table className="w-full  print:text-[13px] font-medium mb-2">
            <thead className="border-separate border border-zinc-500 bg-gray-200 p-1">
              <tr>
                <th
                  rowSpan={2}
                  className="border-separate border border-zinc-500 bg-gray-200 p-1"
                />
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
                {[...TABLE_GENDER_HEADERS, ...TABLE_GENDER_HEADERS].map(
                  (header) => (
                    <th className="border-separate border border-zinc-500 bg-gray-200 p-1">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  مسجلون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {allStudentsStats["المطعم"]["ذكر"]}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {allStudentsStats["المطعم"]["أنثى"]}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {allStudentsStats["المطعم"]["الكل"]}
                </td>
                {<DummyData arrayNum={4} />}
              </tr>
              <tr>
                <td className="border border-collapse border-zinc-500 p-1">
                  غائبون
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0
                    ? allStudentsStats["المطعم"]["ذكر"]
                    : absencesStats["المطعم"]["ذكر"]}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data.length === 0
                    ? allStudentsStats["المطعم"]["أنثى"]
                    : absencesStats["المطعم"]["أنثى"]}
                </td>
                <td className="border border-collapse border-zinc-500 p-1">
                  {data?.length === 0
                    ? allStudentsStats["المطعم"]["الكل"]
                    : absencesStats["المطعم"]["الكل"]}
                </td>
                {<DummyData arrayNum={4} />}
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
                    : allStudentsStats["المطعم"]["الكل"] -
                      absencesStats["المطعم"]["الكل"]}
                </td>
                {<DummyData arrayNum={4} />}
              </tr>
            </tbody>
          </table>
          <table className="w-full  print:text-[13px] font-medium mb-2">
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

          <NotesTable
            tableHeaders={["ملاحظات مستشار التربية:", "الختم و الإمضاء"]}
            onPress={(e) => handleUpsertLunchNote(e.target.value)}
            defaultValue={lunch_note}
          />
          <NotesTable
            tableHeaders={["اقتراحــات النـاظـــــــــر:", "الختم و الإمضاء"]}
          />

          <NotesTable
            tableHeaders={["توصيات مدير المؤسسة:", "الختم و الإمضاء"]}
          />
        </div>
        {data.length > 0 ? (
          <LunchAbsenceTable absences={absences.slice(0, 40)} cellNumber={0} />
        ) : (
          <table className="w-full  print:text-[13px] font-medium ">
            <caption className="text-base font-bold p-2">
              غيابات المطعم ليوم: {fdate}
            </caption>

            <TableHead />
            <tbody className="text-sm font-bold">
              <tr>
                {Array.from({ length: 6 }).map((_) => (
                  <td className="border border-collapse border-zinc-500 py-0 px-1"></td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {data.length > 0 &&
        numTables > 1 &&
        Array.from({ length: numTables - 1 }).map((_, i) => (
          <div className="chapter">
            <LunchAbsenceTable
              absences={absences.slice((i + 1) * 40, (i + 1) * 40 + 40)}
              cellNumber={(i + 1) * 40}
            />
            <p className="font-bold text-base flex justify-end m-1">
              مستشــــار التربيـــــة
            </p>
          </div>
        ))}
    </div>
  );
}
