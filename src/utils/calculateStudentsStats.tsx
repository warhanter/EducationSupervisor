import { Student } from "@/client/assets/components/columns";

export const calculateStudentStats = (array: Student[]) => {
  const initCounts = () => ({
    داخلي: { ذكر: 0, أنثى: 0, الكل: 0 },
    "نصف داخلي": { ذكر: 0, أنثى: 0, الكل: 0 },
    المطعم: { ذكر: 0, أنثى: 0, الكل: 0 },
    خارجي: { ذكر: 0, أنثى: 0, الكل: 0 },
    الكل: { ذكر: 0, أنثى: 0, الكل: 0 },
  });

  const stats = array.reduce((acc, s) => {
    if (
      acc[s.student_status] &&
      acc[s.student_status][s.gender] !== undefined
    ) {
      acc[s.student_status][s.gender]++;
      acc[s.student_status]["الكل"]++;
      acc["الكل"][s.gender]++;
      acc["الكل"]["الكل"]++;
      if (s.student_status === "داخلي" || s.student_status === "نصف داخلي") {
        acc["المطعم"][s.gender]++;
        acc["المطعم"]["الكل"]++;
      }
    }
    return acc;
  }, initCounts());

  return stats;
};
