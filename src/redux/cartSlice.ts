import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add product to cart (or increase quantity if it exists)
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.items.find(item => item.id === action.payload.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Update product quantity
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const product = state.items.find(item => item.id === action.payload.id);
      if (product && action.payload.quantity > 0) {
        product.quantity = action.payload.quantity;
      }
    },
    // Remove product from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;