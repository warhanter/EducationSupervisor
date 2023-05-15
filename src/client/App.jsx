import { lazy } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { AuthProvider } from "./assets/contexts/AuthContext";
import { Container } from "react-bootstrap";
import Login from "./assets/components/Login";
import ErrorPage from "./assets/components/Error-page";
import PrivateRoute from "./assets/components/PrivateRoute";
import NavigationBar from "./assets/components/Navbar";
import MyDocument from "./assets/components/HTMLtoPDF";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "./App.css";
const Dashboard = lazy(() => import("./assets/components/Dashboard"));
const Students = lazy(() => import("./assets/components/Students"));

function App() {
  const router = createHashRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Dashboard />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
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
      path: "/nisfdakhil",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students queryTbale="nisfdakhil" />
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
  ]);

  return (
    <AuthProvider>
      <Container
        style={{ minHeight: "100vh" }}
        className="d-flex  justify-content-center"
      >
        <div style={{ minWidth: 1280 }} className="w-100">
          <RouterProvider router={router} />
        </div>
      </Container>
    </AuthProvider>
  );
}

export default App;
