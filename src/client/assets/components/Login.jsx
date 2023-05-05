import React, { useRef, useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { loginApp, currentUser } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginApp(emailRef.current.value, passwordRef.current.value);
      setLoading(true);
      setError();
      navigate("/EducationSupervisor/students");
    } catch (error) {
      setError(error.error);
    }
    setLoading(false);
  };

  if (currentUser) {
    return <Navigate to={"/EducationSupervisor/"} replace />;
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: 400 }}>
        <Card>
          <h1 className="text-center mt-4">Sign in</h1>
          <Card.Body>
            {currentUser && <Alert>{currentUser.profile.email}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-2">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  required
                  ref={emailRef}
                />
              </Form.Group>
              <Form.Group id="password" className="my-2">
                <Form.Label>password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  required
                  ref={passwordRef}
                />
              </Form.Group>
              <Button className="my-4 w-100" type="submit" disabled={loading}>
                Login
              </Button>
              {error && <Alert variant="danger">{error}</Alert>}
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 mt-4">
          Don't have an account? please create one Sign Up
        </div>
      </div>
    </Container>
  );
};

export default Login;
