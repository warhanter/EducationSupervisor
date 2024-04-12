import { Card, Container } from "react-bootstrap";
import { NavLink, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col  min-h-screen justify-center  items-center text-center">
      <h1 className="m-2 text-xl font-medium">خطأ 404!</h1>
      <p style={{ color: "orangered" }}>
        <i>{error.statusText || error.message}</i>
      </p>
      <p className="m-4 text-2xl">الصفحة التي تبحث عنها غير موجودة.</p>
      <NavLink className="hover:bg-accent p-2 rounded-md text-cyan-700" to="/">
        اضغط للعودة الى الصفحة الرئيسية
      </NavLink>
    </div>
  );
}
