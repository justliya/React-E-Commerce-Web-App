/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Container, ListGroup, Button } from "react-bootstrap";

type Order = {
  id: string;
  userId: string;
  products: {
    id: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  createdAt: Timestamp;
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError("No user is currently logged in.");
          return;
        }
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          ordersData.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Order, "id">),
          });
        });
        setOrders(ordersData);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <Container className="my-4">
      <h2>Order History</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order.id} className="mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Order ID:</strong> {order.id} <br />
                  <strong>Date:</strong> {formatDate(order.createdAt)} <br />
                  <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                </div>
                <Button
                  variant="link"
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder?.id === order.id ? null : order
                    )
                  }
                >
                  {selectedOrder?.id === order.id ? "Hide Details" : "View Details"}
                </Button>
              </div>
              {selectedOrder?.id === order.id && (
                <div className="mt-2">
                  <h6>Products:</h6>
                  <ListGroup>
                    {order.products.map((product) => (
                      <ListGroup.Item key={product.id}>
                        {product.title} - Qty: {product.quantity} - Price: $
                        {product.price.toFixed(2)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default OrderHistory;