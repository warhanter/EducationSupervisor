import { calcAbsences } from "@/client/functions/calcAbsences";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinnerNew from "./LoadingSpinnerNew";
const ShowData = ({ module, value }) => {
  return (
    <tr>
      <td className="border border-slate-700 px-5 py-1">{module}</td>
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
  useEffect(() => {
    const getData = async () => {
      const missed = await calcAbsences(studentID, studentClass);
      setData(missed);
      setLoading(false);
    };
    getData();
  }, []);
  return loading ? (
    <LoadingSpinnerNew />
  ) : (
    <div className="text-center p-10">
      <p className="text-xl bg-secondary p-3 rounded-md w-fit m-auto">
        جدول حساب مجموع الساعات الضائعة لكل مادة
      </p>
      <p className="text-xl font-bold p-2">
        للتلميذ(ة): <span>{name}</span>
      </p>
      <p className="text-xl font-medium">
        قسم: <span>{studentClass}</span>
      </p>
      <div className="m-auto w-max">
        <table className="m-5 border-separate border border-zinc-500 border-slate-500">
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
            {Object.entries(data).map((module, index) => (
              <ShowData key={index} module={module[0]} value={module[1]} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
