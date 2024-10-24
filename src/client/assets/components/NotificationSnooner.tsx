import React, { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useStudents } from "@/client/providers/StudentProvider";

const addtitle = "تسجيل غياب";
const returnTitle = "عودة من الغياب";

type notificationPros = {
  fullDocument: Record<string, any> | undefined;
  operationType: string | undefined;
};

type showAlertPros = {
  notification: notificationPros | undefined;
  title: string;
  absenceStatus: boolean;
};
const showAlert = ({ notification, title, absenceStatus }: showAlertPros) => {
  if (notification && notification.fullDocument?.full_name) {
    if (absenceStatus) {
      toast.error(
        <AbsencesAlert
          notification={notification}
          title={title}
          absenceStatus={absenceStatus}
        />,
        {
          duration: 10000,
        }
      );
    } else {
      toast.success(
        <AbsencesAlert
          notification={notification}
          title={title}
          absenceStatus={absenceStatus}
        />,
        {
          duration: 60 * 60000, // 60000 = 1 minute
        }
      );
    }
  }
};

const AbsencesAlert = ({ notification, title }: showAlertPros) => {
  return (
    <div className="font-tajawal w-full">
      <h1 className="font-bold text-[1rem]">{title}</h1>
      <div className="flex justify-between items-center">
        <p className="py-2">
          التلميذ
          <span className="font-bold">
            {" " + notification?.fullDocument?.full_name + " "}
          </span>
          قسم
          <span className="font-bold">
            {" " + notification?.fullDocument?.full_className + " "}
          </span>
        </p>
      </div>
      <p className="font-bold">
        {notification?.fullDocument?.date_of_absence?.toLocaleString("en-ZA")}
      </p>
    </div>
  );
};

export function SonnerDemo() {
  const {
    notification,
    setStudents,
    absences,
    students,
    lunchAbsences,
    addresses,
    professors,
    classrooms,
  } = useStudents();
  const absenceStatus = notification?.fullDocument?.absence_status;
  const title = absenceStatus ? addtitle : returnTitle;

  useEffect(() => {
    showAlert({ notification, title, absenceStatus });
    setStudents({
      students,
      absences,
      addresses,
      lunchAbsences,
      professors,
      classrooms,
      notification: undefined,
    });
  }, [notification]);
  return <Toaster visibleToasts={5} closeButton richColors />;
}
