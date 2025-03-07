import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Register from "./components/Registration";
import Login from "./components/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Container, Row, Col, Spinner } from "react-bootstrap";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div>
      <NavBar user={!!user} /> {/* Pass user state to NavBar */}

      {user ? (
        <Container className="mt-4">
          <h2>Welcome, {user.email}</h2>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Container>
      ) : (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Row className="w-100">
            <Col md={6} className="d-flex justify-content-center">
              <Login />
            </Col>
            <Col md={6} className="d-flex justify-content-center">
              <Register />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default App;