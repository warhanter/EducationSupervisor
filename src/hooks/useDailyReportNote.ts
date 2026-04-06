import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useDailyReportNote(date: Date) {
  const [reportNumber, setReportNumber] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("daily_notes")
      .select("*")
      .eq("report_date", date.toLocaleDateString())
      .maybeSingle()
      .then(({ data }) => {
        if (data) setReportNumber(data.report_number);
      });
  }, [date]);

  const saveReportNumber = async (value: number) => {
    await supabase.from("daily_notes").upsert(
      {
        report_date: date.toLocaleDateString(),
        report_number: value,
      },
      { onConflict: "report_date" }
    );
  };

  return { reportNumber, saveReportNumber };
}
