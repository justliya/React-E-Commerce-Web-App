/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  removeFromCart,
  updateQuantity,
  checkout,
  setCartItems,
} from "../redux/cartSlice";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Container, ListGroup, Button, Form, Alert, Spinner } from "react-bootstrap";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import type { Product } from "../redux/cartSlice";

type Order = {
  id: string;
  items: { id: number; title: string; price: number; quantity: number }[];
  totalAmount: number;
  createdAt: Timestamp;
};

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Listen for auth user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        dispatch(setCartItems([]));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Fetch cart on user login
  useEffect(() => {
    const fetchCart = async () => {
      if (!uid) return;
  
      try {
        const cartCollectionRef = collection(db, "carts", uid, "cartItems");
        const snapshot = await getDocs(cartCollectionRef);
  
        if (snapshot.empty) {
          dispatch(setCartItems([]));
        } else {
          const cartData: Product[] = snapshot.docs.map((doc) => doc.data() as Product);
          dispatch(setCartItems(cartData));
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [uid, dispatch]);

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (!uid) return;

    dispatch(updateQuantity({ id, quantity }));

    try {
      const itemDocRef = doc(db, "carts", uid, "cartItems", id.toString());
      await updateDoc(itemDocRef, {
        quantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (id: number) => {
    if (!uid) return;

    dispatch(removeFromCart(id));

    try {
      const itemDocRef = doc(db, "carts", uid, "cartItems", id.toString());
      await deleteDoc(itemDocRef);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleCheckout = async () => {
    if (!uid) return;

    const orderItems = cartItems.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    try {
      await addDoc(collection(db, "orders"), {
        userId: uid,
        items: orderItems,
        totalAmount,
        createdAt: new Date(),
      });

      const cartCollectionRef = collection(db, "carts", uid, "cartItems");
      const snapshot = await getDocs(cartCollectionRef);
      const batchDeletes = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(batchDeletes);

      dispatch(checkout());
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 3000);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const fetchOrders = async () => {
    if (!uid) return;

    try {
      const q = query(collection(db, "orders"), where("userId", "==", uid));
      const snap = await getDocs(q);
      const fetchedOrders = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      })) as Order[];
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleToggleOrders = async () => {
    if (!showOrders) {
      await fetchOrders();
    }
    setShowOrders((prev) => !prev);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{showOrders ? "Order History" : "Shopping Cart"}</h2>
        <Button onClick={handleToggleOrders} variant="info">
          {showOrders ? "Back to Cart" : "View Orders"}
        </Button>
      </div>

      {checkoutSuccess && (
        <Alert variant="success">Checkout successful!</Alert>
      )}

      {showOrders ? (
        <>
          {orders.length === 0 ? (
            <p>No past orders found.</p>
          ) : (
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item key={order.id}>
                  <h6>Order ID: {order.id}</h6>
                  <p>Date: {order.createdAt?.toDate().toLocaleString()}</p>
                  <p>Total: ${order.totalAmount.toFixed(2)}</p>
                  <details>
                    <summary>View Products</summary>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.title} (x{item.quantity}) — ${item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </details>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      ) : (
        <>
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
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      style={{ width: "60px" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <h4 className="mt-3 text-end">
                Total: <span className="text-success">
                  ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </span>
              </h4>

              <Button
                className="mt-3 w-100"
                variant="success"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Cart;