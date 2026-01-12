import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { StudentDialog } from "./StudentDetails";
import { filter } from "lodash";
import { useStudents } from "@/client/providers/StudentProvider";
import { FemaleImage, MaleImage } from "./images";
import { Badge } from "@/components/ui/badge";
import Convocation from "./Convocation";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NoticeDialog } from "./NoticeDialog";
import { StudentDialogEdit } from "./updateStudentDetails";
import { EditStudentStatusDialog } from "./EditStudentStatusDialog";
import { AddStudentStatusDialog } from "./AddStudentStatusDialog";
import { MarkAbsenceDialog } from "./MarkAbsenceDialog";
import DateTimePicker from "./AppDatePicker";
type Status = "داخلي" | "نصف داخلي" | "خارجي";
type Gender = "ذكر" | "أنثى";

// Component for the Add Student button with dialog
const AddStudentButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="default" className="" onClick={() => setOpen(true)}>
        إضافة تلميذ
      </Button>
      <AddStudentStatusDialog open={open} setOpen={setOpen} />
    </>
  );
};
export type Student = {
  id: number;
  student_id: number;
  class_number: number;
  total_missedH: number;
  total_Justified?: number;
  total_NonJustified?: number;
  class_name: string;
  full_class_name: string;
  full_name: string;
  level: string;
  gender: Gender;
  is_fired: boolean;
  is_new: boolean;
  idmaj: boolean;
  switched_school: boolean;
  student_dob: Date;
  student_status: Status;
  noticeName: string;
  absence_days: string;
  absence_date: Date;
  date_of_absence: Date;
  date_of_return: Date;
  missed_hours: number;
  justified_missed_hours: number;
  absence_status: boolean;
  is_mamnouh: boolean;
  lunch_paid: boolean;
  sport_inapt?: boolean;
  i3ada?: boolean;
  father_name?: string;
  last_name?: string;
  first_name?: string;
  class?: string;
  tableNumber?: number;
  ids?: number;
  class_abbreviation?: string;
  lunch_table_number?: string;
  lunch_leave_justification?: string;
};

