import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { Search, X, Clock, Filter, Users, Printer } from "lucide-react";

import HeaderNavbar from "./HeaderNavbar";
import { calculateMissedHours } from "@/client/functions/calcMissedHours";
// import { calculateMissedHours } from "@/utils/calculateMissedHours";
import { Tables } from "@/types/database.types";


interface StudentTotalAbsence {
  id: number;
  fullName: string;
  classAbbreviation: string;
  totalHours: number;
}

const TRIMESTERS = [
  { label: "الفصل الأول", value: 1 },
  { label: "الفصل الثاني", value: 2 },
  { label: "الفصل الثالث", value: 3 },
];

const DebouncedSearch = ({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) => {
  const [localQuery, setLocalQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery, onSearch]);

  return (
    <div className="relative flex items-center flex-1">
      <Search className="absolute right-3 h-5 w-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        className="w-full pr-10 pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-right"
        placeholder="بحث عن تلميذ..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        autoCorrect="off"
      />
      {localQuery.length > 0 && (
        <button
          onClick={() => setLocalQuery("")}
          className="absolute left-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default function TotalAbsencesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<number | null>(
    null,
  );

  const [studentsData, setStudentsData] = useState<Tables<"students">[] | null>(null);
  const [absencesData, setAbsencesData] = useState<Tables<"absences">[] | null>(null);
  const [schoolsData, setSchoolsData] = useState<Tables<"schools">[] | null>(null);
  const [holidays, setHolidays] = useState<Tables<"calendar_events">[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [
        { data: students, error: studentsError },
        { data: absences, error: absencesError },
        { data: schools, error: schoolsError },
        { data: events, error: holidaysError },
      ] = await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("absences").select("*").order("student_id"),
        supabase.from("schools").select("*"),
        supabase.from("calendar_events").select("*"),
      ]);

      if (studentsError) console.error("Error fetching students:", studentsError);
      else setStudentsData(students);

      if (absencesError) console.error("Error fetching absences:", absencesError);
      else setAbsencesData(absences);

      if (schoolsError) console.error("Error fetching schools:", schoolsError);
      else setSchoolsData(schools);

      if (holidaysError) console.error("Error fetching holidays:", holidaysError);
      else setHolidays(events);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const activeSchool = useMemo(() => {
    return schoolsData && schoolsData.length > 0 ? schoolsData[0] : null;
  }, [schoolsData]);

  console.log(holidays);

  // Derive the aggregated data
  const aggregatedData = useMemo(() => {
    if (!studentsData || !absencesData) return [];

    const studentTotals: Record<number, StudentTotalAbsence> = {};

    // Initialize all students with 0 hours
    studentsData.forEach((student) => {
      studentTotals[student.id] = {
        id: student.id,
        fullName: student.full_name || "",
        classAbbreviation: student.class_abbreviation || "غير محدد",
        totalHours: 0,
      };
    });

    // Determine the active trimesters bounds if set
    const t1Start = activeSchool?.first_trimester
      ? new Date(activeSchool.first_trimester).getTime()
      : null;
    const t2Start = activeSchool?.second_trimester
      ? new Date(activeSchool.second_trimester).getTime()
      : null;
    const t3Start = activeSchool?.third_trimester
      ? new Date(activeSchool.third_trimester).getTime()
      : null;

    // Sum up the missed hours from absences
    absencesData.forEach((absence) => {
      if (absence.student_id && absence.missed_hours) {
        let isWithinTrimester = true;

        // If a trimester is selected, we perform date filtering
        if (selectedTrimester !== null && absence.date_of_absence) {
          const absenceTime = new Date(absence.date_of_absence).getTime();

          if (!Number.isNaN(absenceTime)) {
            if (selectedTrimester === 1) {
              isWithinTrimester =
                (t1Start ? absenceTime >= t1Start : true) &&
                (t2Start ? absenceTime < t2Start : true);
            } else if (selectedTrimester === 2) {
              isWithinTrimester =
                (t2Start ? absenceTime >= t2Start : true) &&
                (t3Start ? absenceTime < t3Start : true);
            } else if (selectedTrimester === 3) {
              isWithinTrimester = t3Start ? absenceTime >= t3Start : true;
            }
          }
        }

       if (isWithinTrimester && studentTotals[absence.student_id] && absence.date_of_absence && absence.date_of_return && holidays) {
          // Recalculate missed hours using the utility function
          const startDate = new Date(absence.date_of_absence);
          const endDate = absence.date_of_return
            ? new Date(absence.date_of_return)
            : new Date();
          const result = calculateMissedHours(startDate, endDate, holidays ?? []);
          studentTotals[absence.student_id].totalHours += result.totalHours;
        }
      }
    });

    return Object.values(studentTotals);
  }, [studentsData, absencesData, selectedTrimester, activeSchool, holidays]);

  // Get unique classes for the filter
  const availableClasses = useMemo(() => {
    const classes = new Set<string>();
    aggregatedData.forEach((student) => {
      if (student.classAbbreviation) {
        classes.add(student.classAbbreviation);
      }
    });
    return Array.from(classes).sort();
  }, [aggregatedData]);

  // Apply filters
  const filteredData = useMemo(() => {
    return aggregatedData
      .filter((student) => {
        const matchesSearch = student.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass
          ? student.classAbbreviation === selectedClass
          : true;

        // Only show students who actually have missed hours greater than 0
        return matchesSearch && matchesClass && student.totalHours > 0;
      })
      .sort((a, b) => b.totalHours - a.totalHours);
  }, [aggregatedData, searchQuery, selectedClass]);

  // Summary stats
  const totalStudentsWithAbsences = filteredData.length;
  const totalMissedHours = filteredData.reduce(
    (sum, s) => sum + s.totalHours,
    0,
  );

  return (
    <div className="flex min-h-screen w-full flex-col" dir="rtl">
      <HeaderNavbar />
      <div className="bg-white border border-gray-200 m-8 max-sm:mx-0 max-sm:my-4 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
        <div className="bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r bg-slate-800 text-white">
            <div className="flex justify-center items-center p-6">
              <h1 className="text-2xl md:text-3xl text-center font-bold">
                مجموع الساعات الضائعة
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Filters Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                البحث والتصفية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Search */}
                <DebouncedSearch onSearch={setSearchQuery} />

                {/* Trimester Filter */}
                <div>
                  <select
                    value={selectedTrimester?.toString() ?? ""}
                    onChange={(e) =>
                      setSelectedTrimester(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    className="w-full bg-white px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">كل الفصول</option>
                    {TRIMESTERS.map((trimester) => (
                      <option
                        key={trimester.value}
                        value={trimester.value.toString()}
                      >
                        {trimester.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Classes Filter */}
                <div>
                  <select
                    value={selectedClass ?? ""}
                    onChange={(e) =>
                      setSelectedClass(
                        e.target.value === "" ? null : e.target.value,
                      )
                    }
                    className="w-full bg-white px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">كل الأقسام</option>
                    {availableClasses.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Summary Stats & Print Button */}
            <div className="flex items-center gap-3 mb-6 flex-wrap print:hidden">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-sm text-blue-600 font-medium">
                  المتغيبون:
                </span>
                <span className="text-sm font-bold text-blue-800">
                  {totalStudentsWithAbsences}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-sm text-red-600 font-medium">
                  الساعات الضائعة:
                </span>
                <span className="text-sm font-bold text-red-800">
                  {totalMissedHours} سا
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm mr-auto"
              >
                <Printer className="w-4 h-4" />
                طباعة
              </button>
            </div>

            {/* Results Table */}
            <div id="section-to-print" className="border border-gray-200 rounded-lg overflow-hidden print:border-none print:rounded-none">
              {/* Print-only header */}
              <div className="hidden print:block text-center mb-4 pt-4">
                <h2 className="text-xl font-bold">مجموع الساعات الضائعة</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTrimester
                    ? TRIMESTERS.find((t) => t.value === selectedTrimester)?.label
                    : "كل الفصول"}
                  {selectedClass ? ` — ${selectedClass}` : ""}
                  {` — المتغيبون: ${totalStudentsWithAbsences} — الساعات: ${totalMissedHours} سا`}
                </p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-16">
                      الرقم
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      الاسم واللقب
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                      القسم
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-40">
                      الساعات الضائعة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-base text-gray-500">جاري تحميل البيانات...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-800">
                            {item.fullName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500">
                            {item.classAbbreviation}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="destructive"
                            className="min-w-[70px] justify-center text-sm"
                          >
                            {item.totalHours}{" "}
                            {"سا"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center">
                        <p className="text-base text-gray-400">
                          {searchQuery || selectedClass
                            ? "لا توجد نتائج للبحث"
                            : "لا توجد غيابات مسجلة"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
