import { groupBy } from "lodash";

export function getTeacherAbsences(professors, from, to) {
  const absences = [];

  professors?.forEach((p) => {
    p.absences?.forEach((a) => {
      if (a.date > from && a.date < to) {
        absences.push({
          ...a,
          full_name: p.full_name,
          module_name: p.module_name,
        });
      }
    });
  });

  return {
    list: absences,
    byTeacher: groupBy(absences, "full_name"),
  };
}