// const navigate = useNavigate();
export const studentsColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-4 dark:border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student_id",
    header: "الرقم",
    cell: ({ row, table }) => (
      <div className="text-base font-bold m-0 p-0">
        {table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1 ||
          0 + 1}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          اللقب والاسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex items-center gap-x-3">
            {row.original.gender === "ذكر" ? <MaleImage /> : <FemaleImage />}
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                {row.getValue("full_name")}
              </span>
              <span className="block text-sm text-gray-500">
                {row.original.student_status}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "full_class_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          القسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="p-0">
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {row.getValue("full_class_name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "is_fired",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          الحالة
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.switched_school
        ? "تغيير مؤسسة"
        : row.getValue("is_fired")
        ? "شطب غياب"
        : row.original.idmaj
        ? "إعادة إدماج"
        : row.original.is_new
        ? "وافد جديد"
        : "متمدرس";
      return (
        <div className="ml-10">
          <StatusBadge status={status} />
        </div>
      );
    },
  },
  {
    accessorKey: "student_dob",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          تاريخ الازدياد
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: string = row.getValue("student_dob");

      return (
        <div className="text-right font-medium text-gray-500 ml-10">{date}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      const [open, setOpen] = useState(false);
      const [openEdit, setOpenEdit] = useState(false);
      return (
        <>
          <StudentDialog open={open} setOpen={setOpen} student={student} />
          <StudentDialogEdit
            open={openEdit}
            setOpen={setOpenEdit}
            student={student}
          />
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">فتح القائمة</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ direction: "rtl" }}>
                <DropdownMenuLabel>بيانات</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  عرض بيانات التلميذ
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenEdit(true);
                  }}
                >
                  تعديل بيانات التلميذ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>وثائق</DropdownMenuLabel>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <span>استدعاء الولي</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>انذار مكتوب</DropdownMenuItem>
                <DropdownMenuItem>توبيــــخ</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Convocation data={student} title={"استدعاء الولي"} />
          </Dialog>
        </>
      );
    },
  },
];
export const nisfdakhiliColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-4 dark:border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student_id",
    header: "الرقم",
    cell: ({ row, table }) => (
      <div className="text-base font-bold m-0 p-0">
        {table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1 ||
          0 + 1}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          اللقب والاسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex items-center gap-x-3">
            {row.original.gender === "ذكر" ? <MaleImage /> : <FemaleImage />}
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                {row.getValue("full_name")}
              </span>
              <span className="block text-sm text-gray-500">
                {row.original.student_status}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "full_class_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          القسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="p-0">
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {row.getValue("full_class_name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "is_mamnouh",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          المنحة
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.is_mamnouh
        ? "ممنوح"
        : row.original.lunch_paid
        ? "غير ممنوح"
        : "عدم التجديد";
      return (
        <div className="ml-10">
          <StatusBadge status={status} />
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const statusA = rowA.original.is_mamnouh
        ? "ممنوح"
        : rowA.original.lunch_paid
        ? "غير ممنوح"
        : "عدم التجديد";
      const statusB = rowB.original.is_mamnouh
        ? "ممنوح"
        : rowB.original.lunch_paid
        ? "غير ممنوح"
        : "عدم التجديد";
      const numA = statusA;
      const numB = statusB;

      return numA < numB ? 1 : numA > numB ? -1 : 0;
    },
  },
  {
    accessorKey: "student_dob",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="ml-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          تاريخ الازدياد
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: string = row.getValue("student_dob");

      return (
        <div className="text-right font-medium text-gray-500 ml-10">{date}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => {
      return <AddStudentButton />;
    },
    cell: ({ row }) => {
      const student = row.original;
      const [open, setOpen] = useState(false);
      const [openStatusEdit, setOpenStatusEdit] = useState(false);
      return (
        <>
          <StudentDialog open={open} setOpen={setOpen} student={student} />
          <EditStudentStatusDialog
            open={openStatusEdit}
            setOpen={setOpenStatusEdit}
            student={student}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ direction: "rtl" }}>
              <DropdownMenuLabel>بيانات</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                }}
              >
                عرض بيانات التلميذ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenStatusEdit(true);
                }}
              >
                تغيير الصفة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>وثائق</DropdownMenuLabel>
              <DropdownMenuItem>استدعاء الولي</DropdownMenuItem>
              <DropdownMenuItem>انذار مكتوب</DropdownMenuItem>
              <DropdownMenuItem>توبيــــخ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
export const sortedColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-4 dark:border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student_id",
    header: "الرقم",
    cell: ({ row, table }) => (
      <div className="text-base font-bold m-0 p-0">
        {table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1 ||
          0 + 1}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-5"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          اللقب والاسم
        </Button>
      );
    },
    cell: ({ row }) => {
      const { students } = useStudents();
      return (
        <div>
          <div className="flex items-center gap-x-3">
            {filter(students, (a) => a.id === row.original.student_id)[0]
              .gender === "ذكر" ? (
              <MaleImage />
            ) : (
              <FemaleImage />
            )}
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                {row.getValue("full_name")}
              </span>
              <span className="block text-sm text-gray-500">
                {row.original.student_status}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "full_class_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-5"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          القسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {row.getValue("full_class_name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "absence_status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          الحالة
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("absence_status") ? "غائب" : "حاضر";
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "total_Justified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          سا المبررة
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-center font-bold m-0 px-3 rounded-2xl bg-teal-500 text-white">
        {row.getValue("total_Justified")}
      </span>
    ),
  },
  {
    accessorKey: "total_NonJustified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          سا/غ المبررة
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="items-center text-center font-bold m-0 px-3 rounded-2xl bg-rose-500 text-white">
        {row.getValue("total_NonJustified")}
      </span>
    ),
  },
  {
    accessorKey: "total_missedH",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          المجموع
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-center font-bold m-0 px-3 rounded-2xl bg-gray-800 text-white">
        {row.getValue("total_missedH")}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { absences } = useStudents();
      const navigate = useNavigate();
      const student = row.original;
      const [open, setOpen] = useState(false);
      return (
        <>
          <StudentDialog open={open} setOpen={setOpen} student={student} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ direction: "rtl" }}>
              <DropdownMenuLabel>بيانات</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                }}
              >
                عرض بيانات التلميذ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/studentAbsencesRecords", {
                    state: filter(
                      absences,
                      (a) => a.student_id === row.original.student_id
                    ),
                  });
                }}
              >
                عرض سجل الغيابات للتلميذ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/studentMissedModules", {
                    state: {
                      studentID: row.original.student_id,
                      studentClass: row.original.full_class_name,
                      name: row.original.full_name,
                    },
                  });
                }}
              >
                عرض سجل الحصص الضائعة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>وثائق</DropdownMenuLabel>
              <DropdownMenuItem>استدعاء الولي</DropdownMenuItem>
              <DropdownMenuItem>انذار مكتوب</DropdownMenuItem>
              <DropdownMenuItem>توبيــــخ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
