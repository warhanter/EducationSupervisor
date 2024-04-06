import { lazy } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { AuthProvider } from "./assets/contexts/AuthContext";
import StudentProvider from "./providers/StudentProvider";
import { Container } from "react-bootstrap";
import Login from "./assets/components/Login";
import ErrorPage from "./assets/components/Error-page";
import PrivateRoute from "./assets/components/PrivateRoute";
import NavigationBar from "./assets/components/Navbar";
import MyDocument from "./assets/components/HTMLtoPDF";
// import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "./App.css";
import NewTable from "./assets/components/NewTable";
import { NewDashboard } from "./assets/components/NewDashboard";
import PDFPrint from "./assets/components/PDFPrint";
import { ThemeProvider } from "@/components/theme-provider";
import LoginForm from "./assets/components/LoginForm";
import { SkeletonCard } from "./assets/components/SkeletonCard";
import { ComboboxPopover } from "./assets/components/Tests";
import { CreatePDFNotice1 } from "./assets/pdf/Notice";
const Dashboard = lazy(() => import("./assets/components/Dashboard"));
const Students = lazy(() => import("./assets/components/Students"));

function App() {
  const router = createHashRouter([
    {
      path: "/old",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Dashboard />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/oldlogin",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <LoginForm />,
      errorElement: <ErrorPage />,
    },

    {
      path: "/pdf",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <MyDocument />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/students",

      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="Student" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/absences",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="Absence" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/nisfdakhili",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="nisfdakhili" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/wafidin",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="wafidin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/moghadirin",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="moghadirin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/machtobin",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="machtobin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/otlaMaradiya",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="otlaMaradiya" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      errorElement: <ErrorPage />,
    },

    // New  design #######################################
    {
      path: "/newtable",
      element: (
        <PrivateRoute>
          <NewTable />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <NewDashboard />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newnisfdakhili",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="nisfdakhili" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newwafidin",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="wafidin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newotlaMaradiya",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="otlaMaradiya" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newmotamadrisin",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="motamadrisin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newmoghadirin",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="moghadirin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newmachtobin",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="machtobin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newmaafiyin",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="maafiyin" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/newAbsence",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="Absence" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/sortedAbsences",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="sortedAbsences" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/studentAbsencesRecords",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="studentAbsencesRecords" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/allStudents",
      element: (
        <PrivateRoute>
          <NewTable queryTbale="all" />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/print-pdf",
      element: (
        <PrivateRoute>
          <PDFPrint />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/print-notice",
      element: (
        <PrivateRoute>
          <CreatePDFNotice1 />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    // New  design #######################################
  ]);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="container px-3">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
