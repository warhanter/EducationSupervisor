import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { useStudents } from "@/client/providers/StudentProvider";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { FemaleImage, MaleImage } from "./images";

type AddStudentStatusDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const STATUS_OPTIONS = ["نصف داخلي", "داخلي"] as const;
const YES_NO_OPTIONS = ["نعم", "لا"] as const;
const PAYMENT_STATUS_OPTIONS = ["مسددة", "غير مسددة"] as const;

export function AddStudentStatusDialog({
  open,
  setOpen,
}: AddStudentStatusDialogProps) {
  const { students, refreshData } = useStudents();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isMamnouh, setIsMamnouh] = useState<boolean>(false);
  const [lunchPaid, setLunchPaid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter students with status "خارجي"
  const externalStudents = useMemo(() => {
    return students.filter((student) => student.student_status === "خارجي");
  }, [students]);

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) {
      return externalStudents.slice(0, 10); // Show first 10 if no search
    }
    const query = searchQuery.toLowerCase();
    return externalStudents
      .filter((student) => student.full_name?.toLowerCase().includes(query))
      .slice(0, 10);
  }, [externalStudents, searchQuery]);

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setNewStatus("");
    setIsMamnouh(student.is_mamnouh || false);
    setLunchPaid(student.lunch_paid || false);
  };

  const handleUpdate = async () => {
    if (!selectedStudent || !newStatus) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار التلميذ والصفة الجديدة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: {
        student_status: string;
        is_mamnouh: boolean;
        lunch_paid: boolean;
      } = {
        student_status: newStatus,
        is_mamnouh: isMamnouh,
        lunch_paid: isMamnouh ? false : lunchPaid,
      };

      const { error } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", selectedStudent.id);

      if (error) throw error;

      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث بيانات التلميذ ${selectedStudent.full_name} بنجاح`,
      });

      // Refresh data
      await refreshData();

      // Reset form
      setSelectedStudent(null);
      setNewStatus("");
      setIsMamnouh(false);
      setLunchPaid(false);
      setSearchQuery("");
      setOpen(false);
    } catch (error) {
      console.error("Error updating student status:", error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث بيانات التلميذ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setNewStatus("");
    setIsMamnouh(false);
    setLunchPaid(false);
    setSearchQuery("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة تلميذ - تغيير الصفة</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">البحث عن التلميذ</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="ابحث بالاسم الكامل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
          </div>

          {/* Student List */}
          {!selectedStudent && (
            <div className="space-y-2">
              <Label>قائمة التلاميذ (خارجي)</Label>
              <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery
                      ? "لم يتم العثور على تلاميذ"
                      : "لا يوجد تلاميذ بحالة خارجي"}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => handleStudentSelect(student)}
                        className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-right"
                      >
                        <div className="flex items-center gap-3">
                          {student.gender === "ذكر" ? (
                            <MaleImage />
                          ) : (
                            <FemaleImage />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                              {student.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.full_class_name}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {student.student_status}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Student and Status Update */}
          {selectedStudent && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  {selectedStudent.gender === "ذكر" ? (
                    <MaleImage />
                  ) : (
                    <FemaleImage />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedStudent.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedStudent.full_class_name}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">الصفة الحالية:</span>{" "}
                  {selectedStudent.student_status}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newStatus">اختر الصفة الجديدة</Label>
                  <Select
                    dir="rtl"
                    value={newStatus}
                    onValueChange={setNewStatus}
                  >
                    <SelectTrigger id="newStatus">
                      <SelectValue placeholder="اختر الصفة الجديدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_mamnouh">ممنوح</Label>
                  <Select
                    dir="rtl"
                    value={isMamnouh ? "نعم" : "لا"}
                    onValueChange={(value) => {
                      const boolValue = value === "نعم";
                      setIsMamnouh(boolValue);
                      // If student becomes mamnouh, automatically set lunch_paid to false
                      if (boolValue) {
                        setLunchPaid(false);
                      }
                    }}
                  >
                    <SelectTrigger id="is_mamnouh">
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

                {!isMamnouh && (
                  <div className="space-y-2">
                    <Label htmlFor="lunch_paid">مستحقات الإطعام</Label>
                    <Select
                      dir="rtl"
                      value={lunchPaid ? "مسددة" : "غير مسددة"}
                      onValueChange={(value) => setLunchPaid(value === "مسددة")}
                    >
                      <SelectTrigger
                        id="lunch_paid"
                        className={
                          lunchPaid
                            ? "border-green-500 text-green-700 dark:text-green-400"
                            : "border-red-500 text-red-700 dark:text-red-400"
                        }
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

                {/* <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedStudent(null);
                    setNewStatus("");
                    setIsMamnouh(false);
                    setLunchPaid(false);
                  }}
                  className="w-full mt-4"
                >
                  تغيير التلميذ
                </Button> */}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          {selectedStudent && (
            <Button
              onClick={handleUpdate}
              disabled={isSubmitting || !newStatus}
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث البيانات"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
