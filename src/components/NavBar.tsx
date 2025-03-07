import React from "react";
import { Nav, Navbar, Container, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FaShoppingCart } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<{ user: boolean }> = ({ user }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Navbar bg="warning" variant="dark" expand="lg" className="shadow-sm p-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          Brand New
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
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

            {/* Logout Button - Only visible if user is logged in */}
            {user && (
              <Button
                variant="outline-dark"
                className="ms-3 fw-bold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;