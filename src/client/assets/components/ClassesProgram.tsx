import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  Save,
  PlusCircle,
} from "lucide-react";
import HeaderNavbar from "./HeaderNavbar";
import { useStudents } from "@/client/providers/StudentProvider";
import _ from "lodash";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type scheduleItem = {
  day: string;
  hour: number;
  classroom_id: string;
  professor_id: string;
  subject: string;
};

type scheduleKey = `${string}-${number}`;

type ScheduleMap = Map<scheduleKey, scheduleItem>;

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const HOURS = Array.from({ length: 8 }, (_, i) => i + 1);

function ClassProgramForm() {
  const [classroom, setClassroom] = useState<string>("");
  const [schedule, setSchedule] = useState<Map<scheduleKey, scheduleItem>>(
    new Map()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const { classrooms, classroom_professors, class_programs } = useStudents();

  const classProgrmas = useMemo(
    () =>
      classroom_professors.filter(
        (program) => program.classrooms.class_full_name === classroom
      ),
    [classroom]
  );

  const savedClassPrograms = useMemo(
    () =>
      class_programs.filter(
        (program) => program.classrooms.class_full_name === classroom
      ),
    [classroom]
  );

  const subjectToProfessorMap = useMemo(() => {
    const map: Map<string, { classroom_id: string; professor_id: string }> =
      new Map();
    classProgrmas.forEach((program) => {
      map.set(program.professors.subjects.subject, {
        classroom_id: program.classroom_id,
        professor_id: program.professor_id,
      });
    });
    return map;
  }, [classProgrmas]);

  const getScheduleKey = (day: string, hour: number): scheduleKey =>
    `${day}-${hour}`;

  React.useEffect(() => {
    if (savedClassPrograms.length === 0) {
      setSchedule(new Map());
      setMessage({ type: "", text: "" });
      return;
    }

    const scheduleData: ScheduleMap = new Map();
    savedClassPrograms.forEach((program) => {
      const key: scheduleKey = getScheduleKey(program.day, program.hour);
      scheduleData.set(key, {
        day: program.day,
        hour: program.hour,
        classroom_id: program.classroom_id,
        professor_id: program.professor_id,
        subject: program.professors.subjects.subject,
      });
    });
    setSchedule(scheduleData);
  }, [savedClassPrograms]);

  const updateSchedule = useCallback(
    ({
      day,
      hour,
      subject,
    }: {
      day: string;
      hour: number;
      subject: string;
    }) => {
      const professorData = subjectToProfessorMap.get(subject);
      if (!professorData) {
        setMessage({ type: "error", text: "لم يتم العثور على بيانات الأستاذ" });
        return;
      }

      const key = getScheduleKey(day, hour);
      setSchedule((prev) => {
        const newSchedule = new Map(prev);
        newSchedule.set(key, {
          day: day,
          hour: hour,
          classroom_id: professorData.classroom_id,
          professor_id: professorData.professor_id,
          subject: subject,
        });
        return newSchedule;
      });
    },
    [subjectToProfessorMap]
  );

  const removeScheduleEntry = useCallback((day: string, hour: number) => {
    const key = getScheduleKey(day, hour);
    setSchedule((prev) => {
      const newSchedule = new Map(prev);
      newSchedule.delete(key);
      return newSchedule;
    });
  }, []);

  const validateSchedule = (): string | null => {
    if (!classroom) {
      return "يرجى اختيار القسم";
    }
    if (schedule.size === 0) {
      return "يرجى ملء البرنامج";
    }

    // Check for professor conflicts (same professor at same time on same day)
    const timeSlots = new Map<string, Set<string>>();
    for (const entry of schedule.values()) {
      const timeKey = `${entry.day}-${entry.hour}`;
      if (!timeSlots.has(timeKey)) {
        timeSlots.set(timeKey, new Set());
      }
      const professors = timeSlots.get(timeKey)!;
      if (professors.has(entry.professor_id)) {
        return `تعارض في البرنامج: نفس الأستاذ في ${entry.day} الساعة ${entry.hour}`;
      }
      professors.add(entry.professor_id);
    }

    return null;
  };

  const saveToSupabase = async () => {
    const validationError = validateSchedule();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const classroomId = Array.from(schedule.values())[0]?.classroom_id;
      if (!classroomId) {
        throw new Error("معرف القسم غير صحيح");
      }

      console.log("classroomId: ", classroomId);

      const { data, error: deleteError } = await supabase
        .from("class_programs")
        .delete()
        .eq("classroom_id", classroomId)
        .select();

      console.warn("deleted Rows: ", data);
      if (deleteError) throw deleteError;

      const scheduleData = Array.from(schedule.values()).map(
        ({ subject, ...rest }) => rest
      );
      const { error: insertError } = await supabase
        .from("class_programs")
        .insert(scheduleData);

      if (insertError) throw insertError;

      setMessage({ type: "success", text: "تم حفظ البرنامج بنجاح!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
      });
      console.error("Error saving schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSchedule = useCallback(() => {
    setSchedule(new Map());
    setMessage({ type: "", text: "" });
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col" dir="rtl">
      <HeaderNavbar />
      <div className="w-full mx-auto">
        <Card className="w-full bg-white border border-gray-200 m-8 max-sm:mx-0 max-sm:my-4 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r bg-slate-800 text-white">
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">
              التوزيع الزمني
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Header Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  القسم
                </label>
                <Select value={classroom} onValueChange={setClassroom}>
                  <SelectTrigger className="w-full h-12 text-base" dir="rtl">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {_.sortBy(classrooms, "class_full_name").map(
                      (classroom) => (
                        <SelectItem
                          key={classroom.class_full_name}
                          value={classroom.class_full_name}
                          className="text-base"
                        >
                          {classroom.class_full_name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {classroom && (
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      المواد المتاحة:{" "}
                      <span className="font-bold text-blue-600">
                        {classProgrmas.length}
                      </span>
                    </label>
                  </div>
                  <Button className="h-12" variant={"outline"} asChild>
                    <div className="flex gap-4">
                      <Link to={"/isnad"}>إضافة مادة</Link>
                      <PlusCircle />
                    </div>
                  </Button>
                </div>
              )}
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r bg-slate-800">
                    <th className="border border-slate-700 px-4 py-3 text-white font-semibold text-center">
                      الساعة
                    </th>
                    {DAYS.map((day) => (
                      <th className="border border-slate-700 px-4 py-3 text-white font-semibold text-center">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((hour) => (
                    <tr
                      key={hour}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="border border-gray-300 px-4 py-3 text-center bg-gray-50">
                        <span className="font-semibold text-gray-700">
                          {hour}
                        </span>
                      </td>
                      {DAYS.map((day, _) => {
                        const key = getScheduleKey(day, hour);
                        const entry = schedule.get(key);
                        const subject = entry?.subject;
                        return (
                          <td
                            key={`${day}-${hour}`}
                            className="border border-gray-300 px-2 py-2"
                          >
                            <div className="flex gap-2">
                              <Select
                                disabled={classroom === "" ? true : false}
                                value={subject || ""}
                                onValueChange={(subject) =>
                                  updateSchedule({
                                    day,
                                    hour,
                                    subject,
                                  })
                                }
                              >
                                <SelectTrigger
                                  // className={` border-gray-300 ${
                                  //   subject ? "bg-teal-300" : undefined
                                  // }`}
                                  className={cn(
                                    "border-gray-300",
                                    subject
                                      ? "bg-blue-100 text-blue-800 font-semibold ring-1 ring-blue-200 hover:bg-blue-200"
                                      : "bg-transparent text-slate-400 hover:bg-slate-200/50"
                                  )}
                                  dir="rtl"
                                >
                                  <SelectValue placeholder="" />
                                </SelectTrigger>
                                {/* <SelectTrigger
                                  className={cn(
                                    "w-full h-9 border-0 shadow-none transition-all duration-200",
                                    subject
                                      ? "bg-blue-100 text-blue-800 font-semibold ring-1 ring-blue-200 hover:bg-blue-200"
                                      : "bg-transparent text-slate-400 hover:bg-slate-200/50"
                                  )}
                                  dir="rtl"
                                >
                                  <SelectValue placeholder="-" />
                                </SelectTrigger> */}
                                <SelectContent dir="rtl">
                                  {classProgrmas.map((program) => (
                                    <SelectItem
                                      key={program.professors.subjects.subject}
                                      value={
                                        program.professors.subjects.subject
                                      }
                                    >
                                      {program.professors.subjects.subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {subject && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeScheduleEntry(day, hour)}
                                  className="py-1 px-2 h-auto hover:bg-red-100"
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Message Alert */}
            {message.text && (
              <Alert
                className={`mb-4 ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <AlertDescription
                    className={
                      message.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }
                  >
                    {message.text}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="flex items-center gap-3 w-full md:w-auto order-1 md:order-2">
              <Button
                type="button"
                onClick={clearSchedule}
                disabled={loading || !classroom || schedule.size === 0}
                className={cn(
                  "flex-1 md:w-auto h-12 text-base shadow-sm transition-all duration-300",
                  "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700",
                  (!classroom || schedule.size === 0) &&
                    "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                )}
              >
                <Trash2 className="ml-2 h-5 w-5" />
                مسح الكل
              </Button>

              <Button
                onClick={saveToSupabase}
                disabled={loading || !classroom}
                className={cn(
                  "flex-1 md:w-48 h-12 text-base shadow-lg transition-all duration-300",
                  !classroom
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-slate-700 hover:bg-slate-800  hover:shadow-blue-200"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    حفظ البرنامج
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ClassProgramForm;
