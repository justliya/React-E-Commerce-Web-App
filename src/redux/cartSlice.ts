import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define product type
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

// Retrieve cart data from sessionStorage
const storedCart = sessionStorage.getItem('cart');
const initialState: CartState = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

// Save cart data to sessionStorage
const saveCartToStorage = (cart: Product[]) => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
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
      saveCartToStorage(state.items);
    },

    // Update product quantity
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const product = state.items.find(item => item.id === action.payload.id);
      if (product && action.payload.quantity > 0) {
        product.quantity = action.payload.quantity;
      }
      saveCartToStorage(state.items); 
    },

    // Remove product from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state.items);
    },

    // Clear cart for checkout
    checkout: (state) => {
      state.items = [];
      sessionStorage.removeItem('cart'); 
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, checkout } = cartSlice.actions;
export default cartSlice.reducer;