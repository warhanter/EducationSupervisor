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
import { CheckCircle2, XCircle, Loader2, Trash2, Save } from "lucide-react";
import HeaderNavbar from "./HeaderNavbar";
import { supabase } from "@/lib/supabaseClient";
import { useStudents } from "@/client/providers/StudentProvider";
import _ from "lodash";
import AddTeacherDialog from "./AddTeacherDialog";
import { cn } from "@/lib/utils";

// ============================================================================
// CONSTANTS
// ============================================================================
const CLASSROOMS_PER_ROW = 8;
const TOTAL_ROWS = 2;
const TOTAL_CLASSROOMS = CLASSROOMS_PER_ROW * TOTAL_ROWS;
const TABLE_HEADERS = ["الرقم", "الأقسام", "", "الرقم", "الأقسام", ""];
const CLASSROOM_NUMBERS = Array.from(
  { length: CLASSROOMS_PER_ROW },
  (_, i) => i + 1
);

// ============================================================================
// TYPES
// ============================================================================
type ScheduleItem = {
  classroom: string;
  classroomId: string;
};

type ScheduleMap = Record<number, ScheduleItem>;

type StateMessage = {
  type: "success" | "error" | "";
  text: string;
};

export type ClassroomProfessor = {
  id: string;
  classroom_id: string;
  professor_id: string;
  classrooms: {
    id: string;
    class_full_name: string;
  };
  professors: {
    id: string;
    full_name: string;
    subjects: {
      id: string;
      subject: string;
    };
  };
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
function useScheduleManagement(
  teacherName: string,
  subjectName: string,
  classroom_professors: ClassroomProfessor[]
) {
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [selectedClassrooms, setSelectedClassrooms] = useState<Set<string>>(
    new Set()
  );

  // Load existing schedule when teacher changes
  React.useEffect(() => {
    if (!teacherName || !subjectName) {
      setSchedule({});
      setSelectedClassrooms(new Set());
      return;
    }

    const teacherAssignments = classroom_professors.filter(
      (item) =>
        item.professors.full_name === teacherName &&
        item.professors.subjects.subject === subjectName
    );

    if (teacherAssignments.length === 0) {
      setSchedule({});
      setSelectedClassrooms(new Set());
      return;
    }

    const newSchedule: ScheduleMap = {};
    const newSelected = new Set<string>();

    teacherAssignments.forEach((item, index) => {
      const slotNumber = index + 1;
      const classroomName = item.classrooms.class_full_name;

      newSchedule[slotNumber] = {
        classroom: classroomName,
        classroomId: item.classroom_id,
      };
      newSelected.add(classroomName);
    });

    setSchedule(newSchedule);
    setSelectedClassrooms(newSelected);
  }, [teacherName, subjectName, classroom_professors]);

  const updateSchedule = useCallback(
    (slotNumber: number, classroom: string, classroomId: string) => {
      setSchedule((prev) => {
        const newSchedule = { ...prev };

        // Remove old classroom from selected set
        if (newSchedule[slotNumber]?.classroom) {
          setSelectedClassrooms((prevSelected) => {
            const newSet = new Set(prevSelected);
            newSet.delete(newSchedule[slotNumber].classroom);
            return newSet;
          });
        }

        // Update schedule
        if (classroom) {
          newSchedule[slotNumber] = { classroom, classroomId };
          setSelectedClassrooms((prevSelected) => {
            const newSet = new Set(prevSelected);
            newSet.add(classroom);
            return newSet;
          });
        } else {
          delete newSchedule[slotNumber];
        }

        return newSchedule;
      });
    },
    []
  );

  const removeFromSchedule = useCallback((slotNumber: number) => {
    setSchedule((prev) => {
      const classroom = prev[slotNumber]?.classroom;
      if (classroom) {
        setSelectedClassrooms((prevSelected) => {
          const newSet = new Set(prevSelected);
          newSet.delete(classroom);
          return newSet;
        });
      }

      const { [slotNumber]: _, ...newSchedule } = prev;
      return newSchedule;
    });
  }, []);

  const clearSchedule = useCallback(() => {
    setSchedule({});
    setSelectedClassrooms(new Set());
  }, []);

  return {
    schedule,
    selectedClassrooms,
    updateSchedule,
    removeFromSchedule,
    clearSchedule,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function createLookupMaps<T extends { id: string }>(items: T[]) {
  const byId = new Map<string, T>();
  items.forEach((item) => byId.set(item.id, item));
  return byId;
}

function isSlotDisabled(slotNumber: number, selectedCount: number): boolean {
  return selectedCount + 1 !== slotNumber && selectedCount + 1 < slotNumber;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
function Isnad() {
  const [subjectName, setSubjectName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<StateMessage>({ type: "", text: "" });

  const {
    professors: teachers,
    subjects,
    classrooms,
    classroom_professors,
  } = useStudents();

  const {
    schedule,
    selectedClassrooms,
    updateSchedule,
    removeFromSchedule,
    clearSchedule,
  } = useScheduleManagement(teacherName, subjectName, classroom_professors);

  // Create lookup maps for efficient access
  const teachersByName = useMemo(() => {
    const map = new Map<string, (typeof teachers)[0]>();
    teachers.forEach((teacher) => map.set(teacher.full_name, teacher));
    return map;
  }, [teachers]);

  const classroomsByName = useMemo(() => {
    const map = new Map<string, (typeof classrooms)[0]>();
    classrooms.forEach((classroom) =>
      map.set(classroom.class_full_name, classroom)
    );
    return map;
  }, [classrooms]);

  // Get classrooms already saved for this subject
  const savedClassrooms = useMemo(
    () =>
      new Set(
        classroom_professors
          .filter((p) => p.professors.subjects.subject === subjectName)
          .map((item) => item.classrooms.class_full_name)
      ),
    [subjectName, classroom_professors]
  );

  // Available classrooms: not saved AND not currently selected
  const availableClassrooms = useMemo(
    () =>
      _.sortBy(
        classrooms.filter(
          (classroom) =>
            !savedClassrooms.has(classroom.class_full_name) &&
            !selectedClassrooms.has(classroom.class_full_name)
        ),
        "class_full_name"
      ),
    [savedClassrooms, classrooms, selectedClassrooms]
  );

  // Filter teachers by selected subject
  const filteredTeachers = useMemo(
    () => teachers.filter((t) => t.subjects.subject === subjectName),
    [teachers, subjectName]
  );

  const handleSubjectChange = useCallback(
    (value: string) => {
      setSubjectName(value);
      setTeacherName("");
      clearSchedule();
    },
    [clearSchedule]
  );

  const saveToSupabase = async () => {
    // Validation
    if (!subjectName || !teacherName) {
      setMessage({ type: "error", text: "يرجى اختيار المادة والأستاذ" });
      return;
    }

    if (Object.keys(schedule).length === 0) {
      setMessage({ type: "error", text: "يرجى اختيار قسم واحد على الأقل" });
      return;
    }

    const teacher = teachersByName.get(teacherName);
    if (!teacher) {
      setMessage({ type: "error", text: "الأستاذ المحدد غير موجود" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const professorId = teacher.id;
      const subjectId = teacher.subjects.id;

      // Prepare schedule data
      const scheduleData = Object.values(schedule).map((item) => ({
        classroom_id: item.classroomId,
        professor_id: professorId,
      }));

      // Validate all classrooms exist
      const invalidClassrooms = scheduleData.filter(
        (item) => !item.classroom_id
      );
      if (invalidClassrooms.length > 0) {
        throw new Error("بعض الأقسام المحددة غير صالحة");
      }

      // Delete existing assignments for this professor AND subject
      const { error: deleteError } = await supabase
        .from("classroom_professors")
        .delete()
        .eq("professor_id", professorId);
      // Note: Ideally we'd filter by subject too, but if your schema doesn't have
      // subject_id in classroom_professors, you'll need to adjust this

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw new Error(`فشل في حذف البيانات القديمة: ${deleteError.message}`);
      }

      // Insert new assignments
      const { data, error: insertError } = await supabase
        .from("classroom_professors")
        .insert(scheduleData)
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(`فشل في حفظ البيانات: ${insertError.message}`);
      }

      console.log("Saved successfully:", data);
      setMessage({ type: "success", text: "تم حفظ الإسناد بنجاح!" });

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      setMessage({
        type: "error",
        text: `${errorMessage}. يرجى المحاولة مرة أخرى.`,
      });
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSchedule = useCallback(() => {
    clearSchedule();
    setMessage({ type: "", text: "" });
  }, [clearSchedule]);

  return (
    <div className="flex min-h-screen w-full flex-col" dir="rtl">
      <HeaderNavbar />
      <div className="w-full mx-auto">
        <Card className="bg-white border border-gray-200 m-8 max-sm:mx-0 max-sm:my-4 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r bg-slate-800 text-white">
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">
              الإسناد
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Header Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  المادة
                </label>
                <div className="flex gap-4">
                  <Select
                    value={subjectName}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger className="w-full h-12 text-base" dir="rtl">
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject.subject}
                          value={subject.subject}
                          className="text-base"
                        >
                          {subject.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AddTeacherDialog type="subject" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  الأستاذ
                </label>
                <div className="flex gap-4">
                  <Select
                    value={teacherName}
                    onValueChange={setTeacherName}
                    disabled={!subjectName}
                  >
                    <SelectTrigger className="w-full h-12 text-base" dir="rtl">
                      <SelectValue placeholder="اختر الأستاذ" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {filteredTeachers.map((teacher) => (
                        <SelectItem
                          key={teacher.id}
                          value={teacher.full_name}
                          className="text-base"
                        >
                          {teacher.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AddTeacherDialog type="teacher" />
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r bg-slate-800">
                    {TABLE_HEADERS.map((title) => (
                      <th className="border border-slate-700 px-4 py-3 text-white font-semibold text-center w-2/12">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLASSROOM_NUMBERS.map((slotNumber) => {
                    const rightSlot = slotNumber;
                    const leftSlot = slotNumber + CLASSROOMS_PER_ROW;
                    const selectedCount = selectedClassrooms.size;

                    return (
                      <tr
                        key={slotNumber}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        {/* Right Side - Slot 1-8 */}
                        <td className="border border-gray-300 px-4 py-3 text-center bg-gray-50">
                          <span className="font-semibold text-gray-700">
                            القسم {rightSlot}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <Select
                            disabled={
                              !teacherName ||
                              isSlotDisabled(rightSlot, selectedCount)
                            }
                            value={schedule[rightSlot]?.classroom || ""}
                            onValueChange={(classroom) => {
                              const classroomData =
                                classroomsByName.get(classroom);
                              if (classroomData) {
                                updateSchedule(
                                  rightSlot,
                                  classroom,
                                  classroomData.id
                                );
                              }
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                "border-gray-300",
                                schedule[rightSlot]?.classroom
                                  ? "bg-blue-100 text-blue-800 font-semibold ring-1 ring-blue-200 hover:bg-blue-200"
                                  : "bg-transparent text-slate-700 hover:bg-slate-200/50"
                              )}
                              dir="rtl"
                            >
                              <SelectValue placeholder="...">
                                {schedule[rightSlot]?.classroom || ""}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent dir="rtl">
                              {availableClassrooms.map((classroom) => (
                                <SelectItem
                                  key={classroom.id}
                                  value={classroom.class_full_name}
                                >
                                  {classroom.class_full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <div className="flex justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={!schedule[rightSlot]}
                              onClick={() => removeFromSchedule(rightSlot)}
                              aria-label={`حذف القسم ${rightSlot}`}
                            >
                              حذف
                            </Button>
                          </div>
                        </td>

                        {/* Left Side - Slot 9-16 */}
                        <td className="border border-gray-300 px-4 py-3 text-center bg-gray-50">
                          <span className="font-semibold text-gray-700">
                            القسم {leftSlot}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <Select
                            disabled={
                              !teacherName ||
                              isSlotDisabled(leftSlot, selectedCount)
                            }
                            value={schedule[leftSlot]?.classroom || ""}
                            onValueChange={(classroom) => {
                              const classroomData =
                                classroomsByName.get(classroom);
                              if (classroomData) {
                                updateSchedule(
                                  leftSlot,
                                  classroom,
                                  classroomData.id
                                );
                              }
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                "border-gray-300",
                                schedule[leftSlot]?.classroom
                                  ? "bg-blue-100 text-blue-800 font-semibold ring-1 ring-blue-200 hover:bg-blue-200"
                                  : "bg-transparent text-slate-400 hover:bg-slate-200/50"
                              )}
                              dir="rtl"
                            >
                              <SelectValue placeholder="...">
                                {schedule[leftSlot]?.classroom || ""}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent dir="rtl">
                              {availableClassrooms.map((classroom) => (
                                <SelectItem
                                  key={classroom.id}
                                  value={classroom.class_full_name}
                                >
                                  {classroom.class_full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <div className="flex justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={!schedule[leftSlot]}
                              onClick={() => removeFromSchedule(leftSlot)}
                              aria-label={`حذف القسم ${leftSlot}`}
                            >
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                role="alert"
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

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                type="button"
                onClick={handleClearSchedule}
                disabled={loading || Object.keys(schedule).length === 0}
                className={cn(
                  "flex-1 md:w-auto h-12 text-base shadow-sm transition-all duration-300",
                  "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700",
                  Object.keys(schedule).length === 0 &&
                    "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                )}
                aria-label="مسح جميع الأقسام"
              >
                <Trash2 className="ml-2 h-5 w-5" />
                مسح الكل
              </Button>

              <Button
                onClick={saveToSupabase}
                disabled={
                  loading || !teacherName || Object.keys(schedule).length === 0
                }
                className={cn(
                  "flex-1 md:w-48 h-12 text-base shadow-lg transition-all duration-300",
                  !teacherName || Object.keys(schedule).length === 0
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-slate-700 hover:bg-slate-800 hover:shadow-blue-200"
                )}
                aria-label="حفظ الإسناد"
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

export default Isnad;
