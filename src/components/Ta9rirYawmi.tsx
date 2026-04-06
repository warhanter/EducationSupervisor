import React from "react";
import { useDailyReportData } from "@/hooks/useDailyReportData";
import { StudentSummaryTablePrint } from "@/tables/StudentSummaryTable";
import { TeacherAbsenceTablePrint } from "@/tables/TeacherAbsenceTable.print";

export default function Ta9rirYawmi2({ date, allStudents, professors }) {
  const data = useDailyReportData({
    date,
    allStudents,
    professors,
  });

  return (
    <section id="section-to-print">
      {/* <HeaderPrint /> */}
      <TeacherAbsenceTablePrint
        absencesByTeacher={data.teachers.absences.byTeacher}
        missedHours={data.teachers.missedHours}
        setMissedHours={data.teachers.setMissedHours}
        totalHours={data.teachers.totalHours}
        setTotalHours={data.teachers.setTotalHours}
        ratio={data.teachers.absenceRatio}
      />

      <StudentSummaryTablePrint
        yesterdayCount={data.students.yesterday.length}
        todayCount={data.students.today.length}
        newCount={data.students.new.length}
        goneCount={data.students.gone.length}
      />

      {/* Level tables */}
      {/* New / Gone tables */}

      {/* <FooterPrint /> */}
    </section>
  );
}
