import React from "react";
import { Container } from "react-bootstrap";
import DashboardCard from "./DashboardCard";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { filter } from "lodash";
import {
  students,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  otlaMaradiya,
  dataAbsences,
} from "../contexts/dbconnect";
const Dashboard = () => {
  const rapportDate = new Date().setHours(23);
  let absencesByDate = filter(
    dataAbsences,
    (i) =>
      (new Date(i.date_of_return) > rapportDate || !i.date_of_return) &&
      new Date(i.date_of_absence) <= rapportDate
  );
  return (
    <Container className="container d-flex justify-content-center w-100 parentContainer">
      <div className="d-flex flex-row-reverse flex-wrap  justify-content-between w-75 align-content-center cards">
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardCard
            bgcolor="#28536b"
            title={students?.length}
            subtitle="المتمدرسون"
            link="/students"
            // className="studentCard"
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
            subtitle="الغيابات"
            link="/absences"
            // className="ghiyabatCard"
          />
          <DashboardCard
            bgcolor="#45b69c"
            title={wafidin?.length}
            subtitle="الوافدون"
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
            bgcolor="#191716"
            title={machtobin?.length}
            subtitle="المشطوبين"
            link="/machtobin"
            // className="machtobinCard"
          />
          <DashboardCard
            bgcolor="#3f88c5"
            title={otlaMaradiya?.length}
            subtitle="العطل المرضية"
            link="/otlaMaradiya"
            // className="leaveCard"
          />
        </Suspense>
      </div>
    </Container>
  );
};

export default Dashboard;
