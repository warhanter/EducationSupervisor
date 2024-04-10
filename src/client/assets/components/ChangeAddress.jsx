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

export function ChangeAddress({
  setFatherName,
  setAddress,
  fatherName,
  address,
}) {
  const [input1, setInput1] = useState(fatherName);
  const [input2, setInput2] = useState(address);
  const handleSubmit = () => {
    setFatherName(input1);
    setAddress(input2);
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
