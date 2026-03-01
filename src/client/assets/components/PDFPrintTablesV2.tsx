import React, { useEffect, useMemo, useState, useCallback } from "react";
import { reverseString } from "../contexts/AppFunctions";
import { Student } from "@/client/providers/StudentProvider";
import _ from "lodash";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database.types";
import { SelectSupervisor } from "./SelectSupervisor";

// =============================================================================
// Types & Interfaces
// =============================================================================

export interface PDFPrintTablesProps {
  data: Student[] | undefined;
  classrooms?: Student[] | undefined;
  date: number;
}

interface SupervisorCount {
  full_name: string | null;
  length: number;
}

type Supervisor = Tables<"supervisors">;

// =============================================================================
// Constants
// =============================================================================

const CELL_CLASSES = "border border-collapse border-zinc-500 py-1 px-1";
const HEADER_CELL_CLASSES = "border-separate border border-zinc-500 py-1 px-1 bg-gray-200";
const TABLE_CLASSES = "w-full print:text-[13px] font-medium";

const TABLE_HEADERS = [
  { label: "الرقم", colSpan: 1 },
  { label: "اللقب", colSpan: 1 },
  { label: "الاسم", colSpan: 1 },
  { label: "القسم", colSpan: 1 },
  { label: "غائب منذ", colSpan: 1 },
  { label: "سا/غ", colSpan: 2 },
  { label: "الأيام", colSpan: 1 },
  { label: "الإجراء", colSpan: 1 },
  { label: "المبرر", colSpan: 1 },
] as const;

// =============================================================================
// Utility Functions
// =============================================================================

const formatArabicDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
};

const formatLocalDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

const parseMissedHours = (missedHours: string | null | undefined): [string, string] => {
  if (!missedHours) return ["-", "-"];
  const parts = missedHours.split("-");
  return [parts[0] || "-", parts[1] || "-"];
};

// =============================================================================
// Custom Hooks
// =============================================================================

const useDailyNotes = (date: number) => {
  const [dailyNote, setDailyNote] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    const { data: note, error } = await supabase
      .from("daily_notes")
      .select("*")
      .eq("report_date", formatLocalDate(date))
      .maybeSingle();

    if (error) {
      console.error("Error fetching daily notes:", error);
      return;
    }

    if (note) {
      setDailyNote(note.note);
    }
  }, [date]);

  const upsertNote = useCallback(async (noteContent: string) => {
    const { error } = await supabase
      .from("daily_notes")
      .upsert(
        {
          report_date: formatLocalDate(date),
          note: noteContent,
        },
        { onConflict: "report_date" }
      )
      .select();

    if (error) {
      console.error("Error saving note:", error);
    }
  }, [date]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { dailyNote, upsertNote };
};

const useSupervisors = () => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      const { data, error } = await supabase.from("supervisors").select("*");

      if (error) {
        console.error("Error fetching supervisors:", error);
        return;
      }

      if (data) {
        setSupervisors(data);
      }
    };

    fetchSupervisors();
  }, []);

  return supervisors;
};

// =============================================================================
// Sub-Components
// =============================================================================

interface TableHeaderProps {
  headers: typeof TABLE_HEADERS;
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => (
  <thead className="border-separate border border-zinc-500 bg-gray-200">
    <tr>
      {headers.map((header, index) => (
        <th
          key={index}
          colSpan={header.colSpan}
          className={HEADER_CELL_CLASSES}
        >
          {header.label}
        </th>
      ))}
    </tr>
  </thead>
);

interface StudentRowProps {
  student: Student;
  index: number;
}

const StudentRow: React.FC<StudentRowProps> = ({ student, index }) => {
  const [hoursStart, hoursEnd] = parseMissedHours(student.missed_hours);

  return (
    <tr>
      <td className={CELL_CLASSES}>{index + 1}</td>
      <td className={CELL_CLASSES}>{student.last_name}</td>
      <td className={CELL_CLASSES}>{student.first_name}</td>
      <td className={CELL_CLASSES}>{student.class}</td>
      <td className={CELL_CLASSES}>
        {reverseString(student.absence_date, "/")}
      </td>
      <td className={CELL_CLASSES}>{hoursStart}</td>
      <td className={CELL_CLASSES}>{hoursEnd}</td>
      <td className={CELL_CLASSES}>{student.absence_days}</td>
      <td className={CELL_CLASSES}>{student.noticeName}</td>
      <td className={CELL_CLASSES}>{student.medical_leave}</td>
    </tr>
  );
};

interface NotesSectionProps {
  title: string;
  subtitle?: string;
  defaultValue?: string | null;
  onBlur?: (value: string) => void;
  rows?: number;
  paddingX?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  title,
  subtitle,
  defaultValue = "",
  onBlur,
  rows = 3,
  paddingX = "px-5",
}) => (
  <table className={`${TABLE_CLASSES} mt-2`}>
    <thead>
      <tr>
        <th className={`border border-collapse border-zinc-500 py-1 ${paddingX}`}>
          {title}
          {subtitle && <span className="text-xs"> {subtitle}</span>}
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
            rows={rows}
            onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
            defaultValue={defaultValue || ""}
          />
        </td>
        <td className="border border-zinc-500 px-1"></td>
      </tr>
    </tbody>
  </table>
);

