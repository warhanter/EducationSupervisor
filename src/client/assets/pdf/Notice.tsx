import React from "react";
import { useLocation } from "react-router-dom";
import { Student } from "../components/columns";
import { useStudents } from "@/client/providers/StudentProvider";

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

const Notice1Page = () => {
  const { addresses } = useStudents();
  const location = useLocation();
  const state = location.state;
  const student: Student = state.student;
  const noticeName = state.notice;
  const studentAdress: Record<string, any> | undefined = addresses?.filter(
    (address) => address.student_id == student._id
  )[0];
  let absenceDate = student.absence_date;
  if (typeof absenceDate === "string") {
    absenceDate = new Date(absenceDate);
  }
  const notice1Date = new Date(
    absenceDate?.getTime() + 1000 * 60 * 60 * 24 * 3
  )?.toLocaleDateString("en-ZA");
  const notice2Date = new Date(
    absenceDate?.getTime() + 1000 * 60 * 60 * 24 * 10
  )?.toLocaleDateString("en-ZA");
  const notice3Date = new Date(
    absenceDate?.getTime() + 1000 * 60 * 60 * 24 * 17
  )?.toLocaleDateString("en-ZA");
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
    <div className="chapter text-lg leading-8 m-0 p-0">
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
        <div className="text-center">
          <h3>السنة الدراسية : 2023/2024</h3>
          <h3>الى السيد(ة):</h3>
          <h3 className="font-bold">
            {studentAdress?.last_name + " " + studentAdress?.father_name}
          </h3>
          <h3 className="font-bold">العنوان: {studentAdress?.address}</h3>
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
          <span className="font-bold">
            {student.student_DOB?.toLocaleDateString("en-ZA")}
          </span>
        </p>
        <p>
          القســـــم:{" "}
          <span className="font-bold">{student.full_className}</span>
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
      <div className="flex flex-col items-end py-10 font-bold">
        <div className="text-center">
          <p>
            حرر في مروانة بتاريخ:{" "}
            {noticeName === "notice2"
              ? notice2Date
              : noticeName === "notice3"
              ? notice3Date
              : notice1Date}
          </p>
          <h3>المديـــــــــر</h3>
        </div>
      </div>
    </div>
  );
};

export const CreatePDFNotice1 = () => {
  return <Notice1Page />;
};
