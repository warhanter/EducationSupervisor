import React, { useState } from "react";
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
import { Navigate, useNavigate } from "react-router-dom";
import { AlertDestructive } from "./Alert";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Loader } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [passwodInputType, setPasswodInputType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const navigation = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Navigate to dashboard or home page after successful login
      setLoading(false);
      // <Navigate to="/login" replace />;
      // location.reload();
      navigation("/");
    }
  };

  return user ? (
    <Navigate to={"/"} replace />
  ) : (
    <div className="flex  min-h-screen justify-center  items-center  ">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignIn}>
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
                onChange={(e) => setEmail(e.target.value)} // Fixed

                // ref={emailRef}
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
                  onChange={(e) => setPassword(e.target.value)} // Fixed

                  // ref={passwordRef}
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
