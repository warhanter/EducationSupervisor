import React, { ReactNode, createContext, useContext } from "react";
import _ from "lodash";
import app from "../realm";

type StudentContextType = {
  motamadrisin: Record<string, any>[];
  wafidin: Record<string, any>[];
  moghadirin: Record<string, any>[];
  machtobin: Record<string, any>[];
  nisfDakhili: Record<string, any>[];
  otlaMaradiya: Record<string, any>[];
  maafiyin: Record<string, any>[];
  students: Record<string, any>[];
  absences: Record<string, any>[];
  lunchAbsences: Record<string, any>[];
};

type StudentsProviderProps = {
  children: ReactNode;
};
/**
 * a function to fetch data from the mongo database.
 * @param collection the name of the collection in the database.
 * @returns Promise<any>
 */
const getCollectionData = async (collection: string) => {
  const user = app.currentUser;
  const data = user?.functions["hello"]({
    query: { arg1: collection },
  });
  return data;
};
const students = await getCollectionData("Student");
const absences = await getCollectionData("Absence");
const lunchAbsences = await getCollectionData("LunchAbsence");

const defaultValues = {
  motamadrisin: [],
  wafidin: [],
  moghadirin: [],
  machtobin: [],
  nisfDakhili: [],
  otlaMaradiya: [],
  maafiyin: [],
  students: [],
  absences: [],
  lunchAbsences: [],
};
const StudentContext = createContext<StudentContextType>(defaultValues);

const StudentProvider = ({ children }: StudentsProviderProps) => {
  const motamadrisin = _.filter(
    students,
    (i) => !i.is_fired && !i.switched_school
  );
  const wafidin = _.filter(motamadrisin, (i) => i.is_new);
  const moghadirin = _.filter(students, (i) => i.switched_school);
  const machtobin = _.filter(students, (i) => i.is_fired);
  const nisfDakhili = _.filter(
    motamadrisin,
    (i) => i.student_status === "نصف داخلي"
  );
  const otlaMaradiya = _.filter(motamadrisin, (i) => i.medical_leave);
  const maafiyin = _.filter(motamadrisin, (i) => i.sport_inapt);
  const contextValue = {
    motamadrisin,
    wafidin,
    moghadirin,
    machtobin,
    nisfDakhili,
    otlaMaradiya,
    maafiyin,
    students,
    absences,
    lunchAbsences,
  };
  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;

/**
 * custom hook to return database collections data as lists.
 * @returns list of {key, value} pair of objects.
 */
export const useStudents = () => useContext(StudentContext);
