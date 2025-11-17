import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MarkAbsences() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">إضافة</Button>
      </DialogTrigger>
      <DialogContent className="flex items-center ">
        <DialogHeader>
          <DialogTitle className="text-center">تسجيل غياب التلاميذ</DialogTitle>
          <DialogDescription>
            قم باختيار التلميذ الغائب، تاريخ الغياب، ساعة الغياب وانقر على
            إضافة.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
