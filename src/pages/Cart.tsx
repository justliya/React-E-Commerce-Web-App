import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  removeFromCart,
  updateQuantity,
  checkout,
  setCartItems,
} from "../redux/cartSlice";
import { useState, useEffect } from "react";
import { Container, ListGroup, Button, Form, Alert } from "react-bootstrap";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Product } from "../redux/cartSlice";



const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        const cartCollectionRef = collection(db, "carts", uid, "cartItems"); // 🔥 FIXED HERE
        const snapshot = await getDocs(cartCollectionRef);
  
        if (snapshot.empty) {
          console.log("No cart found for user, showing empty cart.");
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

    dispatch(checkout());
    setCheckoutSuccess(true);

    try {
      const cartCollectionRef = collection(db, "Cart", uid, );
      const snapshot = await getDocs(cartCollectionRef);
      const batchDeletes = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(batchDeletes);
    } catch (error) {
      console.error("Error clearing cart at checkout:", error);
    }

    setTimeout(() => setCheckoutSuccess(false), 3000);
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <Container className="my-4">
      <h2>Shopping Cart</h2>

      {checkoutSuccess && (
        <Alert variant="success">Checkout successful!</Alert>
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
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  style={{ width: "60px" }}
                />

                {/* Remove Button */}
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
            Total: <span className="text-success">${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
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
    </Container>
  );
};

export default Cart;