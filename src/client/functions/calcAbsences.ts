import app from "../realm";
export async function calcAbsences(studentID, studentClass) {
  Date.prototype.between = function (start: Date, end: Date) {
    return this.getTime() >= start.getTime() && this.getTime() <= end.getTime();
  };
  const mongo = app.currentUser?.mongoClient("mongodb-atlas").db("todo");
  const holidays = await mongo?.collection("Holidays").find();
  const students = await mongo?.collection("Student").find();
  const absences = await mongo?.collection("Absence").find();

  // remove Machtobin..
  const filtredAbsences = absences?.filter(
    (student) =>
      !students?.filter((b) => b._id === student.student_id)[0]?.is_fired
  );
  const selectedClass = filtredAbsences?.filter(
    (student) => student.student_id === studentID
  );

  const selectedClassProgram = await mongo?.collection("Classroom").aggregate([
    {
      $lookup: {
        from: "ClassProgram",
        localField: "class_program",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "Professor",
              localField: "professor",
              foreignField: "_id",
              as: "module",
            },
          },
        ],
        as: "program",
      },
    },
    {
      $match: {
        class_fullName: studentClass,
      },
    },
  ]);
  const weekProgram = selectedClassProgram[0].program;

  function missed_Modules() {
    let classMissedModules = [];
    let globalmissed = [];
    selectedClass?.map((student) => {
      let missedModules = [];
      const date1 = student.date_of_return
        ? student.date_of_return.getTime()
        : new Date().getTime();
      const date2 = student.date_of_absence
        ? student.date_of_absence.getTime()
        : new Date().getTime();
      const absenceHours = Math.round((date1 - date2) / (1000 * 60 * 60));
      if (absenceHours) {
        for (let i = 0; i < absenceHours; i++) {
          const absenceTime = new Date(date2 + 1000 * 60 * 60 * i);
          let isHoliday = false;
          holidays?.map((holiday) => {
            if (absenceTime.between(holiday.start_date, holiday.end_date)) {
              isHoliday = true;
              return;
            }
          });
          const hourProgram = weekProgram.filter(
            (module) =>
              module.day ===
                absenceTime.toLocaleString("ar-DZ", {
                  weekday: "long",
                }) && module.hour === absenceTime.getHours()
          );
          if (hourProgram[0] && !isHoliday) {
            missedModules.push(hourProgram[0].module[0].module_name);
            globalmissed.push(hourProgram[0].module[0].module_name);
          }
        }
        classMissedModules.push({
          [student.date_of_absence.toLocaleString("en-ZA") +
          " --> " +
          student?.date_of_return?.toLocaleString("en-ZA")]: missedModules,
        });
      }
    });
    return globalmissed;
  }

  const finalResult = missed_Modules();
  const counts = {};
  finalResult.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
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
  // const newData = updateTotals()?.sort(
  //   (a, b) => b.total_missedH - a.total_missedH
  // );
  return counts;
}
