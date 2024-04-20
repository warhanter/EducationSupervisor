import React from "react";

function StatusBadge({ status }: { status: string }) {
  let statusColor;
  let statusIcon;
  if (
    status === "تغيير مؤسسة" ||
    status === "إشعار 1" ||
    status === "إشعار 2" ||
    status === "غير ممنوح"
  ) {
    statusColor =
      "bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500";
    statusIcon =
      "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z";
  } else if (
    status === "شطب غياب" ||
    status === "إعذار" ||
    status === "غائب" ||
    status === "عدم التجديد"
  ) {
    statusColor =
      "bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500";
    statusIcon =
      "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z";
  } else if (status === "شطب") {
    statusColor =
      "bg-zinc-800 text-zinc-200 rounded-full dark:bg-red-500/10 dark:text-red-500";
    statusIcon =
      "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z";
  } else {
    statusColor =
      "bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500";
    statusIcon =
      "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z";
  }
  return (
    <div className="p-0 whitespace-nowrap">
      <span
        className={`py-1 px-1.5  justify-center inline-flex items-center gap-x-1 text-xs font-medium ${statusColor}`}
      >
        <svg
          className="size-2.5"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d={statusIcon} />
        </svg>
        {status}
      </span>
    </div>
  );
}

export default StatusBadge;
