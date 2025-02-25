

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity, checkout } from '../redux/cartSlice';
import { useState } from 'react';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = () => {
    dispatch(checkout());
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 3000); // Hide message after 3 sec
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <img src={item.image} alt={item.title} width="100" />
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Quantity: 
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
                />
              </p>
              <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h3>

      {cartItems.length > 0 && (
        <button onClick={handleCheckout}>Checkout</button>
      )}

      {checkoutSuccess && <p style={{ color: 'green' }}>Checkout successful! Your cart has been cleared.</p>}
    </div>
  );
};

export default Cart;