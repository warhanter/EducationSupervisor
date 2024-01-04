import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DashboardCard from "./DashboardCard";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { filter } from "lodash";
import { useStudents } from "../../providers/StudentProvider";
import app from "../../realm";
import useInterval from "../../hooks/useInterval";
const Dashboard = () => {
  const {
    motamadrisin,
    wafidin,
    moghadirin,
    machtobin,
    nisfDakhili,
    otlaMaradiya,
    maafiyin,
    absences,
    lunchAbsences,
  } = useStudents();

  const rapportDate = new Date().setHours(23);
  const date1 = new Date().setHours(7);
  const date2 = new Date().setHours(23);
  let filteredAbsenceData = filter(
    lunchAbsences,
    (i) =>
      new Date(i.absence_date).getTime() > date1 &&
      new Date(i.absence_date).getTime() < date2
  );
  let absencesByDate = filter(
    absences,
    (i) =>
      (new Date(i.date_of_return) > rapportDate || !i.date_of_return) &&
      new Date(i.date_of_absence) <= rapportDate
  );
  const [user] = useState(app.currentUser);
  return (
    <Container className="container d-flex justify-content-center w-100 parentContainer">
      <div className="d-flex flex-row-reverse flex-wrap  justify-content-between w-75 align-content-center cards">
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardCard
            bgcolor="#28536b"
            title={motamadrisin?.length}
            subtitle="التلاميذ"
            link="/students"
            // className="studentCard"
          />
          <DashboardCard
            bgcolor="#45b69c"
            title={wafidin?.length}
            subtitle="الوافدين"
            link="/wafidin"
            // className="wafidinCard"
          />
          <DashboardCard
            bgcolor="#e6af2e"
            title={moghadirin?.length}
            subtitle="المغادرين"
            link="/moghadirin"
            // className="moghadirinCard"
          />

          <DashboardCard
            bgcolor="#6b4e71"
            title={nisfDakhili?.length}
            subtitle="نصف داخلي"
            link="/nisfdakhili"
            // className="nisfdakhiliCard"
          />
          <DashboardCard
            bgcolor="#922d50"
            title={absencesByDate?.length}
            subtitle="غيابات التلاميذ"
            link="/absences"
            // className="ghiyabatCard"
          />
          <DashboardCard
            bgcolor="#922d50"
            title={filteredAbsenceData?.length}
            subtitle="غيابات  المطعم"
            // link="/absences"
            // className="ghiyabatCard"
          />
          <DashboardCard
            bgcolor="#3f88c5"
            title={otlaMaradiya?.length}
            subtitle="العطل المرضية"
            link="/otlaMaradiya"
            // className="leaveCard"
          />
          <DashboardCard
            bgcolor="#3f88c5"
            title={maafiyin?.length}
            subtitle="المعفيين من الرياضة"
            // link="/otlaMaradiya"
            // className="leaveCard"
          />
          <DashboardCard
            bgcolor="#191716"
            title={machtobin?.length}
            subtitle="المشطوبين"
            link="/machtobin"
            // className="machtobinCard"
          />
        </Suspense>
      </div>
    </Container>
  );
};

export default Dashboard;
