import {
  createBrowserRouter,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import Students from "./assets/components/Students";
import Login from "./assets/components/Login";
import ErrorPage from "./assets/components/Error-page";
import Dashboard from "./assets/components/Dashboard";
import { AuthProvider } from "./assets/contexts/AuthContext";
import { Container } from "react-bootstrap";
import PrivateRoute from "./assets/components/PrivateRoute";
import NavigationBar from "./assets/components/Navbar";
// import "bootstrap/dist/css/bootstrap.rtl.min.css";

function App() {
  const router = createHashRouter([
    {
      path: "/EducationSupervisor/",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Dashboard />
        </PrivateRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/EducationSupervisor/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/EducationSupervisor/students",
      element: (
        <PrivateRoute>
          <NavigationBar />
          <Students />
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
