import { Check, Moon, Sun } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Theme, useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const SelectedTheme = ({ currentTheme }: { currentTheme: Theme }) => {
    const themeName =
      currentTheme === "system"
        ? "تلقائي"
        : currentTheme === "light"
        ? "أبيض"
        : "مظلم";
    return (
      <DropdownMenuItem onClick={() => setTheme(currentTheme)}>
        {currentTheme === theme && <Check className="me-2" size={15} />}
        {themeName}
      </DropdownMenuItem>
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col items-end" align="end">
        <SelectedTheme currentTheme="system" />
        <SelectedTheme currentTheme="light" />
        <SelectedTheme currentTheme="dark" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
