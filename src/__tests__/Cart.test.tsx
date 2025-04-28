import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Cart from "../pages/Cart";
import cartReducer, { addToCart } from "../redux/cartSlice"; 


jest.mock("../firebaseConfig", () => ({
  auth: {
    onAuthStateChanged: jest.fn((cb) => {
      cb({ uid: "test-user" });
      return jest.fn();
    }),
  },
  db: {},
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, docs: [] })),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
}));

describe("Cart Integration Test", () => {
  it("should update the cart when a product is added", async () => {
    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
      preloadedState: {
        cart: { items: [] },
      },
    });

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    // ⏳ Wait until Spinner disappears
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

   
    store.dispatch(
      addToCart({
        id: 1,
        title: "Test Product",
        price: 9.99,
        quantity: 1,
        image: "test.jpg",
     
      })
    );

   
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText(/test product/i)).toBeInTheDocument();
  });
});