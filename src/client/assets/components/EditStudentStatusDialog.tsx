import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

type EditStudentStatusDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student: Student;
};

const STUDENT_STATUS_OPTIONS = ["داخلي", "نصف داخلي", "خارجي"] as const;
const YES_NO_OPTIONS = ["نعم", "لا"] as const;
const PAYMENT_STATUS_OPTIONS = ["مسددة", "غير مسددة"] as const;

export function EditStudentStatusDialog({
  open,
  setOpen,
  student,
}: EditStudentStatusDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    student_status: student.student_status,
    is_mamnouh: student.is_mamnouh || false,
    lunch_paid: student.lunch_paid || false,
  });

  // Reset form data when dialog opens or student changes
  useEffect(() => {
    if (open) {
      setFormData({
        student_status: student.student_status,
        is_mamnouh: student.is_mamnouh || false,
        lunch_paid: student.lunch_paid || false,
      });
      setShowConfirmation(false);
    }
  }, [open, student]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "is_mamnouh") {
      const boolValue = value === "نعم";
      setFormData((prev) => {
        const updated = { ...prev, [field]: boolValue };
        // If student becomes mamnouh, automatically set lunch_paid to false
        if (boolValue) {
          updated.lunch_paid = false;
        }
        return updated;
      });
    } else if (field === "lunch_paid") {
      // Map "مسددة" to true, "غير مسددة" to false
      const boolValue = value === "مسددة";
      setFormData((prev) => ({ ...prev, [field]: boolValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveClick = () => {
    // Check if there are any changes
    const originalIsMamnouh = student.is_mamnouh || false;
    const originalLunchPaid = student.lunch_paid || false;

    const hasChanges =
      formData.student_status !== student.student_status ||
      formData.is_mamnouh !== originalIsMamnouh ||
      (!formData.is_mamnouh && formData.lunch_paid !== originalLunchPaid) ||
      (originalIsMamnouh && !formData.is_mamnouh);

    if (!hasChanges) {
      toast({
        title: "لا توجد تغييرات",
        description: "لم يتم إجراء أي تغييرات على البيانات",
      });
      setOpen(false);
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const updateData: {
        student_status: string;
        is_mamnouh: boolean;
        lunch_paid: boolean;
      } = {
        student_status: formData.student_status,
        is_mamnouh: formData.is_mamnouh,
        lunch_paid: formData.is_mamnouh ? false : formData.lunch_paid,
      };

      const { error } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", student.id);

      if (error) throw error;

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث صفة التلميذ بنجاح",
      });

      setOpen(false);
    } catch (error) {
      console.error("Error updating student status:", error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث صفة التلميذ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    // Reset form data to original values
    setFormData({
      student_status: student.student_status,
      is_mamnouh: student.is_mamnouh || false,
      lunch_paid: student.lunch_paid || false,
    });
  };

  return (
    <>
      <Dialog open={open && !showConfirmation} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="grid justify-center">
            <DialogTitle>تغيير الصفة</DialogTitle>
            <DialogDescription>
              تعديل صفة التلميذ: {student.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student_status" className="text-right">
                الصفة
              </Label>
              <Select
                dir="rtl"
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
              <Label htmlFor="is_mamnouh" className="text-right">
                ممنوح
              </Label>
              <Select
                dir="rtl"
                value={formData.is_mamnouh ? "نعم" : "لا"}
                onValueChange={(value) =>
                  handleInputChange("is_mamnouh", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!formData.is_mamnouh && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lunch_paid" className="text-right">
                  مستحقات الإطعام
                </Label>
                <Select
                  dir="rtl"
                  value={formData.lunch_paid ? "مسددة" : "غير مسددة"}
                  onValueChange={(value) =>
                    handleInputChange("lunch_paid", value)
                  }
                >
                  <SelectTrigger
                    className={`col-span-3 ${
                      formData.lunch_paid
                        ? "border-green-500 text-green-700 dark:text-green-400"
                        : "border-red-500 text-red-700 dark:text-red-400"
                    }`}
                  >
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className={
                          option === "مسددة"
                            ? "text-green-700 dark:text-green-400 focus:text-green-700 dark:focus:text-green-400"
                            : "text-red-700 dark:text-red-400 focus:text-red-700 dark:focus:text-red-400"
                        }
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                handleCancel();
              }}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveClick} disabled={isSubmitting}>
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد التحديث</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من تحديث صفة التلميذ {student.full_name}؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <div className="text-sm">
              <span className="font-semibold">الصفة:</span>{" "}
              {formData.student_status}
            </div>
            <div className="text-sm">
              <span className="font-semibold">ممنوح:</span>{" "}
              {formData.is_mamnouh ? "نعم" : "لا"}
            </div>
            {!formData.is_mamnouh && (
              <div className="text-sm">
                <span className="font-semibold">مستحقات الإطعام:</span>{" "}
                <span
                  className={
                    formData.lunch_paid
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : "text-red-600 dark:text-red-400 font-semibold"
                  }
                >
                  {formData.lunch_paid ? "مسددة" : "غير مسددة"}
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? "جاري الحفظ..." : "تأكيد التحديث"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
