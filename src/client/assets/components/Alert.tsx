import React from "react";
import { AlertCircle, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive({ error }: { error: string | null }) {
  const message = "اسم المستخدم أو كلمة المرور خاطئة.";
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="mb-4">لايمكن تسجيل الدخول</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
export function AlertInfo({
  title,
  message,
  ...Props
}: {
  title: string;
  message: string;
}) {
  return (
    <Alert {...Props}>
      <div className="flex items-center">
        <Info className="h-6 w-6 ml-4" />
        <AlertTitle className="py-2">{title}</AlertTitle>
      </div>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
