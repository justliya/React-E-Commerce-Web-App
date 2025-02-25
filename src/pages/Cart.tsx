import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity, checkout } from "../redux/cartSlice";
import { useState } from "react";
import { Container, ListGroup, Button, Form, Alert } from "react-bootstrap";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = () => {
    dispatch(checkout());
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 3000);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Container className="my-4">
      <h2>Shopping Cart</h2>

      {/* Checkout success message */}
      {checkoutSuccess && (
        <Alert variant="success"> Checkout successful!</Alert>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ListGroup>
            {cartItems.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex justify-content-between align-items-center"
              >
                <img src={item.image} alt={item.title} width="50" />
                <div>
                  <h6>{item.title}</h6>
                  <p className="text-muted">Price: ${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Input */}
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: Number(e.target.value),
                      })
                    )
                  }
                  style={{ width: "60px" }}
                />

                {/* Remove Button */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Display total price */}
          <h4 className="mt-3 text-end">
            Total:{" "}
            <span className="text-success">${totalPrice.toFixed(2)}</span>
          </h4>

          {/* Checkout Button */}
          <Button
            className="mt-3 w-100"
            variant="success"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;
