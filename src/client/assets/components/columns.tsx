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
export type Student = {
  _id: number;
  student_id: number;
  class_number: number;
  total_missedH: number;
  class_name: string;
  full_className: string;
  full_name: string;
  level: string;
  gender: string;
  is_fired: boolean;
  is_new: boolean;
  switched_school: boolean;
  student_DOB: Date;
  student_status: string;
  noticeName: string;
  absence_days: string;
  absence_date: Date;
  date_of_absence: Date;
  date_of_return: Date;
  missed_hours: number;
  absence_status: boolean;
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
    accessorKey: "full_className",
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
            {row.getValue("full_className")}
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
        : "متمدرس";
      return (
        <div className="ml-10">
          <StatusBadge status={status} />
        </div>
      );
    },
  },
  {
    accessorKey: "student_DOB",
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
      const date: Date = row.getValue("student_DOB");

      return (
        <div className="text-right font-medium text-gray-500 ml-10">
          {date?.toLocaleDateString("en-ZA")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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
            {filter(students, (a) => a._id === row.original.student_id)[0]
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
    accessorKey: "full_className",
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
            {row.getValue("full_className")}
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
    accessorKey: "total_missedH",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          ساعات الغياب
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-base font-bold m-0 p-0">
        {row.getValue("total_missedH")}
      </div>
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
    accessorKey: "_id",
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
    accessorKey: "full_className",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
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
            {row.getValue("full_className")}
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
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          تاريخ الغياب
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: string = row.getValue("absence_date");

      return <div className="text-right font-medium text-gray-500">{date}</div>;
    },
  },
  {
    accessorKey: "absence_days",
    header: "الأيام",
    cell: ({ row }) => {
      const date: number = row.getValue("absence_days");

      return <div className="text-right font-medium text-gray-500">{date}</div>;
    },
  },
  {
    accessorKey: "missed_hours",
    header: "سا/غ",
    cell: ({ row }) => {
      const date: number = row.getValue("missed_hours");

      return <div className="text-right font-medium text-gray-500">{date}</div>;
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
      const { absences } = useStudents();
      const navigate = useNavigate();
      const student = row.original;
      return (
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
                    (a) => a.student_id === row.original._id
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
                onClick={() => {
                  navigate("/print-notice", {
                    state: { student: student, notice: "notice1" },
                  });
                }}
              >
                الاشعار الأول
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/print-notice", {
                    state: { student: student, notice: "notice2" },
                  });
                }}
              >
                الاشعار الثاني
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/print-notice", {
                    state: { student: student, notice: "notice3" },
                  });
                }}
              >
                الإعـــــــــذار
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
    accessorKey: "_id",
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
      const { students } = useStudents();
      return (
        <div>
          <div className="flex items-center gap-x-3">
            {filter(students, (a) => a._id === row.original.student_id)[0]
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
    accessorKey: "full_className",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
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
            {row.getValue("full_className")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
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
        <div className="text-right font-medium text-gray-500">
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
