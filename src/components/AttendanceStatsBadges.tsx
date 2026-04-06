import React from "react";
import { Badge } from "@/components/ui/badge";

interface AttendanceStatsProps {
  totalHours: number;
  missedHours: number;
  actualHours: number;
  attendanceRate: number;
  absenceRate: number;
}

export const AttendanceStatsBadges: React.FC<AttendanceStatsProps> = ({
  totalHours,
  missedHours,
  actualHours,
  attendanceRate,
  absenceRate,
}) => {
  return (
    <div className="flex w-full gap-6 justify-center">
      <Badge variant="secondary">
        {`عدد الساعات الكلية: ${totalHours} سا`}
      </Badge>
      <Badge variant="secondary">
        {`عدد الساعات الضائعة: ${missedHours} سا`}
      </Badge>
      <Badge variant="secondary">
        {`عدد الساعات الفعلية: ${actualHours} سا`}
      </Badge>
      <Badge variant="default">
        {`نسبة الحضور : ${attendanceRate.toFixed(2)} %`}
      </Badge>
      <Badge variant="destructive" className="p-2">
        {`نسبة الغياب : ${absenceRate.toFixed(2)} %`}
      </Badge>
    </div>
  );
};
