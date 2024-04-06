import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const emailRef = useRef<React.Ref<HTMLInputElement> | undefined>();
  const passwordRef = useRef<React.Ref<HTMLInputElement> | undefined>();
  const { loginApp, currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginApp(emailRef.current.value, passwordRef.current.value);
      setLoading(true);
      // setError(null);
      location.reload();
      navigation("/");
    } catch (error) {
      setError(error.error);
    }
    setLoading(false);
  };
  return currentUser ? (
    <Navigate to={"/"} replace />
  ) : (
    <div className="flex  min-h-screen justify-center  items-center  ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل الرقم السري واسم المستخدم الخاص بك.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">اسم المستخدم</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              ref={emailRef}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" required ref={passwordRef} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            type="submit"
            className="w-full"
          >
            دخول
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
