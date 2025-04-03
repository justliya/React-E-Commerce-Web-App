import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import AuthForm from "./components/AuthForm";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProfilePage from "./pages/ProfilePage";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Container, Spinner } from "react-bootstrap";

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
            <Route path="/profile" element={<ProfilePage userId={user.uid} />} />
          </Routes>
        </Container>
      ) : (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <AuthForm />
        </Container>
      )}
    </div>
  );
};

export default App;