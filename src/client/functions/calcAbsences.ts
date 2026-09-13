import { isBetween } from "@/utils/utils/dateHelpers";
import { supabase } from "@/lib/supabaseClient";

export async function calcAbsences(studentID, studentClass) {
  Date.prototype.between = function (start: Date, end: Date) {
    return this.getTime() >= start.getTime() && this.getTime() <= end.getTime();
  };

  const [holidaysRes, studentsRes, absencesRes, classroomsRes] =
    await Promise.all([
      supabase.from("calendar_events").select("start_date, end_date"),
      supabase.from("students").select("id, is_fired"),
      supabase
        .from("absences")
        .select(
          "student_id, date_of_absence, date_of_return, full_name, missed_hours, justified_missed_hours",
        ),
      supabase.from("classrooms").select(`
        class_full_name,
        program:class_programs (
          day,
          hour,
          module:professors ( full_name )
        )
      `),
    ]);

  const holidays = (holidaysRes.data ?? []).map((h) => ({
    start_date: new Date(h.start_date),
    end_date: new Date(h.end_date ?? h.start_date),
  }));
  const students = studentsRes.data ?? [];
  const absences = absencesRes.data ?? [];
  const weekProgram =
    classroomsRes.data?.find((c) => c.class_full_name === studentClass)
      ?.program ?? [];

  // remove Machtobin..
  const filtredAbsences = absences.filter(
    (student) => !students.find((b) => b.id === student.student_id)?.is_fired,
  );
  const selectedClass = filtredAbsences.filter(
    (student) => student.student_id === studentID,
  );

  function missed_Modules() {
    let classMissedModules = [];
    let globalmissed = [];
    selectedClass?.map((student) => {
      let missedModules = [];
      const date1 = student.date_of_return
        ? new Date(student.date_of_return).getTime()
        : new Date().getTime();
      const date2 = student.date_of_absence
        ? new Date(student.date_of_absence).getTime()
        : new Date().getTime();
      const absenceHours = Math.round((date1 - date2) / (1000 * 60 * 60));
      if (absenceHours) {
        for (let i = 0; i < absenceHours; i++) {
          const absenceTime = new Date(date2 + 1000 * 60 * 60 * i);
          let isHoliday = false;
          holidays?.map((holiday) => {
            if (isBetween(absenceTime, holiday.start_date, holiday.end_date)) {
              isHoliday = true;
              return;
            }
          });
          const hourProgram = weekProgram.filter(
            (module) =>
              module.day ===
                absenceTime.toLocaleString("ar-DZ", {
                  weekday: "long",
                }) && module.hour === absenceTime.getHours(),
          );
          if (hourProgram[0] && !isHoliday) {
            missedModules.push(hourProgram[0].module?.full_name);
            globalmissed.push(hourProgram[0].module?.full_name);
          }
        }
        classMissedModules.push({
          [new Date(student.date_of_absence).toLocaleString("en-ZA") +
          " --> " +
          (student.date_of_return
            ? new Date(student.date_of_return).toLocaleString("en-ZA")
            : "")]: missedModules,
        });
      }
    });
    return globalmissed;
  }

  const finalResult = missed_Modules();
  const counts = {};
  finalResult.forEach(function (x) {
    if (x) counts[x] = (counts[x] || 0) + 1;
  });
  function updateTotals() {
    removedDubs.map((student) => {
      let total_justified = 0;
      let total_nonJustified = 0;
      const totalAbsences = absences?.filter(
        (a) => a.full_name === student.full_name,
      );
      totalAbsences?.map((a) => {
        total_nonJustified += a.missed_hours ? a.missed_hours : 0;
        total_justified += a.justified_missed_hours
          ? a.justified_missed_hours
          : 0;
      });
      Object.assign(student, {
        total_missedH: total_justified + total_nonJustified,
      });
      Object.assign(student, { total_Justified: total_justified });
      Object.assign(student, { total_NonJustified: total_nonJustified });
    });
    return removedDubs;
  }
  // returns all students as {key: full_name, value: student_object}
  // to remove dublicates by full_name later.
  const allStudents = [
    ...new Map(
      filtredAbsences?.map((item) => [item["full_name"], item]),
    ).values(),
  ];
  let removedDubs = allStudents?.filter(
    (value, index, array) => array.indexOf(value) === index,
  );
  // const newData = updateTotals()?.sort(
  //   (a, b) => b.total_missedH - a.total_missedH
  // );
  return counts;
}
