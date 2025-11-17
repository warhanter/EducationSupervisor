import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateTimePicker from "./AppDatePicker";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useDateContext } from "../contexts/DateContext";
import { calculateMissedHours } from "@/client/functions/calcMissedHours";

async function markStudentAbsentWithRollback(
  studentId,
  absenceDate,
  setOpen,
  setLoading,
  clearDates,
  action,
  studentAbsenceDate
) {
  setLoading(true);
  const dateString =
    absenceDate instanceof Date ? absenceDate.toISOString() : absenceDate;

  if (
    (studentAbsenceDate &&
      new Date(dateString) < new Date(studentAbsenceDate)) ||
    new Date(dateString) > new Date()
  ) {
    setLoading(false);
    const errorMessage =
      action === "removeMark"
        ? "تاريخ العودة من الغياب يجب أن يكون بعد  تاريخ الغياب، وألا يكون في المستقبل."
        : "تاريخ الغياب يجب ألا يكون في المستقبل.";
    window.alert(errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }

  console.log(dateString);

  if (action === "markAbsence") {
    try {
      // First insert absence record
      const { data: absenceData, error: absenceError } = await supabase
        .from("absences")
        .insert({
          student_id: studentId,
          absence_status: true,
          date_of_absence: dateString,
        })
        .select()
        .single();

      if (absenceError) throw absenceError;

      // Then update student
      const { error: studentError } = await supabase
        .from("students")
        .update({
          is_absent: true,
          absence_date: dateString,
        })
        .eq("id", studentId);

      if (studentError) {
        // Rollback: delete the absence record we just created
        await supabase.from("absences").delete().eq("id", absenceData.id);

        throw studentError;
      }
      setOpen(false);
      setLoading(false);
      clearDates();

      return { success: true, data: absenceData };
    } catch (error) {
      console.error("Error marking student absent:", error);
      return { success: false, error: error.message };
    }
  } else {
    try {
      const missedHours = calculateMissedHours(
        new Date(studentAbsenceDate),
        absenceDate
      ).totalHours;

      // Second update absence record
      const { data: absenceData, error: absenceError } = await supabase
        .from("absences")
        .update({
          absence_status: false,
          date_of_return: dateString,
          missed_hours: missedHours,
        })
        .eq("student_id", studentId)
        .eq("absence_status", true);

      if (absenceError) throw absenceError;

      // Then update student
      const { error: studentError } = await supabase
        .from("students")
        .update({
          is_absent: false,
          absence_date: null,
        })
        .eq("id", studentId);

      if (studentError) {
        // Rollback: delete the absence record we just created
        await supabase.from("absences").delete().eq("id", absenceData.id);

        throw studentError;
      }
      setOpen(false);
      setLoading(false);
      clearDates();

      return { success: true, data: absenceData };
    } catch (error) {
      console.error("Error marking student absent:", error);
      return { success: false, error: error.message };
    }
  }
}

export function MarkAbsenceDialog({
  studentAbsenceDate,
  full_name,
  studentID,
}) {
  const {
    absenceDate,
    returnDate,
    updateAbsenceDate,
    updateReturnDate,
    clearDates,
  } = useDateContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("APPID", studentAbsenceDate);
  return studentAbsenceDate ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="destructive">حـــــــــذف غياب</Button>
        </DialogTrigger>
        <DialogContent className="  sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف غياب</DialogTitle>
            <DialogDescription className="text-right">
              هل تريد حذف االتلميذ{" "}
              <span className="font-bold">{full_name}</span> من الغياب؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <h3>تاريخ الغياب: </h3>
            <DateTimePicker studentAbsenceDate={studentAbsenceDate} />
          </div>
          <div className="flex items-center gap-4">
            <h3>تاريخ العودة: </h3>
            <DateTimePicker />
          </div>
          <DialogFooter className="flex flex-row justify-start gap-4">
            <Button
              type="submit"
              variant={"destructive"}
              disabled={loading || !absenceDate}
              onClick={() =>
                markStudentAbsentWithRollback(
                  studentID,
                  absenceDate,
                  setOpen,
                  setLoading,
                  clearDates,
                  "removeMark",
                  studentAbsenceDate
                )
              }
            >
              {loading ? "حذف..." : "حذف الغياب"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">تراجع</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">تسجيل غياب</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة غياب</DialogTitle>
            <DialogDescription className="text-right">
              هل تريد تسجيل االتلميذ{" "}
              <span className="font-bold">{full_name}</span> غائـــب؟
            </DialogDescription>
          </DialogHeader>
          <DateTimePicker />
          <DialogFooter className="flex flex-row justify-start gap-4">
            <Button
              type="submit"
              disabled={loading || !absenceDate}
              onClick={() =>
                markStudentAbsentWithRollback(
                  studentID,
                  absenceDate,
                  setOpen,
                  setLoading,
                  clearDates,
                  "markAbsence"
                )
              }
            >
              {loading ? "تسجيل..." : "تسجيل الغياب"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">تراجع</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
