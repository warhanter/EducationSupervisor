import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Student } from "./columns";
import { useStudents } from "@/client/providers/StudentProvider";

type DialogDemoProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student: Student;
};
export function StudentDialog({ open, setOpen, student }: DialogDemoProps) {
  const { addresses } = useStudents();
  const studentAddress = addresses?.filter(
    (address) => address.student_id === student.id
  )[0];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-[900px] sm:max-w-[425px]  align-middle justify-right content-start">
        <DialogHeader className="grid justify-center">
          <DialogTitle>بيانات التلميذ</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 md:gap-12 gap-4 ">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                رقم التسجيل
              </Label>
              <Input
                id="name"
                defaultValue={student.id}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                اللقب والاسم
              </Label>
              <Input
                id="username"
                defaultValue={student.full_name}
                className="col-span-3 disabled:font-bold "
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                القسم
              </Label>
              <Input
                id="username"
                defaultValue={student.full_class_name}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                اسم الأب
              </Label>
              <Input
                id="username"
                defaultValue={studentAddress?.father_name}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الصفة
              </Label>
              <Input
                id="name"
                defaultValue={student.student_status}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                تاريخ الازدياد
              </Label>
              <Input
                id="username"
                defaultValue={student.student_dob}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                الجنس
              </Label>
              <Input
                id="username"
                defaultValue={student.gender}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                العنوان
              </Label>
              <Input
                id="username"
                defaultValue={studentAddress?.address}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
