import { Container } from "react-bootstrap";
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
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p style={{ color: "orangered" }}>
          <i>{error.statusText || error.message}</i>
        </p>
        <NavLink style={{ alignSelf: "center" }} to={"/"}>
          Back to Home
        </NavLink>
      </div>
    </Container>
  );
}
