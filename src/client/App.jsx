import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  createHashRouter,
} from "react-router-dom";
import { AuthProvider } from "./assets/contexts/AuthContext";
import StudentProvider from "./providers/StudentProvider";
import ErrorPage from "./assets/components/Error-page";
import PrivateRoute from "./assets/components/PrivateRoute";
import "./App.css";
import NewTable from "./assets/components/NewTable";
import { NewDashboard } from "./assets/components/NewDashboard";
import PDFPrint from "./assets/components/PDFPrint";
import { ThemeProvider } from "@/components/theme-provider";
import LoginForm from "./assets/components/LoginForm";
import { CreatePDFNotice1 } from "./assets/pdf/Notice";
import HeaderNavbar from "./assets/components/HeaderNavbar";
import MissedModules from "./assets/components/MissedModules";
import PDFPrintTables from "./assets/components/PDFPrintTables";
import StudentCard from "./assets/components/StudentCard";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route
          element={
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          }
          errorElement={<ErrorPage />}
        >
          <Route path="/" element={<NewDashboard />} />
          {/* <Route path="/" element={<StudentCard />} /> */}
          <Route path="/allStudents" element={<NewTable queryTbale="all" />} />
          <Route path="/students" element={<NewTable queryTbale="Student" />} />
          <Route path="/absences" element={<NewTable queryTbale="Absence" />} />
          <Route path="/pdf-print-table" element={<PDFPrintTables />} />
          <Route
            path="/motamadrisin"
            element={<NewTable queryTbale="motamadrisin" />}
          />
          <Route
            path="/nisfdakhili"
            element={<NewTable queryTbale="nisfdakhili" />}
          />
          <Route path="/wafidin" element={<NewTable queryTbale="wafidin" />} />
          <Route
            path="/moghadirin"
            element={<NewTable queryTbale="moghadirin" />}
          />
          <Route
            path="/machtobin"
            element={<NewTable queryTbale="machtobin" />}
          />
          <Route
            path="/maafiyin"
            element={<NewTable queryTbale="maafiyin" />}
          />{" "}
          <Route path="/mo3idin" element={<NewTable queryTbale="mo3idin" />} />{" "}
          <Route
            path="/mosadidin"
            element={<NewTable queryTbale="mosadidin" />}
          />
          .
          <Route
            path="/mamnouhin"
            element={<NewTable queryTbale="mamnouhin" />}
          />
          <Route
            path="/otlaMaradiya"
            element={<NewTable queryTbale="otlaMaradiya" />}
          />
          <Route
            path="/sortedAbsences"
            element={<NewTable queryTbale="sortedAbsences" />}
          />
          <Route
            path="/studentAbsencesRecords"
            element={<NewTable queryTbale="studentAbsencesRecords" />}
          />
          <Route path="/studentMissedModules" element={<MissedModules />} />
          <Route path="/print-pdf" element={<PDFPrint />} />
          <Route path="/student-cards" element={<StudentCard />} />
          <Route path="/print-notice" element={<CreatePDFNotice1 />} />
        </Route>
        <Route path="/login" element={<LoginForm />} />
      </>
    )
  );
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
