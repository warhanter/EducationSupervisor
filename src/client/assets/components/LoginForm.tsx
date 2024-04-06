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
import { AlertDestructive } from "./Alert";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Loader } from "lucide-react";

export default function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { loginApp, currentUser } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [passwodInputType, setPasswodInputType] = useState("password");

  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await loginApp(emailRef.current?.value, passwordRef.current?.value);
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
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>
              أدخل الرقم السري واسم المستخدم الخاص بك.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                required
                ref={emailRef}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwodInputType}
                  placeholder="password"
                  required
                  ref={passwordRef}
                />
                {passwodInputType === "password" ? (
                  <EyeClosedIcon
                    className="absolute top-3 left-4 cursor-pointer"
                    onClick={() => setPasswodInputType("text")}
                  />
                ) : (
                  <EyeOpenIcon
                    className="absolute top-3 left-4 cursor-pointer"
                    onClick={() => setPasswodInputType("password")}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="felx flex-col gap-6">
            <Button
              // onClick={handleSubmit}
              disabled={loading}
              type="submit"
              className="w-full"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : "دخول"}
            </Button>
            {error && <AlertDestructive error={error} />}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
