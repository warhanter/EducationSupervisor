import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Student } from "./columns";
import { CreatePDFNotice1 } from "../pdf/Notice";

// type DialogDemoProps = {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   student: Student;
// };
export function NoticeDialog({ open, setOpen, state }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[900px] max-h-full print:min-h-full print:min-w-full overflow-scroll ">
        <CreatePDFNotice1 state={state} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
