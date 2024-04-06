import React from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive({ error }) {
  const message = "اسم المستخدم أو كلمة المرور خاطئة.";
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="mb-4">لايمكن تسجيل الدخول</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
