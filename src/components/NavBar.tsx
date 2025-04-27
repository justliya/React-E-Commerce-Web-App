import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { ShoppingCart, User } from "react-feather"; // ✅ Feather icons

interface NavBarProps {
  user: boolean;
}

const NavBar = ({ user }: NavBarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary">
          🛍️ Brand New
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className="me-3 text-dark fw-semibold"
                >
                  Products
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/manage-products"
                  className="me-3 text-dark fw-semibold"
                >
                  Store
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="me-3 position-relative text-dark fw-semibold"
                >
                  <ShoppingCart size={20} className="me-1" />
                  Cart
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  ></Badge>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className="me-3 text-dark fw-semibold"
                >
                  <User size={20} className="me-1" />
                  Profile
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  style={{ borderRadius: "12px", padding: "6px 14px" }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
