import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import _ from "lodash";
import app from "../realm";

type CollectionType = Realm.Services.MongoDB.MongoDBCollection<any> | undefined;

type StudentContextType = {
  motamadrisin: Record<string, any>[];
  wafidin: Record<string, any>[];
  moghadirin: Record<string, any>[];
  machtobin: Record<string, any>[];
  nisfDakhili: Record<string, any>[];
  otlaMaradiya: Record<string, any>[];
  maafiyin: Record<string, any>[];
  students: Record<string, any>[] | undefined;
  absences: Record<string, any>[] | undefined;
  lunchAbsences: Record<string, any>[] | undefined;
  notification:
    | {
        fullDocument: Record<string, any> | undefined;
        operationType: string | undefined;
      }
    | undefined;
};

type StudentsType = {
  students: Record<string, any>[] | undefined;
  absences: Record<string, any>[] | undefined;
  lunchAbsences: Record<string, any>[] | undefined;
  notification:
    | {
        fullDocument: Record<string, any> | undefined;
        operationType: string | undefined;
      }
    | undefined;
};

type StudentsProviderProps = {
  children: ReactNode;
};

const time1 = Date.now();
const mongo = app.currentUser?.mongoClient("mongodb-atlas").db("todo");
const studentsPromise = mongo?.collection("Student").find();
const absencesPromise = mongo?.collection("Absence").find();
const lunchAbsencesPromise = mongo?.collection("LunchAbsence").find();
const [studentsCollection, absencesCollection, lunchAbsencesCollection] =
  await Promise.all([studentsPromise, absencesPromise, lunchAbsencesPromise]);
console.log(Date.now() - time1);

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
  notification: {
    fullDocument: undefined,
    operationType: undefined,
  },
};

const StudentContext = createContext<StudentContextType>(defaultValues);

const StudentProvider = ({ children }: StudentsProviderProps) => {
  const [{ students, absences, lunchAbsences, notification }, setStudents] =
    useState<StudentsType>({
      students: studentsCollection,
      absences: absencesCollection,
      lunchAbsences: lunchAbsencesCollection,
      notification: undefined,
    });
  const watchforCollectionChanges = async (collection: CollectionType) => {
    if (!!collection) {
      for await (const change of collection.watch()) {
        let documentOBJ, operation;
        switch (change.operationType) {
          case "insert": {
            const { fullDocument, operationType } = change;
            documentOBJ = fullDocument;
            operation = operationType;
            break;
          }
          case "update": {
            const { fullDocument, operationType } = change;
            documentOBJ = fullDocument;
            operation = operationType;
            break;
          }
        }
        setStudents({
          students,
          absences: await mongo?.collection("Absence").find(),
          lunchAbsences,
          notification: {
            fullDocument: documentOBJ,
            operationType: operation,
          },
        });
      }
    }
  };

  useEffect(() => {
    watchforCollectionChanges(mongo?.collection("Absence"));
  }, []);

  console.log(students?.length);
  console.log("Rendring....");

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
    notification,
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
