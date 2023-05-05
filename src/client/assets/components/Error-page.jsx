import { Card, Container } from "react-bootstrap";
import { NavLink, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: 400 }}>
        <Card>
          <h1 className="m-2">404 Not Found!</h1>
          <Card.Body>
            <p>Sorry, an unexpected error has occurred.</p>
            <p style={{ color: "orangered" }}>
              <i>{error.statusText || error.message}</i>
            </p>
            <NavLink
              style={{ alignSelf: "center" }}
              to={"/EducationSupervisor/"}
            >
              Back to Home
            </NavLink>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
