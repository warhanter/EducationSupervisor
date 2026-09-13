import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function ChangeAddress({
  setFatherName,
  setAddress,
  fatherName,
  address,
  student,
}) {
  const [input1, setInput1] = useState(fatherName);
  const [input2, setInput2] = useState(address);
  const handleSubmit = async () => {
    setFatherName(input1);
    setAddress(input2);

    if (student) {
      const fName = student.first_name || (student.full_name ? student.full_name.split(' ')[0] : 'غير معروف');
      const parsedLName = student.last_name || (student.full_name ? student.full_name.substring(fName.length).trim() : 'غير معروف');
      const lName = parsedLName || 'غير معروف';

      const { data: existingRecords, error: fetchError } = await supabase
        .from("student_addresses")
        .select("*")
        .eq("first_name", fName)
        .eq("last_name", lName)
        .eq("date_of_birth", student.student_dob);

      if (fetchError) {
        console.error("Error fetching address in Supabase:", fetchError);
        return;
      }

      if (existingRecords && existingRecords.length > 0) {
        const { error } = await supabase
          .from("student_addresses")
          .update({ father_name: input1, address: input2 })
          .eq("id", existingRecords[0].id);

        if (error) {
          console.error("Error updating address in Supabase:", error);
        }
      } else {
        const { error } = await supabase
          .from("student_addresses")
          .insert({
            first_name: fName,
            last_name: lName,
            full_name: student.full_name || `${lName} ${fName}`,
            date_of_birth: student.student_dob || "1900-01-01",
            student_id: student.id,
            father_name: input1,
            address: input2,
          });

        if (error) {
          console.error("Error inserting address in Supabase:", error);
        }
      }
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="print:hidden">تغيير اسم الولي أو العنوان</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              اسم الولي
            </Label>
            <Input
              id="name"
              defaultValue={fatherName}
              onChange={(value) => setInput1(value.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              عنوان الولي
            </Label>
            <Input
              id="username"
              defaultValue={address}
              className="col-span-3"
              onChange={(value) => setInput2(value.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSubmit} type="submit">
              حفظ التغييرات
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
