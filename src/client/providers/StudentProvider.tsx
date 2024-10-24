import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import _ from "lodash";
import app from "../realm";
import { SkeletonCard } from "../assets/components/SkeletonCard";

type CollectionType = Realm.Services.MongoDB.MongoDBCollection<any> | undefined;
type Notification = {
  fullDocument: Record<string, any> | undefined;
  operationType: string | undefined;
};
export type StudentRealm = Record<string, any>[] | undefined;
export type StudentList = Record<string, any>[];
export type Student = Record<string, any>;
type StudentsType = {
  students: StudentRealm;
  absences: StudentRealm;
  addresses: StudentRealm;
  lunchAbsences: StudentRealm;
  classrooms: StudentRealm;
  professors: StudentRealm;
  notification: Notification | undefined;
};
type StudentsProviderProps = {
  children: ReactNode;
};

type StudentContextType = {
  motamadrisin: StudentList;
  wafidin: StudentList;
  moghadirin: StudentList;
  machtobin: StudentList;
  nisfDakhili: StudentList;
  otlaMaradiya: StudentList;
  maafiyin: StudentList;
  students: StudentRealm;
  absences: StudentRealm;
  addresses: StudentRealm;
  lunchAbsences: StudentRealm;
  classrooms: StudentRealm;
  professors: StudentRealm;
  notification: Notification | undefined;
  setStudents: ({
    students,
    absences,
    addresses,
    lunchAbsences,
    notification,
    professors,
  }: StudentsType) => void;
};

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
  addresses: [],
  lunchAbsences: [],
  classrooms: [],
  professors: [],
  setStudents: () => {},
  notification: {
    fullDocument: undefined,
    operationType: undefined,
  },
};

const StudentContext = createContext<StudentContextType>(defaultValues);

const StudentProvider = ({ children }: StudentsProviderProps) => {
  const mongo = app.currentUser?.mongoClient("mongodb-atlas").db("2024");
  const [loading, setLoading] = useState(true);
  const [
    {
      students,
      absences,
      lunchAbsences,
      addresses,
      notification,
      classrooms,
      professors,
    },
    setStudents,
  ] = useState<StudentsType>({
    students: undefined,
    absences: undefined,
    lunchAbsences: undefined,
    addresses: undefined,
    notification: undefined,
    classrooms: undefined,
    professors: undefined,
  });
  const fetchData = async () => {
    const classroomsPromise = mongo?.collection("Classroom").find();
    const professorsPromise = mongo?.collection("Professor").find();
    const studentsPromise = mongo?.collection("Student").find();
    const absencesPromise = mongo?.collection("Absence").find();
    const addressesPromise = mongo?.collection("Adress").find();
    const lunchAbsencesPromise = mongo?.collection("LunchAbsence").find();
    const [
      classroomsCollection,
      professorsCollection,
      studentsCollection,
      absencesCollection,
      addressesCollection,
      lunchAbsencesCollection,
    ] = await Promise.all([
      classroomsPromise,
      professorsPromise,
      studentsPromise,
      absencesPromise,
      addressesPromise,
      lunchAbsencesPromise,
    ]);
    setStudents({
      students: studentsCollection,
      absences: absencesCollection,
      addresses: addressesCollection,
      lunchAbsences: lunchAbsencesCollection,
      classrooms: classroomsCollection,
      professors: professorsCollection,
      notification: undefined,
    });
    setLoading(false);
  };

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
          students: await mongo?.collection("Student").find(),
          absences: await mongo?.collection("Absence").find(),
          lunchAbsences,
          addresses,
          classrooms,
          professors,
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
    fetchData();
  }, []);
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
    addresses,
    lunchAbsences,
    notification,
    classrooms,
    professors,
    setStudents,
  };
  return !loading ? (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  ) : (
    <SkeletonCard />
  );
};

export default StudentProvider;

/**
 * custom hook to return database collections data as lists.
 * @returns list of {key, value} pair of objects.
 */
export const useStudents = () => useContext(StudentContext);
