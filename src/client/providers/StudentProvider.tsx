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
import { ClassroomProfessor } from "../assets/components/Isnad";
import { Tables } from "@/supabase/database.types";

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

// type StudentsData = {
//   students: StudentList;
//   absences: StudentList;
//   addresses: StudentList;
//   lunchAbsences: StudentList;
//   classrooms: StudentList;
//   professors: StudentList;
//   classroom_professors: ClassroomProfessor[];
//   class_programs: StudentList;
//   subjects: StudentList;
//   notification?: Notification;
//   daily_notes: DailyNoteList;
// };

/**
 * Shape of the raw data collections fetched from Supabase.
 * Some collections include joined records to avoid extra lookups in consumers.
 */
type StudentsData = {
  students: Tables<"students">[];
  absences: (Tables<"absences"> & { students: Tables<"students"> })[];
  addresses: Tables<"student_addresses">[];
  lunchAbsences: Tables<"lunch_absences">[];
  classrooms: Tables<"classrooms">[];
  professors: (Tables<"professors"> & { subjects: Tables<"subjects"> })[];
  classroom_professors: (Tables<"classroom_professors"> & {
    classrooms: Tables<"classrooms">;
  } & { professors: Tables<"professors"> } & {
    subjects: Tables<"subjects">;
  })[];
  class_programs: (Tables<"class_programs"> & {
    classrooms: Tables<"classrooms">;
  } & {
    professors: Tables<"professors"> & { subjects: Tables<"subjects"> };
  })[];
  subjects: Tables<"subjects">[];
  notification?: Notification;
  daily_notes: Tables<"daily_notes">[];
};

// type StudentContextType = StudentsData & {
//   motamadrisin: StudentList;
//   mo3idin: StudentList;
//   mamnouhin: StudentList;
//   mosadidin: StudentList;
//   wafidin: StudentList;
//   moghadirin: StudentList;
//   machtobin: StudentList;
//   nisfDakhili: StudentList;
//   otlaMaradiya: StudentList;
//   maafiyin: StudentList;
//   refreshData: () => Promise<void>;
// };

/**
 * Full context value exposed to consumers.
 * Includes raw collections + derived/filtered student groupings + refresh helper.
 */
type StudentContextType = StudentsData & {
  motamadrisin: Tables<"students">[];
  mo3idin: Tables<"students">[];
  mamnouhin: Tables<"students">[];
  mosadidin: Tables<"students">[];
  wafidin: Tables<"students">[];
  moghadirin: Tables<"students">[];
  machtobin: Tables<"students">[];
  nisfDakhili: Tables<"students">[];
  otlaMaradiya: Tables<"students">[];
  maafiyin: Tables<"students">[];
  refreshData: () => Promise<void>;
};

// Table names configuration for consistent usage across queries and subscriptions.
const TABLES = {
  CLASSROOMS: "classrooms",
  PROFESSORS: "professors",
  SUBJECTS: "subjects",
  CLASS_PROFESSORS: "classroom_professors",
  STUDENTS: "students",
  ABSENCES: "absences",
  ADDRESSES: "student_addresses",
  LUNCH_ABSENCES: "lunch_absences",
  DAILY_NOTES: "daily_notes",
} as const;

// Default context values to keep context consumers stable during initialization.
const defaultValues: StudentContextType = {
  motamadrisin: [],
  mo3idin: [],
  wafidin: [],
  mamnouhin: [],
  mosadidin: [],
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
  classroom_professors: [],
  class_programs: [],
  professors: [],
  subjects: [],
  daily_notes: [],
  notification: undefined,
  refreshData: async () => {},
};

const StudentContext = createContext<StudentContextType>(defaultValues);

/**
 * Provides student-related data and derived lists to the app.
 * - Loads initial data across multiple tables in parallel.
 * - Subscribes to realtime updates and merges them into local state.
 * - Exposes derived lists (e.g., active students, absences grouping).
 */
function StudentProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentsData>({
    students: [],
    absences: [],
    addresses: [],
    lunchAbsences: [],
    classrooms: [],
    classroom_professors: [],
    class_programs: [],
    professors: [],
    subjects: [],
    daily_notes: [],
    notification: undefined,
  });

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

  // Setup realtime subscription and initial data load.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: classrooms, error: classroomsError },
          { data: classroom_professors, error: classroom_professorsError },
          { data: class_programs, error: class_programsError },
          { data: professors, error: professorsError },
          { data: subjects, error: subjectsError },
          { data: students, error: studentsError },
          { data: absences, error: absencesError },
          { data: addresses, error: addressesError },
          { data: lunchAbsences, error: lunchAbsencesError },
          { data: daily_notes, error: daily_notesError },
        ] = await Promise.all([
          supabase.from(TABLES.CLASSROOMS).select("*"),
          supabase
            .from(TABLES.CLASS_PROFESSORS)
            .select(
              `*, classrooms (class_full_name, class_prefix), professors (full_name, subjects (subject))`
            ),
          supabase
            .from("class_programs")
            .select(
              `*, classrooms (class_full_name, class_prefix), professors(full_name, subjects (subject))`
            ),
          supabase.from(TABLES.PROFESSORS).select(`*, subjects (subject)`),
          supabase.from(TABLES.SUBJECTS).select("*"),
          supabase.from(TABLES.STUDENTS).select("*"),
          supabase
            .from(TABLES.ABSENCES)
            .select(`*, students (full_name, full_class_name)`),
          supabase.from(TABLES.ADDRESSES).select("*"),
          supabase.from(TABLES.LUNCH_ABSENCES).select("*"),
          supabase.from(TABLES.DAILY_NOTES).select("*"),
        ]);

        const errors = [
          classroomsError,
          professorsError,
          class_programsError,
          classroom_professorsError,
          subjectsError,
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
          subjects: subjects || [],
          classroom_professors: classroom_professors || [],
          class_programs: class_programs || [],
          daily_notes: daily_notes || [],
          notification: undefined,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    /**
     * Fetch a single row from a table, including joins for tables that
     * require related data. Used by realtime handlers to re-hydrate
     * records after INSERT/UPDATE.
     */
    const fetchSingleRow = async (
      table: string,
      id?: string,
      professor_id?: string,
      classroom_id?: string
    ) => {
      // NOTE: This includes minimal join logic required by current consumers.
      // Add table-specific joins here if new screens require them.
      let query = supabase.from(table).select("*");

      if (table === TABLES.ABSENCES)
        query = query.select(`*, students (full_name, full_class_name)`);
      if (table === TABLES.CLASS_PROFESSORS)
        query = query.select(
          `*, classrooms (class_full_name), professors (full_name, subjects (subject))`
        );
      if (table === "class_programs")
        query = query.select(
          `*, classrooms (class_full_name), professors (full_name, subjects (subject))`
        );
      if (table === TABLES.PROFESSORS)
        query = query.select(`*, subjects (subject)`);

      if (table === "classroom_professors") {
        const { data } = await query
          .eq("professor_id", professor_id)
          .eq("classroom_id", classroom_id)
          .single();
        console.log("classroom_professors", data);
        return data;
      } else {
        const { data } = await query.eq("id", id).single();
        return data;
      }
    };

    // 1️⃣ Subscribe to changes across tables that need live updates.
    const channel = supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "students",
        },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            setData((prev) => ({
              ...prev,
              students: [...prev.students, payload.new as Tables<"students">],
            }));
          }

          if (payload.eventType === "UPDATE") {
            setData((prev) => ({
              ...prev,
              students: prev.students.map((s: Tables<"students">) =>
                s.id === payload.new.id
                  ? (payload.new as Tables<"students">)
                  : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              students: prev.students.filter(
                (s: Student) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      // Absences changes (re-hydrate with student join).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "absences",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = await fetchSingleRow("absences", payload.new.id);
            setData((prev) => ({
              ...prev,
              absences: [...prev.absences, newItems],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = await fetchSingleRow("absences", payload.new.id);
            setData((prev) => ({
              ...prev,
              absences: prev.absences.map((s: Tables<"absences">) =>
                s.id === payload.new.id ? newItems : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              absences: prev.absences.filter(
                (s: Tables<"absences">) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      // Professors changes (re-hydrate with subjects join).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "professors",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = (await fetchSingleRow(
              "professors",
              payload.new.id
            )) as Tables<"professors"> & { subjects: Tables<"subjects">[] };
            console.log("professors", newItems);
            setData((prev) => ({
              ...prev,
              professors: [
                ...prev.professors,
                newItems as Tables<"professors"> & {
                  subjects: Tables<"subjects">[];
                },
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = (await fetchSingleRow(
              "professors",
              payload.new.id
            )) as Tables<"professors"> & { subjects: Tables<"subjects">[] };
            setData((prev) => ({
              ...prev,
              professors: prev.professors.map(
                (
                  s: Tables<"professors"> & { subjects: Tables<"subjects">[] }
                ) =>
                  s.id === payload.new.id
                    ? (newItems as Tables<"professors"> & {
                        subjects: Tables<"subjects">[];
                      })
                    : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              professors: prev.professors.filter(
                (
                  s: Tables<"professors"> & { subjects: Tables<"subjects">[] }
                ) => s.id !== payload.old.id
              ) as (Tables<"professors"> & {
                subjects: Tables<"subjects">[];
              })[],
            }));
          }
        }
      )
      // Subjects changes (simple CRUD updates).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "subjects",
        },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            setData((prev) => ({
              ...prev,
              subjects: [...prev.subjects, payload.new as Tables<"subjects">],
            }));
          }

          if (payload.eventType === "UPDATE") {
            setData((prev) => ({
              ...prev,
              subjects: prev.subjects.map((s: Tables<"subjects">) =>
                s.id === payload.new.id
                  ? (payload.new as Tables<"subjects">)
                  : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              subjects: prev.subjects.filter(
                (s: Tables<"subjects">) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      // Classroom-professor assignments (re-hydrate with classroom/professor joins).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "classroom_professors",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = await fetchSingleRow(
              "classroom_professors",
              undefined,
              payload.new.professor_id,
              payload.new.classroom_id
            );
            setData((prev) => ({
              ...prev,
              classroom_professors: [
                ...prev.classroom_professors,
                newItems as Tables<"classroom_professors"> & {
                  classrooms: Tables<"classrooms">[];
                } & {
                  professors: (Tables<"professors"> & {
                    subjects: Tables<"subjects">[];
                  })[];
                },
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = await fetchSingleRow(
              "classroom_professors",
              undefined,
              payload.new.professor_id,
              payload.new.classroom_id
            );
            setData((prev) => ({
              ...prev,
              classroom_professors: prev.classroom_professors.map(
                (
                  s: Tables<"classroom_professors"> & {
                    classrooms: Tables<"classrooms">[];
                  } & {
                    professors: (Tables<"professors"> & {
                      subjects: Tables<"subjects">[];
                    })[];
                  }
                ) =>
                  s.created_at === payload.new.created_at
                    ? (newItems as Tables<"classroom_professors"> & {
                        classrooms: Tables<"classrooms">[];
                      } & {
                        professors: (Tables<"professors"> & {
                          subjects: Tables<"subjects">[];
                        })[];
                      })
                    : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              classroom_professors: prev.classroom_professors.filter(
                (
                  s: Tables<"classroom_professors"> & {
                    classrooms: Tables<"classrooms">[];
                  } & {
                    professors: (Tables<"professors"> & {
                      subjects: Tables<"subjects">[];
                    })[];
                  }
                ) =>
                  s.professor_id !== payload.old.professor_id &&
                  s.classroom_id !== payload.old.classroom_id
              ) as (Tables<"classroom_professors"> & {
                classrooms: Tables<"classrooms">[];
              } & {
                professors: (Tables<"professors"> & {
                  subjects: Tables<"subjects">[];
                })[];
              })[],
            }));
          }
        }
      )
      // Class programs changes (no joins here, single-table data).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "class_programs",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = await fetchSingleRow(
              "class_programs",
              payload.new.id
            );
            setData((prev) => ({
              ...prev,
              class_programs: [
                ...prev.class_programs,
                newItems as Tables<"class_programs">,
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = await fetchSingleRow(
              "class_programs",
              payload.new.id
            );
            setData((prev) => ({
              ...prev,
              class_programs: prev.class_programs.map(
                (s: Tables<"class_programs">) =>
                  s.id === payload.new.id
                    ? (newItems as Tables<"class_programs">)
                    : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              class_programs: prev.class_programs.filter(
                (s: Tables<"class_programs">) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      // Lunch absences changes (simple CRUD updates).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "lunch_absences",
        },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            setData((prev) => ({
              ...prev,
              lunchAbsences: [
                ...prev.lunchAbsences,
                payload.new as Tables<"lunch_absences">,
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            setData((prev) => ({
              ...prev,
              lunchAbsences: prev.lunchAbsences.map(
                (s: Tables<"lunch_absences">) =>
                  s.id === payload.new.id
                    ? (payload.new as Tables<"lunch_absences">)
                    : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              lunchAbsences: prev.lunchAbsences.filter(
                (s: Tables<"lunch_absences">) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      // Daily notes changes (simple CRUD updates).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "daily_notes",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = await fetchSingleRow(
              "daily_notes",
              payload.new.id
            );
            setData((prev) => ({
              ...prev,
              daily_notes: [
                ...prev.daily_notes,
                newItems as Tables<"daily_notes">,
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = await fetchSingleRow(
              "daily_notes",
              payload.new.id
            );
            setData((prev) => ({
              ...prev,
              daily_notes: prev.daily_notes.map((s: Tables<"daily_notes">) =>
                s.id === payload.new.id
                  ? (newItems as Tables<"daily_notes">)
                  : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              daily_notes: prev.daily_notes.filter(
                (s: Tables<"daily_notes">) =>
                  s.id !== payload.old.id &&
                  s.report_date !== payload.old.report_date
              ),
            }));
          }
        }
      )
      // Student addresses changes (simple CRUD updates).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "student_addresses",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = await fetchSingleRow(
              "student_addresses",
              payload.new.id
            );
            setData((prev) => ({
              ...prev,
              addresses: [
                ...prev.addresses,
                newItems as Tables<"student_addresses">,
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = await fetchSingleRow(
              "student_addresses",
              payload.new.id
            );
            setData((prev) => ({
              ...prev,
              addresses: prev.addresses.map((s: Tables<"student_addresses">) =>
                s.id === payload.new.id
                  ? (newItems as Tables<"student_addresses">)
                  : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              addresses: prev.addresses.filter(
                (s: Tables<"student_addresses">) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      // Classrooms changes (simple CRUD updates).
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "classrooms",
        },
        async (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT") {
            const newItems = await fetchSingleRow("classrooms", payload.new.id);
            setData((prev) => ({
              ...prev,
              classrooms: [
                ...prev.classrooms,
                newItems as Tables<"classrooms">,
              ],
            }));
          }

          if (payload.eventType === "UPDATE") {
            const newItems = await fetchSingleRow("classrooms", payload.new.id);
            setData((prev) => ({
              ...prev,
              classrooms: prev.classrooms.map((s: Tables<"classrooms">) =>
                s.id === payload.new.id ? (newItems as Tables<"classrooms">) : s
              ),
            }));
          }

          if (payload.eventType === "DELETE") {
            setData((prev) => ({
              ...prev,
              classrooms: prev.classrooms.filter(
                (s: Tables<"classrooms">) => s.id !== payload.old.id
              ),
            }));
          }
        }
      )
      .subscribe();

    // 2️⃣ Cleanup when component unmounts.
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Define the mapping between DB tables and your State keys
  // 'hasJoins' flags tables where raw realtime data isn't enough (needs re-fetch)
  // const REALTIME_CONFIG = [
  //   { table: "students", key: "students" },
  //   { table: "subjects", key: "subjects" },
  //   { table: "addresses", key: "addresses" },
  //   { table: "lunch_absences", key: "lunchAbsences" },
  //   { table: "daily_notes", key: "daily_notes" },
  //   // Tables usually requiring joins (Foreign Keys):
  //   { table: "absences", key: "absences", hasJoins: true },
  //   { table: "professors", key: "professors", hasJoins: true },
  //   {
  //     table: "classroom_professors",
  //     key: "classroom_professors",
  //     hasJoins: true,
  //   },
  // ];

  // const fetchData = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     // Use Promise.allSettled if you want to prevent one failure from blocking all data
  //     // However, keeping Promise.all as per your logic:
  //     const results = await Promise.all([
  //       supabase.from(TABLES.CLASSROOMS).select("*"),
  //       supabase
  //         .from(TABLES.CLASS_PROFESSORS)
  //         .select(
  //           `*, classrooms (class_full_name), professors (full_name, subjects (subject))`
  //         ),
  //       supabase.from(TABLES.PROFESSORS).select(`*, subjects (subject)`),
  //       supabase.from(TABLES.SUBJECTS).select("*"),
  //       supabase.from(TABLES.STUDENTS).select("*"),
  //       supabase
  //         .from(TABLES.ABSENCES)
  //         .select(`*, students (full_name, full_class_name)`),
  //       supabase.from(TABLES.ADDRESSES).select("*"),
  //       supabase.from(TABLES.LUNCH_ABSENCES).select("*"),
  //       supabase.from(TABLES.DAILY_NOTES).select("*"),
  //     ]);

  //     // Destructure results based on index to keep it clean
  //     const [
  //       classrooms,
  //       classroom_professors,
  //       professors,
  //       subjects,
  //       students,
  //       absences,
  //       addresses,
  //       lunchAbsences,
  //       daily_notes,
  //     ] = results;

  //     // Check for any errors in the batch
  //     const errors = results.map((r) => r.error).filter(Boolean);
  //     if (errors.length > 0) console.error("Errors fetching data:", errors);

  //     setData({
  //       classrooms: classrooms.data || [],
  //       classroom_professors: classroom_professors.data || [],
  //       professors: professors.data || [],
  //       subjects: subjects.data || [],
  //       students: students.data || [],
  //       absences: absences.data || [],
  //       addresses: addresses.data || [],
  //       lunchAbsences: lunchAbsences.data || [],
  //       daily_notes: daily_notes.data || [],
  //       notification: undefined,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchData();

  //   const channel = supabase.channel("global-changes");

  //   // helper to fetch a single row with joins (needed for complex tables)
  //   const fetchSingleRow = async (table, id) => {
  //     // You need to implement specific queries here based on the table
  //     // This is a simplified example logic
  //     let query = supabase.from(table).select("*");

  //     if (table === TABLES.ABSENCES)
  //       query = query.select(`*, students (full_name, full_class_name)`);
  //     if (table === TABLES.CLASS_PROFESSORS)
  //       query = query.select(
  //         `*, classrooms (class_full_name), professors (full_name, subjects (subject))`
  //       );
  //     if (table === TABLES.PROFESSORS)
  //       query = query.select(`*, subjects (subject)`);

  //     const { data } = await query.eq("id", id).single();
  //     return data;
  //   };

  //   // Loop through config to generate listeners
  //   REALTIME_CONFIG.forEach(({ table, key, hasJoins }) => {
  //     channel.on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: table },
  //       async (payload) => {
  //         console.log(`Change received for ${table}:`, payload);

  //         let newItem = payload.new;

  //         // HANDLE DELETE
  //         if (payload.eventType === "DELETE") {
  //           setData((prev) => ({
  //             ...prev,
  //             [key]: prev[key].filter((item) => item.id !== payload.old.id),
  //           }));
  //           return;
  //         }

  //         // HANDLE INSERT/UPDATE (FETCH JOINS IF NEEDED)
  //         if (
  //           hasJoins &&
  //           (payload.eventType === "INSERT" || payload.eventType === "UPDATE")
  //         ) {
  //           const populatedData = await fetchSingleRow(table, payload.new.id);
  //           if (populatedData) newItem = populatedData;
  //         }

  //         // UPDATE STATE
  //         setData((prev) => {
  //           const currentList = prev[key] || [];

  //           if (payload.eventType === "INSERT") {
  //             return { ...prev, [key]: [...currentList, newItem] };
  //           }

  //           if (payload.eventType === "UPDATE") {
  //             return {
  //               ...prev,
  //               [key]: currentList.map((item) =>
  //                 item.id === newItem.id ? newItem : item
  //               ),
  //             };
  //           }
  //           return prev;
  //         });
  //       }
  //     );
  //   });

  //   channel.subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [fetchData]);

  /**
   * Manual refresh helper exposed to consumers.
   * Re-fetches all collections without toggling the top-level loading state.
   */
  const fetchDataManual = useCallback(async () => {
    try {
      const [
        { data: classrooms },
        { data: classroom_professors },
        { data: class_programs },
        { data: professors },
        { data: subjects },
        { data: students },
        { data: absences },
        { data: addresses },
        { data: lunchAbsences },
        { data: daily_notes },
      ] = await Promise.all([
        supabase.from(TABLES.CLASSROOMS).select("*"),
        supabase
          .from(TABLES.CLASS_PROFESSORS)
          .select(
            `*, classrooms (class_full_name), professors (full_name, subjects (subject))`
          ),
        supabase.from("class_programs").select("*"),
        supabase.from(TABLES.PROFESSORS).select(`*, subjects (subject)`),
        supabase.from(TABLES.SUBJECTS).select("*"),
        supabase.from(TABLES.STUDENTS).select("*"),
        supabase
          .from(TABLES.ABSENCES)
          .select(`*, students (full_name, full_class_name)`),
        supabase.from(TABLES.ADDRESSES).select("*"),
        supabase.from(TABLES.LUNCH_ABSENCES).select("*"),
        supabase.from(TABLES.DAILY_NOTES).select("*"),
      ]);

      setData({
        students: students || [],
        absences: absences || [],
        addresses: addresses || [],
        lunchAbsences: lunchAbsences || [],
        classrooms: classrooms || [],
        professors: professors || [],
        subjects: subjects || [],
        classroom_professors: classroom_professors || [],
        class_programs: class_programs || [],
        daily_notes: daily_notes || [],
        notification: undefined,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Computed/filtered student lists using useMemo for performance.
  const motamadrisin = useMemo(
    () => data.students.filter((s) => !s.is_fired && !s.switched_school),
    [data.students]
  );

  const wafidin = useMemo(
    () => motamadrisin.filter((s) => s.is_new),
    [motamadrisin]
  );
  const mo3idin = useMemo(
    () => motamadrisin.filter((s) => s.i3ada),
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
  const mamnouhin = useMemo(
    () =>
      motamadrisin.filter(
        (s) => s.student_status === "نصف داخلي" && s.is_mamnouh
      ),
    [motamadrisin]
  );
  const mosadidin = useMemo(
    () =>
      motamadrisin.filter(
        (s) => s.student_status === "نصف داخلي" && !s.is_mamnouh
      ),
    [motamadrisin]
  );

  /**
   * Sorts active students by absence date (most recent first).
   * Used by attendance/absence screens that need a stable ordering.
   */
  const markAbsenceData = useMemo(
    () =>
      motamadrisin.sort((a, b) => {
        if (!a.absence_date) return 1;
        if (!b.absence_date) return -1;
        return (
          new Date(b.absence_date).getTime() -
          new Date(a.absence_date).getTime()
        );
      }),

    [motamadrisin]
  );

  // Memoize the full context value to avoid needless re-renders.
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
      mo3idin,
      mamnouhin,
      mosadidin,
      refreshData: fetchDataManual,
      markAbsenceData,
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
      mo3idin,
      mamnouhin,
      mosadidin,
      fetchDataManual,
      markAbsenceData,
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
}

export default StudentProvider;

/**
 * Custom hook to access student context data.
 * Throws if used outside the provider to prevent silent failures.
 * @returns Student context with raw collections and derived lists.
 */
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
