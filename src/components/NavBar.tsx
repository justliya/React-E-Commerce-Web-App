import React from "react";
import { Nav, Navbar, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FaShoppingCart } from "react-icons/fa";

const NavBar: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <Navbar bg="warning" variant="dark" expand="lg" className="shadow-sm p-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          Brand New
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-dark fw-bold">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-dark fw-bold">
              <FaShoppingCart size={20} /> Cart
              {cartItems.length > 0 && (
                <Badge pill bg="danger" className="ms-1">
                  {cartItems.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
