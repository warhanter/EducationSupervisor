import { RouterProvider, createHashRouter } from "react-router-dom";
import Students from "./assets/components/Students";
import Login from "./assets/components/Login";
import ErrorPage from "./assets/components/Error-page";
import Dashboard from "./assets/components/Dashboard";
import { AuthProvider } from "./assets/contexts/AuthContext";
import { Container } from "react-bootstrap";
import PrivateRoute from "./assets/components/PrivateRoute";
import NavigationBar from "./assets/components/Navbar";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "./App.css";
import MyDocument from "./assets/components/HTMLtoPDF";

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
