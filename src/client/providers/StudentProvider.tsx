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
  addresses: Record<string, any>[] | undefined;
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
  addresses: Record<string, any>[] | undefined;
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
  notification: {
    fullDocument: undefined,
    operationType: undefined,
  },
};

const StudentContext = createContext<StudentContextType>(defaultValues);

const StudentProvider = ({ children }: StudentsProviderProps) => {
  const mongo = app.currentUser?.mongoClient("mongodb-atlas").db("todo");
  const [loading, setLoading] = useState(true);
  const [
    { students, absences, lunchAbsences, addresses, notification },
    setStudents,
  ] = useState<StudentsType>({
    students: undefined,
    absences: undefined,
    lunchAbsences: undefined,
    addresses: undefined,
    notification: undefined,
  });
  const fetchData = async () => {
    const studentsPromise = mongo?.collection("Student").find();
    const absencesPromise = mongo?.collection("Absence").find();
    const addressesPromise = mongo?.collection("Adress").find();
    const lunchAbsencesPromise = mongo?.collection("LunchAbsence").find();
    const [
      studentsCollection,
      absencesCollection,
      addressesCollection,
      lunchAbsencesCollection,
    ] = await Promise.all([
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
  };
  return !loading ? (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  ) : (
    // <Suspense fallback={<Loading />}>{children}</Suspense>
    <SkeletonCard />
  );
};

export default StudentProvider;

/**
 * custom hook to return database collections data as lists.
 * @returns list of {key, value} pair of objects.
 */
export const useStudents = () => useContext(StudentContext);
