import { StudentRealm, useStudents } from "../providers/StudentProvider";
import app from "../realm";
// export function canklcAbsences(absences: StudentRealm, students: StudentRealm) {
export async function calcAbsences() {
  const mongo = app.currentUser?.mongoClient("mongodb-atlas").db("todo");
  const { absences, students, classrooms } = useStudents();
  const ghiyab = absences?.filter((student) => student.absence_status);

  // remove Machtobin..
  const filtredAbsences = absences?.filter(
    (student) =>
      !students?.filter((b) => b._id === student.student_id)[0]?.is_fired
  );
  const query = `{"$lookup": {
    from: "ClassProgram",
    localField: "class_program",
    foreignField: "_id",
    as: "classProgram",
  }}`;
  const classroom = await mongo
    ?.collection("Classroom")
    .find({ class_fullName: "ثانية تسيير واقتصاد 1" });
  const classid = classroom[0]._id;
  const classProgram = mongo?.collection("Classroom").find({ _id: classid });
  // const program = classes[0].class_program;
  function updateTotals() {
    removedDubs.map((student) => {
      let total_justified = 0;
      let total_nonJustified = 0;
      const totalAbsences = absences?.filter(
        (a) => a.full_name === student.full_name
      );
      totalAbsences?.map((a) => {
        total_nonJustified += a.missed_hours ? a.missed_hours : 0;
        total_justified += a.justified_missed_hours
          ? a.justified_missed_hours
          : 0;
      });
      Object.assign(student, {
        total_missedH: total_justified + total_nonJustified,
      });
      Object.assign(student, { total_Justified: total_justified });
      Object.assign(student, { total_NonJustified: total_nonJustified });
    });
    return removedDubs;
  }
  // returns all students as {key: full_name, value: student_object}
  // to remove dublicates by full_name later.
  const allStudents = [
    ...new Map(
      filtredAbsences?.map((item) => [item["full_name"], item])
    ).values(),
  ];
  let removedDubs = allStudents?.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  const newData = updateTotals()?.sort(
    (a, b) => b.total_missedH - a.total_missedH
  );
  return newData;
}
