import { supabase } from "@/lib/supabaseClient";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Navigate to dashboard or home page after successful login
      navigate("/"); // Change to your desired route
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ textAlign: "right", maxWidth: 400 }}>
        <Card>
          <h1 className="text-center mt-4">تسجيل الدخول</h1>
          <Card.Body>
            <Form onSubmit={handleSignIn}>
              <Form.Group id="email" className="mb-2">
                <Form.Label>اسم المستخدم</Form.Label>
                <Form.Control
                  style={{ textAlign: "right" }}
                  type="text"
                  placeholder="اسم المستخدم"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Fixed
                />
              </Form.Group>
              <Form.Group id="password" className="my-2">
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control
                  style={{ textAlign: "right" }}
                  type="password"
                  placeholder="كلمة المرور"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Fixed
                />
              </Form.Group>
              <Button className="my-4 w-100" type="submit" disabled={loading}>
                {loading ? "جاري التحميل..." : "دخول"}
              </Button>
              {error && <Alert variant="danger">{error}</Alert>}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
