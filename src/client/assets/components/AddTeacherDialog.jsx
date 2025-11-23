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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateTimePicker from "./AppDatePicker";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useDateContext } from "../contexts/DateContext";
import { calculateMissedHours } from "@/client/functions/calcMissedHours";
import { useStudents } from "@/client/providers/StudentProvider";
import { PlusCircle } from "lucide-react";

async function handleAddTeacher(
  last_name,
  first_name,
  subject_id,
  setLoading,
  setOpen
) {
  setLoading(true);

  const full_name = `${last_name} ${first_name}`;

  try {
    // First insert absence record
    const { data: teacherData, error: teacherError } = await supabase
      .from("professors")
      .insert({
        last_name: last_name,
        first_name: first_name,
        full_name: full_name,
        subject_id: subject_id,
      })
      .select()
      .single();

    if (teacherError) throw teacherError;

    setOpen(false);
    setLoading(false);

    return { success: true, data: teacherData };
  } catch (error) {
    console.error("Error adding teacher:", error);
    return { success: false, error: error.message };
  }
}

async function handleAddSubject(subject_name, setLoading, setOpen) {
  setLoading(true);

  try {
    // First insert absence record
    const { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .insert({
        subject: subject_name,
      })
      .select()
      .single();

    if (subjectError) throw subjectError;

    setOpen(false);
    setLoading(false);

    return { success: true, data: subjectData };
  } catch (error) {
    console.error("Error adding subject:", error);
    return { success: false, error: error.message };
  }
}

export default function AddTeacherDialog({ type }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { subjects } = useStudents();
  const subject_id = subjects.filter((s) => s.subject === subjectName)[0]?.id;

  return type === "teacher" ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="h-12" variant={"outline"}>
            <div className="flex gap-4 justify-center items-center">
              <span>إضافة أستاذ</span>
              <PlusCircle />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="  sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة أستاذ</DialogTitle>
            <DialogDescription className="text-right">
              هل تريد إضافة أستاذ{" "}
              <span className="font-bold">{subjectName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <label htmlFor="">المــــــــــــادة</label>
            <Select
              value={subjectName}
              onValueChange={(value) => {
                setSubjectName(value);
              }}
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
          </div>
          <div className="flex items-center gap-4">
            <h3>لقب الأستاذ </h3>
            <Input
              placeholder={"ادخل اللقب"}
              onChange={(value) => setLastName(value.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <h3>إسم الأستاذ</h3>
            <Input
              placeholder={"ادخل الإسم"}
              onChange={(value) => setFirstName(value.target.value)}
            />
          </div>
          <DialogFooter className="flex flex-row justify-start gap-4">
            <Button
              type="submit"
              variant={"destructive"}
              disabled={loading}
              onClick={() =>
                handleAddTeacher(
                  lastName,
                  firstName,
                  subject_id,
                  setLoading,
                  setOpen
                )
              }
            >
              {loading ? "حذف..." : "إضافة الأستاذ"}
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
          <Button className="h-12" variant={"outline"}>
            <div className="flex justify-center items-center gap-4">
              <span>إضافة مادة</span>
              <PlusCircle />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="  sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة مادة</DialogTitle>
            <DialogDescription className="text-right">
              هل تريد إضافة <span className="font-bold">{subjectName}</span>{" "}
              المادة؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <h3>المـــــــادة </h3>
            <Input
              placeholder={"ادخل اسم المادة"}
              onChange={(value) => setSubjectName(value.target.value)}
            />
          </div>
          <DialogFooter className="flex flex-row justify-start gap-4">
            <Button
              type="submit"
              variant={"destructive"}
              disabled={loading}
              onClick={() => handleAddSubject(subjectName, setLoading, setOpen)}
            >
              {loading ? "حذف..." : "إضافة المادة"}
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
