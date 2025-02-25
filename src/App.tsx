import Products from './components/Products';
import Cart from './components/Cart';
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";


const App: React.FC = () => {
  return (
  <><NavBar /><Routes>
      <Route path="/" element={<Products />} />
      <Route path="/Cart" element={<Cart />} />

    </Routes></>
  );
};

export default App;