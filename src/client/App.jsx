import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
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

function App() {
  const router = createBrowserRouter(
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
          <Route path="allStudents" element={<NewTable queryTbale="all" />} />
          <Route path="students" element={<NewTable queryTbale="Student" />} />
          <Route path="absences" element={<NewTable queryTbale="Absence" />} />
          <Route
            path="motamadrisin"
            element={<NewTable queryTbale="motamadrisin" />}
          />
          <Route
            path="nisfdakhili"
            element={<NewTable queryTbale="nisfdakhili" />}
          />
          <Route path="wafidin" element={<NewTable queryTbale="wafidin" />} />
          <Route
            path="moghadirin"
            element={<NewTable queryTbale="moghadirin" />}
          />
          <Route
            path="machtobin"
            element={<NewTable queryTbale="machtobin" />}
          />
          <Route path="maafiyin" element={<NewTable queryTbale="maafiyin" />} />
          <Route
            path="otlaMaradiya"
            element={<NewTable queryTbale="otlaMaradiya" />}
          />
          <Route
            path="sortedAbsences"
            element={<NewTable queryTbale="sortedAbsences" />}
          />
          <Route
            path="studentAbsencesRecords"
            element={<NewTable queryTbale="studentAbsencesRecords" />}
          />
          <Route path="print-pdf" element={<PDFPrint />} />
          <Route path="print-pdf" element={<PDFPrint />} />
          <Route path="print-notice" element={<CreatePDFNotice1 />} />
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
