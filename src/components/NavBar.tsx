import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <Navbar bg="success" variant="dark" expand="lg" className="shadow-sm p-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          Brand New
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white fw-bold">
              Home
            </Nav.Link>
            <>
              <Nav.Link
                as={Link}
                to="/Cart"
                className="text-white fw-bold"
              >
                Cart
              </Nav.Link>
            </>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
