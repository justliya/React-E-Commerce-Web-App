import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Register from "./components/Registration";
import Login from "./components/Login";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <Login /> {/* To provide a logout button */}
          <NavBar />
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/Cart" element={<Cart />} />
          </Routes>
        </div>
      ) : (
        <>
          <Register />
          <Login />
        </>
      )}
    </div>
  );
};

export default App;
