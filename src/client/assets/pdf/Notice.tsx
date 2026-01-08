import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Student } from "../components/columns";
import { useStudents } from "@/client/providers/StudentProvider";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale/ar-DZ";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  CircleArrowLeft,
  CircleArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";
import { ChangeAddress } from "../components/ChangeAddress";

export type Address = {
  address: string;
  date_of_birth: Date;
  father_name: string;
  first_name: string;
  full_name: string;
  last_name: string;
  phone_number: string;
  student_id: number;
};

const notice2 = "و بنــاء على الاشعار الأول المشار إليه في المرجع أعلاه.";
const notice3 =
  "و بنــاء على الاشعار الأول والثاني المشار إليهما في المرجع أعلاه.";

const Notice1Page = ({ state, setOpen }) => {
  const { theme, setTheme } = useTheme();
  const baseTheme = theme;
  const { addresses } = useStudents();
  const location = useLocation();
  const navigate = useNavigate();
  // const state = location.state;
  const student: Student = state.student;

  const noticeName = state.notice;
  const studentAdress: Record<string, any> | undefined = addresses?.filter(
    (address) => address.full_name == student.full_name
  )[0];
  console.log(student);
  console.log(studentAdress);
  let absenceDate = student.absence_date;
  if (typeof absenceDate === "string") {
    absenceDate = new Date(absenceDate);
  }
  const [noticeDate, setNoticeDate] = useState<Date | null>(null);
  const [fatherName, setFatherName] = useState(
    studentAdress?.last_name + " " + studentAdress?.father_name
  );
  const [address, setAddress] = useState(studentAdress?.address);
  const notice1Date = new Date(
    absenceDate?.getTime() + 1000 * 60 * 60 * 24 * 3
  )?.toLocaleDateString("en-ZA");
  const notice2Date = new Date(
    absenceDate?.getTime() + 1000 * 60 * 60 * 24 * 10
  )?.toLocaleDateString("en-ZA");
  const notice3Date = new Date(
    absenceDate?.getTime() + 1000 * 60 * 60 * 24 * 17
  )?.toLocaleDateString("en-ZA");

  useEffect(() => {
    setTheme("light");
    return () => {
      setTheme(baseTheme);
    };
  }, []);

  const NoticeSendDate: any = {
    notice1: notice1Date,
    notice2: notice2Date,
    notice3: notice3Date,
  };
  const sendDate = noticeDate
    ? noticeDate.toLocaleDateString("en-ZA")
    : NoticeSendDate[noticeName];

  const notice2Sub = `المرجع: الإشعـار الأول بالغيـاب بتاريخ : ${notice1Date} رقم ..........`;
  const notice3Sub = (
    <p>
      المرجع: الإشعـار الأول بالغيـاب بتاريخ :{notice1Date} رقم ..........
      <br />
      ---------- الإشعـار الثاني بالغيـاب بتاريخ :{notice2Date} رقم ...........
    </p>
  );
  const noticeHeader =
    noticeName === "notice1"
      ? "الإشعـار الأول بالغيـاب"
      : noticeName === "notice2"
      ? "الإشعـار الثاتي بالغيـاب"
      : "إعـــــــــذار";
  const gender =
    student.gender === "أنثى"
      ? { name: "ابنتكم", birth: "المولودة", absence: "تغيبت" }
      : { name: "ابنكم", birth: "المولود", absence: "تغيب" };
  return (
    <div id="section-to-print" className="chapter text-lg leading-8 m-0 p-0">
      <div className="sticky inline mx-12  justify-center gap-4 top-4 print:hidden">
        {/* <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <CircleArrowRight className="h-5 w-5" />
          </Button> */}
        <Button variant={"destructive"} onClick={() => window.print()}>
          طبــــاعة
        </Button>
      </div>
      <div className="text-center">
        <h2>الجمهورية الجزائرية الديمقراطية الشعبية</h2>
        <h2>وزارة التربية الوطنية</h2>
      </div>
      <div className="flex my-5 justify-between">
        <div>
          <h3>مديرية التربية لولاية باتنة</h3>
          <h3>ثانوية : المختلطة مروانة</h3>
          <h3> الرقم : ...............</h3>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3>السنة الدراسية : 2026/2025</h3>
          <h3>الى السيد(ة):</h3>
          <h3 className="font-bold">{fatherName}</h3>
          <h3 className="font-bold mb-4">العنوان: {address}</h3>
          <ChangeAddress
            setAddress={setAddress}
            setFatherName={setFatherName}
            address={address}
            fatherName={fatherName}
          />
        </div>
      </div>
      <div className="my-10">
        <h1 className="text-xl font-bold my-10">الموضــوع: {noticeHeader}</h1>
        <div className="mb-4">
          <p className="font-bold mb-4">
            {noticeName === "notice2"
              ? notice2Sub
              : noticeName === "notice3"
              ? notice3Sub
              : ""}
          </p>
          <p>
            بنــاءً على القـرار الوزاري رقـم: 833 والمـؤرخ فـي: 13/11/1991
            والمتعلـق بمواظبـة التلاميـذ فـي المؤسسـات التعليميـة ولاسيمـا
            المـادة: 21 منـه
          </p>
          <p>
            {noticeName === "notice2"
              ? notice2
              : noticeName === "notice3"
              ? notice3
              : ""}
          </p>
        </div>
        <p>
          يؤسفنـي أن أنهــي إلـى علمكــم بـأن {gender.name}:{" "}
          <span className="font-bold">{studentAdress?.full_name}</span>
        </p>
        <p>
          {gender.birth} بتاريخ:{" "}
          <span className="font-bold">{student.student_dob}</span>
        </p>
        <p>
          القســـــم:{" "}
          <span className="font-bold">{student.full_class_name}</span>
        </p>
        <p>
          قـد {gender.absence} عـن الدراسـة منـذ{" "}
          {absenceDate?.toLocaleDateString("en-ZA")} إلـى غايـة يومنـا هـذا.
        </p>
        {noticeName === "notice3" ? (
          <h3 className="text-l font-bold my-10">
            نحيطكم علما أن عدم الـرد سيعـرض ابنتكم إلـى الشطـب نهائـيا من قوائم
            التلاميذ بعد خمسـة عشـر (15) يومـا إبتداء من تاريـخ إرسـال هـذا
            الإعـذار
          </h3>
        ) : (
          <h3 className="text-l font-bold my-10">
            لـذا نطلـب منكـم الحضـور إلـى المؤسسـة لتبريـر الغيـاب فـور
            استلامكـم هـذا الإشعـار.
          </h3>
        )}
      </div>
      <div className="flex flex-col items-end  py-10 font-bold">
        <div className="flex items-center print:hidden mb-4 bg-primary p-1 rounded-md text-white">
          <Label className="mx-2">تغيير تاريخ الارسال: </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-center text-center font-normal",
                  sendDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-4 h-4 w-4" />
                {sendDate ? (
                  format(sendDate, "PPPP", { locale: arDZ })
                ) : (
                  <span>اختر التاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[auto] p-0">
              <Calendar
                mode="single"
                selected={noticeDate}
                onSelect={setNoticeDate}
                initialFocus
                locale={arDZ}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="text-center">
          <p>حرر في مروانة بتاريخ: {sendDate}</p>
          <h3>المديـــــــــر</h3>
        </div>
      </div>
    </div>
  );
};

export const CreatePDFNotice1 = ({ state, setOpen }) => {
  return <Notice1Page state={state} setOpen={setOpen} />;
};
