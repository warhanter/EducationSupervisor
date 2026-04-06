import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { processAbsenceData } from "../utils/absenceUtils";
import type { AbsenceRecord, ProcessedStudent } from "../utils/absenceUtils";

interface UseAbsenceDataReturn {
  holidays: any[] | null;
  classPrograms: any[] | null;
  absenceStudents: ProcessedStudent[];
  rawAbsences: AbsenceRecord[] | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch all absence-related data from Supabase
 */
export const useAbsenceData = (): UseAbsenceDataReturn => {
  const [holidays, setHolidays] = useState<any[] | null>(null);
  const [classPrograms, setClassPrograms] = useState<any[] | null>(null);
  const [absenceStudents, setAbsenceStudents] = useState<ProcessedStudent[]>([]);
  const [rawAbsences, setRawAbsences] = useState<AbsenceRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch holidays
        const { data: holidaysData, error: holidaysError } = await supabase
          .from("calendar_events")
          .select("*");

        if (holidaysError) {
          console.error("Error fetching holidays:", holidaysError);
          throw new Error("Failed to fetch holidays");
        }

        // Fetch classroom with program and professor details
        // const { data: classProgramData, error: classProgramError } =
        //   await supabase.from("classrooms").select(`
        //     *,
        //     program:class_programs!classrooms_class_program_fkey (
        //       *,
        //       module:professors!class_programs_professor_fkey (*)
        //     )
        //   `);

        // Fetch classroom with program and professor details (JOIN equivalent)
        const { data: classProgramData, error: classProgramError } =
          await supabase.from("classrooms").select(`
            *,
            program:class_programs!classrooms_class_program_fkey (
              *,
              module:professors!class_programs_professor_fkey (*)
            )
          `);

        if (classProgramError) {
          console.error("Error fetching class program:", classProgramError);
        }

        // if (classProgramError) {
        //   console.error("Error fetching class program:", classProgramError);
        //   throw new Error("Failed to fetch class programs");
        // }

        // Fetch all absences with student details
        const { data: absencesData, error: absencesError } = await supabase
          .from("absences")
          .select("*")
          .order("student_id");

        if (absencesError) {
          console.error("Error fetching absences:", absencesError);
          throw new Error("Failed to fetch absences");
        }

        // Process absences data
        const processedStudents = processAbsenceData(absencesData || []);

        setHolidays(holidaysData);
        setClassPrograms(classProgramData);
        setAbsenceStudents(processedStudents);
        setRawAbsences(absencesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    holidays,
    classPrograms,
    absenceStudents,
    rawAbsences,
    loading,
    error,
  };
};

/**
 * Get program for a specific class
 */
export const useClassProgram = (
  classPrograms: any[] | null,
  className: string
) => {
  if (!classPrograms || !className) return null;
  
  return classPrograms.find((cp) => cp.class_fullName === className)?.program || null;
};
