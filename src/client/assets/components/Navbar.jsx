import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import app from "../../realm";

const NavigationBar = () => {
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const handleLogout = async () => {
    try {
      await logOut();
      setLoading(true);
      setError();
      location.reload();
    } catch (error) {
      setError(error.error);
    }
    setLoading(false);
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavDropdown
          title={app?.currentUser?.profile.email + " بروفايل  "}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>
            تسجيل الخروج
          </NavDropdown.Item>
        </NavDropdown>
        <Navbar.Brand href="/EducationSupervisor/">Edu-Supervisor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/pdf")}>طباعة</Nav.Link>
            <Nav.Link onClick={() => navigate("/absences")}>الغيابات</Nav.Link>
            {/* <Nav.Link onClick={() => navigate("/students")}>التلاميذ</Nav.Link> */}
            <Nav.Link onClick={() => navigate("/")}>الرئيسية</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