interface SupervisorSignatureProps { }

const SupervisorSignature: React.FC<SupervisorSignatureProps> = () => (
  <div className="flex justify-between">
    <p className="font-bold text-xl flex justify-end m-8">مشرف الأقسام</p>
    <p className="font-bold text-xl flex justify-end m-8">مستشــــار التربيـــــة</p>
  </div>
);

interface HeaderSectionProps {
  formattedDate: string;
  absenceCount: number;
  selectSupervisor: string;
  onSupervisorChange: (value: string) => void;
  supervisorCounts: SupervisorCount[];
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  formattedDate,
  absenceCount,
  selectSupervisor,
  onSupervisorChange,
  supervisorCounts,
}) => (
  <div className="flex items-center justify-between mb-1">
    <p className="text-base font-bold">
      التلاميذ الغائبين الى غاية نهاية يوم: {formattedDate}
    </p>
    <div className="flex justify-center items-center gap-4 print:hidden">
      <p className="text-base font-bold">عدد الغيابات : {absenceCount}</p>
      <SelectSupervisor
        selectLabel="المشرفين"
        firstItem="كل المشرفين"
        selectSupervisor={selectSupervisor}
        setSelectSupervisor={onSupervisorChange}
        items={supervisorCounts}
      />
    </div>
  </div>
);

// =============================================================================
// Main Component
// =============================================================================

export default function PDFPrintTablesV2({ data, date }: PDFPrintTablesProps) {
  const [selectSupervisor, setSelectSupervisor] = useState<string>("الكل");

  const supervisors = useSupervisors();
  const { dailyNote, upsertNote } = useDailyNotes(date);

  const formattedDate = useMemo(() => formatArabicDate(date), [date]);

  // Calculate filtered absences based on selected supervisor
  const absencesData = useMemo(() => {
    if (!data) return [];
    if (selectSupervisor === "الكل") return data;

    const selectedSupervisor = supervisors.find(
      (s) => s.full_name === selectSupervisor
    );

    if (!selectedSupervisor) return data;

    return data.filter(
      (student) => student.supervisor_id === selectedSupervisor.supervisor_id
    );
  }, [data, selectSupervisor, supervisors]);

  // Calculate absence counts per supervisor
  const supervisorCounts = useMemo<SupervisorCount[]>(() => {
    if (!data) return [];

    return supervisors.map((supervisor) => ({
      full_name: supervisor.full_name,
      length: data.filter(
        (student) => student.supervisor_id === supervisor.supervisor_id
      ).length,
    }));
  }, [data, supervisors]);

  const isAllSupervisorsSelected = selectSupervisor === "الكل";

  return (
    <div id="section-to-print" className="w-full p-4 print:p-0">
      <HeaderSection
        formattedDate={formattedDate}
        absenceCount={absencesData.length}
        selectSupervisor={selectSupervisor}
        onSupervisorChange={setSelectSupervisor}
        supervisorCounts={supervisorCounts}
      />

      <table className={TABLE_CLASSES}>
        <TableHeader headers={TABLE_HEADERS} />
        <tbody>
          {absencesData.map((student, index) => (
            <StudentRow key={student.id} student={student} index={index} />
          ))}
        </tbody>
      </table>

      {isAllSupervisorsSelected ? (
        <>
          <NotesSection
            title="ملاحظات مستشار التربية:"
            subtitle="(النظافة،الصيانة،الإتلافات،الحوادث،النشاط الثقافي و الرياضي،دروس الدعم،الزيارات)"
            defaultValue={dailyNote}
            onBlur={upsertNote}
            rows={5}
            paddingX="px-1"
          />
          <NotesSection
            title="اقتراحــات النـاظـــــــــر:"
            paddingX="px-60"
          />
          <NotesSection
            title="توصيات مدير المؤسسة:"
            paddingX="px-56"
          />
        </>
      ) : (
        <SupervisorSignature />
      )}
    </div>
  );
}
