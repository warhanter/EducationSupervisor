import React from "react";
import { Container } from "react-bootstrap";
import DashboardCard from "./DashboardCard";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {
  students,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  absents,
} from "../contexts/dbconnect";
const Dashboard = () => {
  return (
    <Container className="container d-flex justify-content-center w-100 parentContainer">
      <div className="d-flex flex-row-reverse flex-wrap  justify-content w-75 align-content-center cards">
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardCard
            bgcolor="#28536b"
            title={students.length}
            subtitle="المتمدرسون"
            link="/students"
          />
          <DashboardCard
            bgcolor="#6b4e71"
            title={nisfDakhili.length}
            subtitle="نصف داخلي"
            link="/nisfdakhil"
          />
          <DashboardCard
            bgcolor="#922d50"
            title={absents.length}
            subtitle="الغيابات"
            link="/absences"
          />
          <DashboardCard
            bgcolor="#45b69c"
            title={wafidin.length}
            subtitle="الوافدون"
            link="/wafidin"
          />
          <DashboardCard
            bgcolor="#e6af2e"
            title={moghadirin.length}
            subtitle="المغادرين"
            link="/moghadirin"
          />
          <DashboardCard
            bgcolor="#191716"
            title={machtobin.length}
            subtitle="المشطوبين"
            link="/machtobin"
          />
        </Suspense>
      </div>
    </Container>
  );
};

export default Dashboard;
