import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { SkeletonCard } from "../assets/components/SkeletonCard";
import { RealtimeChannel } from "@supabase/supabase-js";

// Types
type Notification = {
  fullDocument: Record<string, any> | undefined;
  operationType: string | undefined;
};

type DailyNote = {
  note: string;
  report_date: string;
};

export type StudentList = Record<string, any>[];
export type Student = Record<string, any>;
type DailyNoteList = DailyNote[];

type StudentsData = {
  students: StudentList;
  absences: StudentList;
  addresses: StudentList;
  lunchAbsences: StudentList;
  classrooms: StudentList;
  professors: StudentList;
  notification?: Notification;
  daily_notes: DailyNoteList;
};

type StudentContextType = StudentsData & {
  motamadrisin: StudentList;
  wafidin: StudentList;
  moghadirin: StudentList;
  machtobin: StudentList;
  nisfDakhili: StudentList;
  otlaMaradiya: StudentList;
  maafiyin: StudentList;
  refreshData: () => Promise<void>;
};

// Table names configuration
const TABLES = {
  CLASSROOMS: "classrooms",
  PROFESSORS: "professors",
  STUDENTS: "students",
  ABSENCES: "absences",
  ADDRESSES: "student_addresses",
  LUNCH_ABSENCES: "lunch_absences",
  DAILY_NOTES: "daily_notes",
} as const;

// Default context values
const defaultValues: StudentContextType = {
  motamadrisin: [],
  wafidin: [],
  moghadirin: [],
  machtobin: [],
  nisfDakhili: [],
  otlaMaradiya: [],
  maafiyin: [],
  students: [],
  absences: [],
  addresses: [],
  lunchAbsences: [],
  classrooms: [],
  professors: [],
  daily_notes: [],
  notification: undefined,
  refreshData: async () => {},
};

const StudentContext = createContext<StudentContextType>(defaultValues);

const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentsData>({
    students: [],
    absences: [],
    addresses: [],
    lunchAbsences: [],
    classrooms: [],
    professors: [],
    daily_notes: [],
    notification: undefined,
  });

  // Fetch all data from Supabase
  const fetchData = useCallback(async () => {
    try {
      const [
        { data: classrooms, error: classroomsError },
        { data: professors, error: professorsError },
        { data: students, error: studentsError },
        { data: absences, error: absencesError },
        { data: addresses, error: addressesError },
        { data: lunchAbsences, error: lunchAbsencesError },
        { data: daily_notes, error: daily_notesError },
      ] = await Promise.all([
        supabase.from(TABLES.CLASSROOMS).select("*"),
        supabase.from(TABLES.PROFESSORS).select("*"),
        supabase.from(TABLES.STUDENTS).select("*"),
        supabase.from(TABLES.ABSENCES).select("*"),
        supabase.from(TABLES.ADDRESSES).select("*"),
        supabase.from(TABLES.LUNCH_ABSENCES).select("*"),
        supabase.from(TABLES.DAILY_NOTES).select("*"),
      ]);

      // Check for errors
      const errors = [
        classroomsError,
        professorsError,
        studentsError,
        absencesError,
        addressesError,
        lunchAbsencesError,
        daily_notesError,
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error("Errors fetching data:", errors);
      }

      setData({
        students: students || [],
        absences: absences || [],
        addresses: addresses || [],
        lunchAbsences: lunchAbsences || [],
        classrooms: classrooms || [],
        professors: professors || [],
        daily_notes: daily_notes || [],

        notification: undefined,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh only students and absences (for realtime updates)
  const refreshStudentsAndAbsences = useCallback(async (payload: any) => {
    try {
      const [{ data: students }, { data: absences }] = await Promise.all([
        supabase.from(TABLES.STUDENTS).select("*"),
        supabase.from(TABLES.ABSENCES).select("*"),
      ]);

      setData((prev) => ({
        ...prev,
        students: students || [],
        absences: absences || [],
        notification: {
          fullDocument: payload.new,
          operationType: payload.eventType,
        },
      }));
    } catch (error) {
      console.error("Error refreshing students and absences:", error);
    }
  }, []);

  // Setup realtime subscription
  useEffect(() => {
    fetchData();

    const channel: RealtimeChannel = supabase
      .channel("absence-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLES.ABSENCES,
        },
        (payload) => {
          console.log("Absence change received:", payload);
          refreshStudentsAndAbsences(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, refreshStudentsAndAbsences]);

  // Computed/filtered student lists using useMemo for performance
  const motamadrisin = useMemo(
    () => data.students.filter((s) => !s.is_fired && !s.switched_school),
    [data.students]
  );

  const wafidin = useMemo(
    () => motamadrisin.filter((s) => s.is_new),
    [motamadrisin]
  );

  const moghadirin = useMemo(
    () => data.students.filter((s) => s.switched_school),
    [data.students]
  );

  const machtobin = useMemo(
    () => data.students.filter((s) => s.is_fired),
    [data.students]
  );

  const nisfDakhili = useMemo(
    () => motamadrisin.filter((s) => s.student_status === "نصف داخلي"),
    [motamadrisin]
  );

  const otlaMaradiya = useMemo(
    () => motamadrisin.filter((s) => s.medical_leave),
    [motamadrisin]
  );

  const maafiyin = useMemo(
    () => motamadrisin.filter((s) => s.sport_inapt),
    [motamadrisin]
  );

  const contextValue = useMemo(
    () => ({
      ...data,
      motamadrisin,
      wafidin,
      moghadirin,
      machtobin,
      nisfDakhili,
      otlaMaradiya,
      maafiyin,
      refreshData: fetchData,
    }),
    [
      data,
      motamadrisin,
      wafidin,
      moghadirin,
      machtobin,
      nisfDakhili,
      otlaMaradiya,
      maafiyin,
      fetchData,
    ]
  );

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;

/**
 * Custom hook to access student context data
 * @returns Student context with filtered lists and data collections
 */
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
