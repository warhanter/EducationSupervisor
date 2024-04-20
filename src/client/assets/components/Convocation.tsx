import React, { useState } from "react";
import { ChangeAddress } from "./ChangeAddress";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/client/providers/StudentProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { arDZ } from "date-fns/locale/ar-DZ";

const actions = [
  "تأخـــــــر متكـــــــــــــرر",
  "غيـــــاب غيــر مبـــــــــــــرر",
  "تصـــــرف غيــر مقبـــــــــــول",
  "مخــــالفـــــة النظــــــــــــام",
  "الخــــروج مــن القـســم بــــدون إذن",
  "الخــــروج من المؤسســـة بــــدون إذن",
  "التدخيــن و التهريــج أثناء فترات الراحــــة",
  "عدم القيام بالواجبـــات و التحضيرات المنزليــة ",
  "الشجــار و حــــمل أشيـاء ممنوعـــــة",
  "تخـــــريب مممتلكـــات المؤسســــــة",
  "عـدم إحضارالأدوات المدرسية (كتب وكراريس...الخ) ",
  "عدم احترام الأستاذ و التشويش فـي القســـــم ",
  "مقــــابلـــة الأستـــــــــــــاذ",
];

export default function Convocation({ data, title }) {
  const { addresses } = useStudents();
  const studentAdress: Record<string, any> | undefined = addresses?.filter(
    (address) => address.student_id == data._id
  )[0];
  const [fatherName, setFatherName] = useState(
    studentAdress?.last_name + " " + studentAdress?.father_name
  );
  const [address, setAddress] = useState(studentAdress?.address);
  const [date, setDate] = useState(new Date());
  const [sendDate, setSenddate] = useState(new Date());
  const fdate = date?.toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  const fsendDate = sendDate?.toLocaleDateString("ar-DZ", {
    dateStyle: "full",
  });
  return (
    <DialogContent className="min-w-[900px] print:min-w-[700px] print:mt-0  flex flex-col items-center">
      <DialogHeader className="flex flex-row w-full justify-between items-center px-20">
        <Button onClick={() => window.print()}>طبــــاعة</Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <CalendarIcon className="ml-4 h-4 w-4" />
              <span>تعديل تاريخ الاستعداء</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[auto] p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(value) => {
                setDate(value);
              }}
              initialFocus
              locale={arDZ}
            />
          </PopoverContent>
        </Popover>
      </DialogHeader>
      <div className="flex gap-8 items-center">
        <div className="w-full overflow-scroll h-[500px] p-4">
          <div
            id="section-to-print"
            className="w-full print:max-w-[700px] p-4 print:-mt-56 print:p-0"
          >
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
                <h3>السنة الدراسية : 2023/2024</h3>
                <h3>الى السيد(ة):</h3>
                <h3 className="font-bold">{fatherName}</h3>
                <h3 className="font-bold mb-4">العنوان: {address}</h3>
                <h3 className="font-bold mb-4">
                  ولي التلميذ :{studentAdress?.full_name}
                </h3>
                <ChangeAddress
                  setAddress={setAddress}
                  setFatherName={setFatherName}
                  address={address}
                  fatherName={fatherName}
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-10 text-center">
                الموضــوع: {title}
              </h1>
              <p className="font-bold my-5 ">
                المرجــــع :القرار رقم 887 المؤرخ في 26/-10- 1991 المتعلق بنظام
                الجماعات التربوية و خاصة المواد 94/95{" "}
              </p>
            </div>
            <div>
              <p>
                المطلوب منكم الحضور إلى مكتب السيد مستشار التربية يوم :
                <span className="font-bold">{fdate}</span> على الساعة :{" "}
                <span className="font-bold">
                  <input
                    className="w-12 border rounded-sm text-center"
                    type="text"
                  />
                </span>
              </p>
              <p className="mt-4">
                وهذا للأسباب المذكورة أسفله التي تهم إبنكم / إبنتكم من القسم :
                <span className="font-bold">{data.full_className}</span>
              </p>

              <ul className="mt-5 mb-2">
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex w-[400px] justify-between font-bold py-1 mr-8"
                  >
                    <li className="list-disc">{action}</li>
                    <input type="checkbox" />
                  </div>
                ))}
              </ul>
              <p className="font-bold">
                *** أسباب أخــــرى:
                .........................................................................................................
              </p>
            </div>
            <div className="flex flex-col  items-end m-8">
              <p className="text-lg font-bold"> مروانة في : {fsendDate}</p>
              <p className="font-bold text-xl mb-5 ">مستشــــار التربيـــــة</p>
              <Popover>
                <PopoverTrigger className="print:hidden" asChild>
                  <Button>
                    <CalendarIcon className="ml-4 h-4 w-4" />
                    <span>تعديل تاريخ الارسال</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[auto] p-0">
                  <Calendar
                    mode="single"
                    selected={sendDate}
                    onSelect={(value) => {
                      setSenddate(value);
                    }}
                    initialFocus
                    locale={arDZ}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
