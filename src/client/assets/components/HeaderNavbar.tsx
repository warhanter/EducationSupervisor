import { CircleUser, Menu, School, Search } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppLink from "./AppLink";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { ModeToggle } from "./ModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";

function HeaderNavbar() {
  const { logOut } = useAuth();
  // const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      await logOut();
      setLoading(true);
      // setError();
      location.reload();
    } catch (error) {
      // setError(error.error);
    }
    setLoading(false);
  };
  return (
    <header className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden whitespace-nowrap flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <School className="h-6 w-6" />
          <span className="sr-only">مساعد المشرف</span>
        </Link>
        <AppLink to="/" link="الرئيسية" />
        <AppLink to="/allStudents" link="كل التلاميذ" />
        <AppLink to="/absences" link="الغيابات" />
        {/* <AppLink to="/absences" link="اشعارات" /> */}
        <NavigationMenu className="text-right">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-muted-foreground transition-colors hover:text-foreground">
                قوائم
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-4">
                  <AppLink to="/maafiyin" link="المعفيين" subLink />
                  <AppLink to="/moghadirin" link="المغادرين" subLink />
                  <AppLink to="/wafidin" link="الوافدين" subLink />
                  <AppLink to="/otlaMaradiya" link="العطل المرضية" subLink />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <AppLink to="/print-pdf" link="طباعة" />
        <AppLink to="/daily-report" link="التقرير اليومي" />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" id="sheet">
          <nav dir="rtl" className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <School className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <AppLink to="/" link="الرئيسية" />
            <AppLink to="/allStudents" link="كل التلاميذ" />
            <AppLink to="/absences" link="الغيابات" />
            {/* <AppLink to="/Absence" link="اشعارات" /> */}
            <AppLink to="/print-pdf" link="طباعة" />
            <AppLink to="/daily-report" link="التقرير اليومي" />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 text-right">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="بحث..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              direction: "rtl",
            }}
          >
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>إعدادات</DropdownMenuItem>
            <DropdownMenuItem>الدعم</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={loading}>
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default HeaderNavbar;