export const absencesColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-4 dark:border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row, table }) => (
      <div className="text-base font-bold m-0 p-0">
        {table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1 ||
          0 + 1}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          اللقب والاسم
        </Button>
      );
    },
    cell: ({ row }) => {
      const { students } = useStudents();
      const student_id = row.getValue("id");
      const full_name = students.filter((s) => s.id === student_id)[0]
        ?.full_name;
      const student_status = students.filter((s) => s.id === student_id)[0]
        ?.student_status;
      const gender = students.filter((s) => s.id === student_id)[0]?.gender;
      return (
        <div>
          <div className="flex items-center gap-x-3">
            {gender === "ذكر" ? <MaleImage /> : <FemaleImage />}
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                {full_name}
              </span>
              <span className="block text-sm text-gray-500">
                {student_status}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "full_class_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          القسم
        </Button>
      );
    },
    cell: ({ row }) => {
      const { students } = useStudents();
      const student_id = row.getValue("id");
      const full_class_name = students.filter((s) => s.id === student_id)[0]
        ?.full_class_name;
      return (
        <div className="p-0">
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {full_class_name}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "absence_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          تاريخ الغياب
        </Button>
      );
    },
    cell: ({ row }) => {
      const absenceDate: string = row.getValue("absence_date");
      return (
        <div className="text-right font-medium text-gray-500">
          {absenceDate}
        </div>
      );
    },
  },
  {
    accessorKey: "absence_days",
    header: "الأيام",
    cell: ({ row }) => {
      const absencesDays: number = row.getValue("absence_days");
      return (
        <div className="text-right font-medium text-gray-500">
          {absencesDays}
        </div>
      );
    },
  },
  {
    accessorKey: "missed_hours",
    header: "سا/غ",
    cell: ({ row }) => {
      const missedHours: number = row.getValue("missed_hours");
      return (
        <div className="text-right font-medium text-gray-500">
          {missedHours}
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "noticeName",
    header: "الإجراء",
    cell: ({ row }) => {
      const status = row.original.noticeName;
      return <StatusBadge status={status} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const [noticeName, setNoticeName] = useState("");
      const { absences } = useStudents();
      const navigate = useNavigate();
      const student = row.original;
      return (
        <>
          <NoticeDialog
            open={open}
            state={{ student: student, notice: noticeName }}
            setOpen={setOpen}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ direction: "rtl" }}>
              <DropdownMenuLabel>معلومات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/studentAbsencesRecords", {
                    state: filter(
                      absences,
                      (a) => a.student_id === row.original.id
                    ),
                  });
                }}
              >
                عرض سجل الغيابات للتلميذ
              </DropdownMenuItem>
              <DropdownMenuGroup>
                <DropdownMenuLabel>اشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  // onClick={() => {
                  //   navigate("/print-notice", {
                  //     state: { student: student, notice: "notice1" },
                  //   });
                  // }}
                  onClick={() => {
                    setOpen(true);
                    setNoticeName("notice1");
                  }}
                >
                  الاشعار الأول
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={() => {
                  //   navigate("/print-notice", {
                  //     state: { student: student, notice: "notice2" },
                  //   });
                  // }}
                  onClick={() => {
                    setOpen(true);
                    setNoticeName("notice2");
                  }}
                >
                  الاشعار الثاني
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={() => {
                  //   navigate("/print-notice", {
                  //     state: { student: student, notice: "notice3" },
                  //   });
                  // }}
                  onClick={() => {
                    setOpen(true);
                    setNoticeName("notice3");
                  }}
                >
                  الإعـــــــــذار
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
export const markAbsenceColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-4 dark:border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row, table }) => (
      <div className="text-base font-bold m-0 p-0">
        {table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1 ||
          0 + 1}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          اللقب والاسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex items-center gap-x-3">
            {row.original.gender === "ذكر" ? <MaleImage /> : <FemaleImage />}
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                {row.getValue("full_name")}
              </span>
              <span className="block text-sm text-gray-500">
                {row.original.student_status}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "full_class_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          القسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="p-0">
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {row.getValue("full_class_name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "absence_date",
    header: ({ column }) => {
      const { students } = useStudents();
      const numOfAbsences = students.filter((s) => s.is_absent).length;
      return (
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="ml-2 h-4 w-4" />
            تاريخ وتوقيت الغياب
          </Button>
          <Button className="ml-4 bg-emerald-300" variant={"outline"}>
            عدد الغيابات: {numOfAbsences}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex justify-between items-center">
          <div className="text-right font-medium text-gray-900">
            {/* {absenceDate} */}

            {student.absence_date !== null ? (
              <DateTimePicker studentAbsenceDate={student.absence_date} />
            ) : (
              <Badge variant={"secondary"}>حاضــــــــــر</Badge>
            )}
          </div>
          <MarkAbsenceDialog
            full_name={student.full_name}
            studentAbsenceDate={student.absence_date}
            studentID={student.id}
          />
        </div>
      );
    },
  },
];
export const recordsColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-4 dark:border-black"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row, table }) => (
      <div className="text-base font-bold m-0 p-0">
        {table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1 ||
          0 + 1}
      </div>
    ),
  },
  // {
  //   accessorKey: "full_name",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="ml-10"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //         اللقب والاسم
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const { students } = useStudents();
  //     return (
  //       <div>
  //         <div className="flex items-center gap-x-3">
  //           {filter(students, (a) => a.id=== row.original.student_id)[0]
  //             .gender === "ذكر" ? (
  //             <MaleImage />
  //           ) : (
  //             <FemaleImage />
  //           )}
  //           <div className="grow">
  //             <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
  //               {row.getValue("full_name")}
  //             </span>
  //             <span className="block text-sm text-gray-500">
  //               {row.original.student_status}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "full_class_name",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="p-0"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //         القسم
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <div className="p-0">
  //         <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
  //           {row.getValue("full_class_name")}
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "date_of_absence",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          تاريخ الغياب
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: Date = row.getValue("date_of_absence");

      return (
        <div className="text-right font-medium text-gray-500 py-1">
          {date.toLocaleString("ar-DZ", {
            weekday: "long",
          }) +
            " " +
            date.toLocaleString("en-ZA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) +
            "، الساعة: " +
            date.toLocaleString("en-ZA", {
              hour: "2-digit",
            })}
        </div>
      );
    },
  },
  {
    accessorKey: "date_of_return",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          تاريخ العودة
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: Date = row.getValue("date_of_return");

      return (
        <div className="text-right font-medium text-gray-500">
          {date ? (
            date.toLocaleString("ar-DZ", {
              weekday: "long",
            }) +
            " " +
            date.toLocaleString("en-ZA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) +
            "، الساعة: " +
            date.toLocaleString("en-ZA", {
              hour: "2-digit",
            })
          ) : (
            <StatusBadge status="غائب" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "missed_hours",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          سا/غ
        </Button>
      );
    },
    cell: ({ row }) => {
      const missedHours: number = row.getValue("missed_hours");
      return (
        missedHours >= 0 && (
          <Badge className="px-4" variant={"destructive"}>
            {missedHours + " سا"}
          </Badge>
        )
      );
    },
    enableColumnFilter: false,
  },
];
