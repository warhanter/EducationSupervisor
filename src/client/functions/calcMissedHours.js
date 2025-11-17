/**
 * حساب ساعات الدراسة الفائتة للطالب مع التعامل مع الحالات الحدية
 * @param {Date} startDateTime - تاريخ ووقت بداية الغياب
 * @param {Date} endDateTime - تاريخ ووقت نهاية الغياب
 * @param {Array<Date|Object>} holidays - مصفوفة بتواريخ أيام العطل (يمكن أن تكون Date منفردة أو {start: Date, end: Date} لنطاق)
 * @param {Array<Date|Object>} medicalLeave - مصفوفة بتواريخ أيام العطل (يمكن أن تكون Date منفردة أو {start: Date, end: Date} لنطاق)
 * @returns {Object} - كائن يحتوي على عدد الساعات الفائتة وتفاصيل الأيام
 */
export function calculateMissedHours(
  startDateTime,
  endDateTime,
  holidays = [],
  medicalLeave = []
) {
  // التأكد من أن التواريخ صحيحة
  if (startDateTime > endDateTime) {
    throw new Error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
  }

  // الجمع بين العطل
  const allHolidays = holidays.concat(medicalLeave);

  // تحويل أيام العطل إلى مجموعة من الـ strings للمقارنة السريعة
  const holidayStrings = new Set();

  allHolidays.forEach((holiday) => {
    if (holiday.start && holiday.end) {
      // نطاق عطلة
      const start = new Date(holiday.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(holiday.end);
      end.setHours(0, 0, 0, 0);

      const current = new Date(start);
      while (current <= end) {
        holidayStrings.add(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    } else {
      // يوم عطلة منفرد
      holidayStrings.add(new Date(holiday).toISOString().split("T")[0]);
    }
  });

  let totalHours = 0;
  let detailedDays = [];

  // البدء من تاريخ البداية
  const current = new Date(startDateTime);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDateTime);
  const endDateOnly = new Date(end);
  endDateOnly.setHours(0, 0, 0, 0);

  while (current <= endDateOnly) {
    const dayOfWeek = current.getDay();
    const currentDateString = current.toISOString().split("T")[0];
    const isHoliday = holidayStrings.has(currentDateString);

    let hoursForDay = 0;
    let dayName = "";
    const isFirstDay =
      current.getTime() === new Date(startDateTime).setHours(0, 0, 0, 0);
    const isLastDay = current.getTime() === endDateOnly.getTime();

    if (!isHoliday && dayOfWeek !== 5 && dayOfWeek !== 6) {
      // الحصول على جدول اليوم
      const schedule = getDaySchedule(dayOfWeek);

      if (schedule) {
        if (isFirstDay && isLastDay) {
          // نفس اليوم - حساب الفترة بين وقت المغادرة والعودة
          hoursForDay = calculateHoursForTimeRange(
            startDateTime,
            endDateTime,
            schedule
          );
        } else if (isFirstDay) {
          // اليوم الأول - حساب من وقت المغادرة حتى نهاية اليوم الدراسي
          const endOfDay = new Date(current);
          endOfDay.setHours(16, 30, 0, 0);
          hoursForDay = calculateHoursForTimeRange(
            startDateTime,
            endOfDay,
            schedule
          );
        } else if (isLastDay) {
          // اليوم الأخير - حساب من بداية اليوم الدراسي حتى وقت العودة
          const startOfDay = new Date(current);
          startOfDay.setHours(8, 0, 0, 0);
          hoursForDay = calculateHoursForTimeRange(
            startOfDay,
            endDateTime,
            schedule
          );
        } else {
          // يوم كامل
          hoursForDay = schedule.totalHours;
        }

        dayName = getDayName(dayOfWeek);
      }
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      dayName = getDayName(dayOfWeek) + " (عطلة أسبوعية)";
    } else {
      dayName = getDayName(dayOfWeek) + " (عطلة رسمية)";
    }

    totalHours += hoursForDay;

    detailedDays.push({
      date: currentDateString,
      dayName: dayName,
      hours: parseFloat(Math.ceil(hoursForDay)),
      isHoliday: isHoliday || dayOfWeek === 5 || dayOfWeek === 6,
      isPartialDay:
        (isFirstDay || isLastDay) &&
        hoursForDay > 0 &&
        hoursForDay < getDaySchedule(dayOfWeek)?.totalHours,
    });

    current.setDate(current.getDate() + 1);
  }

  return {
    totalHours: parseFloat(Math.ceil(totalHours)),
    days: detailedDays,
    period: {
      from: startDateTime.toISOString(),
      to: endDateTime.toISOString(),
    },
  };
}

/**
 * الحصول على جدول اليوم الدراسي
 */
function getDaySchedule(dayOfWeek) {
  const schedules = {
    0: {
      // الأحد
      totalHours: 7,
      sessions: [
        { start: 8 * 60, end: 12 * 60 }, // 8:00 - 12:00 (4 ساعات)
        { start: 13 * 60 + 30, end: 16 * 60 + 30 }, // 13:30 - 16:30 (3 ساعات)
      ],
    },
    1: {
      // الاثنين
      totalHours: 7,
      sessions: [
        { start: 8 * 60, end: 12 * 60 },
        { start: 13 * 60 + 30, end: 16 * 60 + 30 },
      ],
    },
    2: {
      // الثلاثاء
      totalHours: 4,
      sessions: [
        { start: 8 * 60, end: 12 * 60 }, // 8:00 - 12:00 (4 ساعات)
      ],
    },
    3: {
      // الأربعاء
      totalHours: 7,
      sessions: [
        { start: 8 * 60, end: 12 * 60 },
        { start: 13 * 60 + 30, end: 16 * 60 + 30 },
      ],
    },
    4: {
      // الخميس
      totalHours: 7,
      sessions: [
        { start: 8 * 60, end: 12 * 60 },
        { start: 13 * 60 + 30, end: 16 * 60 + 30 },
      ],
    },
  };

  return schedules[dayOfWeek] || null;
}

/**
 * حساب الساعات الفائتة خلال فترة زمنية محددة في يوم دراسي
 */
function calculateHoursForTimeRange(startTime, endTime, schedule) {
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  let missedMinutes = 0;

  for (const session of schedule.sessions) {
    // تحديد نقطة البداية الفعلية للفترة المفقودة في هذه الجلسة
    const sessionStart = Math.max(session.start, startMinutes);
    // تحديد نقطة النهاية الفعلية للفترة المفقودة في هذه الجلسة
    const sessionEnd = Math.min(session.end, endMinutes);

    // إذا كانت هناك تقاطع بين فترة الغياب والجلسة الدراسية
    if (sessionStart < sessionEnd) {
      missedMinutes += sessionEnd - sessionStart;
    }
  }

  return missedMinutes / 60; // تحويل الدقائق إلى ساعات
}

/**
 * دالة مساعدة للحصول على اسم اليوم بالعربية
 */
function getDayName(dayOfWeek) {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  return days[dayOfWeek];
}
