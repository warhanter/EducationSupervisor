import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "./columns";
import { useStudents } from "@/client/providers/StudentProvider";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

type DialogDemoProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student: Student;
};

const STUDENT_STATUS_OPTIONS = ["داخلي", "نصف داخلي", "خارجي"];
const GENDER_OPTIONS = ["ذكر", "أنثى"];

function useClasses(students: Student[], student: Student) {
  return useMemo(() => {
    const seen = new Set();
    const classes: Student[] = [];

    for (const s of students) {
      if (s.class_name === student.class_name && !seen.has(s.class_number)) {
        seen.add(s.class_number);
        classes.push(s);
      }
    }

    return classes.sort((a, b) =>
      b.class_number > a.class_number
        ? -1
        : b.class_number > a.class_number
        ? 1
        : 0
    );
  }, [students, student.class_name]);
}

export function StudentDialogEdit({ open, setOpen, student }: DialogDemoProps) {
  const { addresses, students } = useStudents();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const CLASSES = useClasses(students, student);
  console.log("uniqe_classes: ", CLASSES);

  const studentAddress = addresses?.filter(
    (address) => address.student_id === student.id
  )[0];

  const [formData, setFormData] = useState({
    full_name: student.full_name,
    full_class_name: student.full_class_name,
    student_status: student.student_status,
    student_dob: student.student_dob,
    gender: student.gender,
    fathers_name: studentAddress?.father_name || "",
    address: studentAddress?.address || "",
    i3ada: student.i3ada || false,
    idmaj: student.idmaj || false,
    is_mamnouh: student.is_mamnouh || false,
    is_new: student.is_new || false,
    sport_inapt: student.sport_inapt || false,
    switched_school: student.switched_school || false,
    is_fired: student.is_fired || false,
  });

  const handleInputChange = (field: string, value: string) => {
    if (
      field === "i3ada" ||
      field === "idmaj" ||
      field === "is_mamnouh" ||
      field === "sport_inapt" ||
      field === "is_new" ||
      field === "switched_school" ||
      field === "is_fired"
    ) {
      setFormData((prev) => ({ ...prev, [field]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Update students table
      const { error: studentError } = await supabase
        .from("students")
        .update({
          full_name: formData.full_name,
          full_class_name: formData.full_class_name,
          class_number: Number(
            formData.full_class_name.split(" ")[
              formData.full_class_name.split(" ").length - 1
            ]
          ),
          prev_class_number: Number(student.class_number),
          student_status: formData.student_status,
          student_dob: formData.student_dob,
          gender: formData.gender,
          i3ada: formData.i3ada,
          idmaj: formData.idmaj,
          is_mamnouh: formData.is_mamnouh,
          is_new: formData.is_new,
          sport_inapt: formData.sport_inapt,
          fathers_name: formData.father_name,
          student_address: formData.address,
          switched_school: formData.switched_school,
          is_fired: formData.is_fired,
        })
        .eq("id", student.id);

      if (studentError) throw studentError;

      if (studentAddress) {
        // Update existing address
        const { error: addressError } = await supabase
          .from("student_addresses")
          .update({
            father_name: formData.father_name,
            address: formData.address,
          })
          .eq("student_id", student.id);

        if (addressError) throw addressError;
      } else {
        // Create new address if it doesn't exist
        const { error: addressError } = await supabase
          .from("student_addresses")
          .insert({
            student_id: student.id,
            father_name: formData.father_name,
            address: formData.address,
            last_name: student.full_name.split(" ")[0],
            first_name: student.full_name.split(" ")[1],
            full_name: student.full_name,
            date_of_birth: new Date(student.student_dob),
          });

        if (addressError) throw addressError;
      }

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات التلميذ بنجاح",
      });

      // Delay closing to allow toast to show
      // setTimeout(() => {
      //   setOpen(false);
      // }, 100);
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث بيانات التلميذ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-[900px] sm:max-w-[425px] align-middle justify-right content-start">
        <DialogHeader className="grid justify-center">
          <DialogTitle>تعديل بيانات التلميذ</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 md:gap-12 gap-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                رقم التسجيل
              </Label>
              <Input
                id="id"
                value={student.id}
                className="col-span-3 disabled:font-bold"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                اللقب والاسم
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_class_name" className="text-right">
                القسم
              </Label>
              <Select
                value={formData.full_class_name}
                onValueChange={(value) =>
                  handleInputChange("full_class_name", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((classroom) => (
                    <SelectItem
                      key={classroom.full_class_name}
                      value={classroom.full_class_name}
                    >
                      {classroom.full_class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="father_name" className="text-right">
                اسم الأب
              </Label>
              <Input
                id="father_name"
                value={formData.father_name}
                onChange={(e) =>
                  handleInputChange("father_name", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                العنوان
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student_status" className="text-right">
                الصفة
              </Label>
              <Select
                value={formData.student_status}
                onValueChange={(value) =>
                  handleInputChange("student_status", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الصفة" />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student_dob" className="text-right">
                تاريخ الازدياد
              </Label>
              <Input
                id="student_dob"
                type="date"
                value={formData.student_dob}
                onChange={(e) =>
                  handleInputChange("student_dob", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                الجنس
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="i3ada" className="text-right">
                معيد
              </Label>
              <Select
                value={formData.i3ada ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange("i3ada", value === "نعم" ? "true" : "false")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idmaj" className="text-right">
                إدماج
              </Label>
              <Select
                value={formData.idmaj ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange("idmaj", value === "نعم" ? "true" : "false")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_mamnouh" className="text-right">
                ممنوح
              </Label>
              <Select
                value={formData.is_mamnouh ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange(
                    "is_mamnouh",
                    value === "نعم" ? "true" : "false"
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_new" className="text-right">
                وافد جديد
              </Label>
              <Select
                value={formData.is_new ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange(
                    "is_new",
                    value === "نعم" ? "true" : "false"
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sport_inapt" className="text-right">
                اعفاء من الرياضة
              </Label>
              <Select
                value={formData.sport_inapt ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange(
                    "sport_inapt",
                    value === "نعم" ? "true" : "false"
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="switched_school" className="text-right">
                تغيير مؤسسة
              </Label>
              <Select
                value={formData.switched_school ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange(
                    "switched_school",
                    value === "نعم" ? "true" : "false"
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_fired" className="text-right">
                شطب غياب
              </Label>
              <Select
                value={formData.is_fired ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange(
                    "is_fired",
                    value === "نعم" ? "true" : "false"
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
