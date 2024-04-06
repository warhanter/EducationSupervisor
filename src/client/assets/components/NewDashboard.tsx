import { Link, useNavigate } from "react-router-dom";
import femaleImage from "../imgs/female-student.png";
import maleImage from "../imgs/student.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Users, Layers3, Utensils, ShieldBan, ArrowUpLeft } from "lucide-react";
import { useStudents } from "@/client/providers/StudentProvider";
import { Button } from "@/components/ui/button";
import { PiePlot, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { ResponsiveChartContainer } from "@mui/x-charts";
import HeaderNavbar from "./HeaderNavbar";
import { SonnerDemo } from "./NotificationSnooner";

type DataProps = {
  id: number;
  value: number | undefined;
  label: string;
};

type AppPieChartProps = {
  data: DataProps[];
  colors: string[] | undefined;
};

function AppPieChart({ data, colors }: AppPieChartProps) {
  return (
    <div style={{ width: "100%", height: 230 }}>
      <ResponsiveChartContainer
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
            fontSize: 12,
            rotate: 45,
          },
        }}
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            data,
            type: "pie",
          },
        ]}
        margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
        colors={colors ? colors : undefined}
      >
        <PiePlot />
      </ResponsiveChartContainer>
    </div>
  );
}

function PieArcLabel({
  students,
}: {
  students: Record<string, any>[] | undefined;
}) {
  const males = students?.filter((student) => student.gender === "ذكر").length;
  const females = students?.filter(
    (student) => student.gender === "أنثى"
  ).length;
  const data = [
    { id: 0, value: females, label: "الاناث" },
    { id: 1, value: males, label: "الذكور" },
  ];

  return (
    <AppPieChart
      data={data}
      // colors={["rgb(205 54 145 / 89%)", "rgb(46, 150, 255)"]}
    />
  );
}

function PieArcLabel2({
  students,
}: {
  students: Record<string, any>[] | undefined;
}) {
  const nisfDakhili = students?.filter(
    (student) => student.student_status === "نصف داخلي"
  ).length;
  const khariji = students?.filter(
    (student) => student.student_status === "خارجي"
  ).length;
  const data = [
    { id: 0, value: nisfDakhili, label: "نصف داخلي" },
    { id: 1, value: khariji, label: "خارجي" },
  ];

  return <AppPieChart data={data} />;
}
function PieArcLabel4({
  students,
}: {
  students: Record<string, any>[] | undefined;
}) {
  const ghiyab = students?.filter((student) => student.is_absent).length;
  const hodour = students?.filter((student) => !student.is_absent).length;
  const data = [
    { id: 0, value: ghiyab, label: "الغياب" },
    { id: 1, value: hodour, label: "الحضور" },
  ];

  return (
    <AppPieChart
      data={data}
      colors={["hsl(222.2 47.4% 11.2%)", "hsl(24.6 95% 53.1%)"]}
    />
  );
}
function PieArcLabel3({
  students,
}: {
  students: Record<string, any>[] | undefined;
}) {
  const level1: number | undefined = students?.filter(
    (student) => student.level === "أولى"
  ).length;
  const level2: number | undefined = students?.filter(
    (student) => student.level === "ثانية"
  ).length;
  const level3: number | undefined = students?.filter(
    (student) => student.level === "ثالثة"
  ).length;
  const data = [
    { id: 0, value: level1, label: "أولى" },
    { id: 1, value: level3, label: "ثالثة" },
    { id: 2, value: level2, label: "ثانية" },
  ];

  return (
    <AppPieChart
      data={data}
      colors={[
        "hsl(222.2 47.4% 11.2%)",
        "hsl(24.6 95% 53.1%)",
        "hsl(262.1 83.3% 57.8%)",
      ]}
    />
  );
}

type StudentCardProps = {
  student: Record<string, any>;
  gender: string;
  total: number;
};

