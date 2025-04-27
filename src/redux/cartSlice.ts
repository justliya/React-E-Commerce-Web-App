import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define product type
 export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartState {
  items: Product[];
}


const storedCart = sessionStorage.getItem("cart");
const initialState: CartState = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

const saveCartToStorage = (cart: Product[]) => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },

  
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const product = state.items.find((item) => item.id === action.payload.id);
      if (product && action.payload.quantity > 0) {
        product.quantity = action.payload.quantity;
      }
      saveCartToStorage(state.items);
    },

  
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },

    
    checkout: (state) => {
      state.items = [];
      sessionStorage.removeItem("cart");
    },

    
    setCartItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, checkout, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;
