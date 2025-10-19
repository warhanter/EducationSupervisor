import React, { useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { useStudents } from "@/client/providers/StudentProvider";

// Constants
const NOTIFICATION_TITLES = {
  ABSENCE: "تسجيل غياب",
  RETURN: "عودة من الغياب",
} as const;

const NOTIFICATION_DURATION = {
  ABSENCE: 10000, // 10 seconds
  RETURN: 3600000, // 60 minutes
} as const;

// Types
type Notification = {
  fullDocument: Record<string, any> | undefined;
  operationType: string | undefined;
};

type AbsenceAlertProps = {
  notification: Notification;
  title: string;
};

// Components
const AbsenceAlert = ({ notification, title }: AbsenceAlertProps) => {
  const fullName = notification?.fullDocument?.full_name;
  const className = notification?.fullDocument?.full_className;
  const dateOfAbsence = notification?.fullDocument?.date_of_absence;

  return (
    <div className="font-tajawal w-full">
      <h1 className="font-bold text-[1rem]">{title}</h1>
      <div className="flex justify-between items-center">
        <p className="py-2">
          التلميذ
          <span className="font-bold"> {fullName} </span>
          قسم
          <span className="font-bold"> {className} </span>
        </p>
      </div>
      {dateOfAbsence && (
        <p className="font-bold">
          {new Date(dateOfAbsence).toLocaleString("en-ZA")}
        </p>
      )}
    </div>
  );
};

export function SonnerDemo() {
  const { notification } = useStudents();

  // Show notification based on absence status
  const showNotification = useCallback((notification: Notification) => {
    const { fullDocument } = notification;

    // Guard: Check if we have the necessary data
    if (!fullDocument?.full_name) {
      return;
    }

    const isAbsence = fullDocument.absence_status;
    const title = isAbsence
      ? NOTIFICATION_TITLES.ABSENCE
      : NOTIFICATION_TITLES.RETURN;
    const duration = isAbsence
      ? NOTIFICATION_DURATION.ABSENCE
      : NOTIFICATION_DURATION.RETURN;

    const alertContent = (
      <AbsenceAlert notification={notification} title={title} />
    );

    // Show appropriate toast based on absence status
    if (isAbsence) {
      toast.error(alertContent, { duration });
    } else {
      toast.success(alertContent, { duration });
    }
  }, []);

  // Handle notification changes
  useEffect(() => {
    if (notification) {
      showNotification(notification);
    }
  }, [notification, showNotification]);

  return (
    <Toaster visibleToasts={5} closeButton richColors position="top-right" />
  );
}
