import React, { createContext, useContext, useState, ReactNode } from "react";

interface DateContextType {
  returnDate: Date | null;
  absenceDate: Date | null;
  updateReturnDate: (date: Date | null) => void;
  updateAbsenceDate: (date: Date | null) => void;
  clearDates: () => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [absenceDate, setAbsenceDate] = useState<Date | null>(null);

  const updateReturnDate = (date: Date | null) => {
    setReturnDate(date);
  };

  const updateAbsenceDate = (date: Date | null) => {
    setAbsenceDate(date);
  };

  const clearDates = () => {
    setReturnDate(null);
    setAbsenceDate(null);
  };

  return (
    <DateContext.Provider
      value={{
        returnDate,
        absenceDate,
        updateReturnDate,
        updateAbsenceDate,
        clearDates,
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

export function useDateContext(): DateContextType {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDateContext must be used within DateProvider");
  }
  return context;
}
