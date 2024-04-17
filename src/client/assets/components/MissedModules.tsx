import { calcAbsences } from "@/client/functions/calcAbsences";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const ShowData = ({ module, value }) => {
  return (
    <tr>
      <td className="border border-slate-700 px-5">{module}</td>
      <td className="border border-slate-700 px-20">{value}</td>
    </tr>
  );
};

export default function MissedModules() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const state = location.state;
  const studentID = state.studentID;
  const studentClass = state.studentClass;
  const name = state.name;
  console.log(studentID, studentClass);
  useEffect(() => {
    const getData = async () => {
      const missed = await calcAbsences(studentID, studentClass);
      setData(missed);
      setLoading(false);
    };
    getData();
  }, []);
  // let dataList = [];
  // for (const [key, value] of Object.entries(data)) {
  //   dataList.push(`${key}: ${value}`);
  // }
  console.log(data);
  return loading ? (
    <div className="flex h-dvh justify-center content-center items-center">
      <p className="p-5 text-xl font-bold">يرجى الانتضار...</p>
      <Loader size={40} className="animate-spin" />
    </div>
  ) : (
    <div className="text-center p-16">
      <p className="text-xl">جدول حساب الساعات الضائعة للتلميذ</p>
      <p className="text-xl font-bold">{name}</p>
      <p className="text-xl font-medium">
        قسم: <span>{studentClass}</span>
      </p>
      <div className="m-auto w-max">
        <table className="m-5 border-separate border border-slate-500">
          <thead>
            <tr>
              <th className="border border-slate-600 bg-slate-200 p-2">
                المـــــادة
              </th>
              <th className="border border-slate-600 bg-slate-200">
                الساعات الضائعة
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map((module) => (
              <ShowData module={module[0]} value={module[1]} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