function StudentCard({ student, gender, total }: StudentCardProps) {
  let image = femaleImage;
  if (gender === "ذكر") {
    image = maleImage;
  }
  return (
    <div className="min-w-full flex flex-row">
      <div className="whitespace-nowrap border-b">
        <div className="ps-1 md:ps-6 lg:ps-3 xl:ps-0 pe-6 md:py-2 py-1">
          <div className="flex items-center gap-x-3">
            <img
              className="inline-block size-[38px] rounded-full"
              src={image}
              alt="Image Description"
            />
            <div className="grow">
              <span className="block text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                {student.full_name}
              </span>
              <span className="block text-xs md:text-sm text-gray-500">
                {student.full_className}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="whitespace-nowrap border-b justify-end flex flex-1">
        <div className="px-6 py-2">
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {total + " سا"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NewDashboard() {
  const navigate = useNavigate();
  const { absences, students, machtobin, motamadrisin, nisfDakhili } =
    useStudents();
  const ghiyab = absences?.filter((student) => student.absence_status);
  const mamno7in = nisfDakhili?.filter((student) => student.is_mamnouh);
  const filtredAbsences = absences?.filter(
    (student) =>
      !students?.filter((b) => b._id === student.student_id)[0]?.is_fired
  );
  const removeDubs = [
    ...new Map(
      filtredAbsences?.map((item) => [item["full_name"], item])
    ).values(),
  ];
  let topStudents = removeDubs?.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  const newData = updateTotals()?.sort(
    (a, b) => b.total_missedH - a.total_missedH
  );
  function updateTotals() {
    topStudents.map((student) => {
      let total = 0;
      const totalAbsences = absences?.filter(
        (a) => a.full_name === student.full_name
      );
      totalAbsences?.map(
        (a) =>
          (total +=
            (a.missed_hours ? a.missed_hours : 0) +
            (a.justified_missed_hours ? a.justified_missed_hours : 0))
      );
      Object.assign(student, { total_missedH: total });
    });
    return topStudents;
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderNavbar />
      <main className="flex flex-1 flex-col gap-4 max-sm:py-4  md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card
            className="cursor-pointer hover:bg-indigo-50 transition-all dark:hover:text-gray-800"
            onClick={() => navigate("/newmotamadrisin")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المتمدرسون</CardTitle>
              <Layers3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{motamadrisin?.length}</div>
              <p className="text-xs text-muted-foreground">
                جميع التلاميذ في المؤسسة
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-indigo-50 transition-all dark:hover:text-gray-800"
            onClick={() => navigate("/newAbsence")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الغائبون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ghiyab?.length}</div>
              <p className="text-xs text-muted-foreground">
                التلاميذ الغائبين حتى اليوم
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-indigo-50 transition-all dark:hover:text-gray-800"
            onClick={() => navigate("/newnisfdakhili")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نصف داخلي</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nisfDakhili?.length}</div>
              <p className="text-xs text-muted-foreground">
                منهم {mamno7in?.length} ممنوحين
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-indigo-50 transition-all dark:hover:text-gray-800"
            onClick={() => navigate("/newmachtobin")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المشطوبين</CardTitle>
              <ShieldBan className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machtobin?.length}</div>
              <p className="text-xs text-muted-foreground">
                التلاميذ المنقطعين عن الدراسة
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2 w-full">
                <CardTitle>بيانات عامة</CardTitle>
                <CardDescription>
                  عرض النسب لبعض احصائيات التلاميذ.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="#">
                  عرض الكل
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 p-0 md:p-8 justify-items-cente ">
              <PieArcLabel students={students} />
              <PieArcLabel2 students={students} />
              <PieArcLabel3 students={students} />
              <PieArcLabel4 students={students} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center w-full justify-between">
                <CardTitle className="w-full  max-sm:text-md">
                  التلاميذ الاكثر غيابا
                </CardTitle>
                <Button
                  asChild
                  size="sm"
                  className="ml-auto gap-1 max-sm:h-8 max-sm:w-18 max-sm:text-xs "
                >
                  <Link to="/sortedAbsences" state={newData}>
                    عرض الكل
                    <ArrowUpLeft className="h-4 w-4 max-sm:hidden" />
                  </Link>
                </Button>
                <SonnerDemo />
              </div>
            </CardHeader>
            <CardContent className="grid gap-1 *:last:*:border-b-0 ">
              {newData &&
                newData?.slice(0, 10).map((student, index) => {
                  const gender = students?.filter(
                    (bb) => bb._id === student.student_id
                  )[0]?.gender;
                  return (
                    <StudentCard
                      key={index}
                      student={student}
                      gender={gender}
                      total={student.total_missedH}
                    />
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
