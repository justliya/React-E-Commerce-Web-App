import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
    </>
  );
};

export default App;
