/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as reduxAddToCart } from "../redux/cartSlice";
import { RootState } from "../redux/store";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: { rate: number };
  image: string;
  quantity: number;
};

const ManageProducts = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "rating">>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    quantity: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Omit<Product, "id" | "rating">>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    quantity: 0,
  });

  const useUserUid = () => {
    const [uid, setUid] = useState<string | null>(null);
    useEffect(() => {
      const unsub = auth.onAuthStateChanged((u) => setUid(u?.uid ?? null));
      return () => unsub();
    }, []);
    return uid;
  };
  const uid = useUserUid();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((doc) => {
          const raw = doc.data();
          return {
            id: Number(raw.id),
            title: raw.title,
            price: raw.price,
            description: raw.description,
            category: raw.category,
            rating: raw.rating || { rate: 0 },
            image: raw.image,
            quantity: raw.quantity ?? 0,
          } as Product;
        });
        setProducts(data);
      } catch (e: any) {
        console.error(e);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const newId = Date.now(); 
      const newDoc: Product = {
        id: newId,
        ...newProduct,
        rating: { rate: 0 },
      };
      await setDoc(doc(db, "products", newId.toString()), newDoc);
      setProducts((prev) => [...prev, newDoc]);
      setShowCreateForm(false);
      setNewProduct({ title: "", price: 0, description: "", category: "", image: "", quantity: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditingProduct({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      quantity: product.quantity,
    });
  };

  const handleUpdateProduct = async (id: number) => {
    try {
      const docRef = doc(db, "products", id.toString());
      await updateDoc(docRef, {
        ...editingProduct,
        rating: { rate: 0 }, // preserve rating structure
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editingProduct, rating: { rate: 0 } } : p))
      );
      setEditingId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteDoc(doc(db, "products", id.toString()));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!uid) {
      console.warn("Not authenticated");
      return;
    }

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      rating: product.rating,
      image: product.image,
      quantity: 1,
    };

    await setDoc(doc(db, "carts", uid, "cartItems", product.id.toString()), cartItem);
    dispatch(reduxAddToCart(cartItem));
  };

  const getProductQuantity = (prodId: number) => {
    const item = cartItems.find((i) => i.id === prodId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Manage Products</h2>

      {!showCreateForm && (
        <div className="text-center mb-4">
          <Button onClick={() => setShowCreateForm(true)}>Add Product</Button>
        </div>
      )}

      {showCreateForm && (
        <Card className="mb-4">
          <Card.Header>Create New Product</Card.Header>
          <Card.Body>
            <Form>
              {["title", "price", "description", "category", "image", "quantity"].map((field) => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type={field === "price" || field === "quantity" ? "number" : "text"}
                    value={(newProduct as any)[field]}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        [field]: field === "price" || field === "quantity" ? Number(e.target.value) : e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              ))}
              <Button onClick={handleCreateProduct}>Create</Button>{" "}
              <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.id} sm={6} md={4} lg={3}>
            <Card className="shadow-sm h-100">
              <Card.Img src={product.image} className="p-3" style={{ height: 200, objectFit: "contain" }} />
              <Card.Body>
                {editingId === product.id ? (
                  <Form>
                    {["title", "price", "description", "category", "image", "quantity"].map((field) => (
                      <Form.Group key={field} className="mb-2">
                        <Form.Control
                          type={field === "price" || field === "quantity" ? "number" : "text"}
                          value={(editingProduct as any)[field]}
                          onChange={(e) =>
                            setEditingProduct((prev) => ({
                              ...prev,
                              [field]: field === "price" || field === "quantity" ? Number(e.target.value) : e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    ))}
                    <Button size="sm" onClick={() => handleUpdateProduct(product.id)}>
                      Save
                    </Button>{" "}
                    <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Form>
                ) : (
                  <>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>${product.price.toFixed(2)}</Card.Text>
                    <Card.Text>{product.description.slice(0, 80)}…</Card.Text>
                    <Card.Text>Quantity: {product.quantity}</Card.Text>

                    <Button
                      variant="success"
                      size="sm"
                      className="w-100 mb-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      {getProductQuantity(product.id) > 0
                        ? `Added (${getProductQuantity(product.id)})`
                        : "Add to Cart"}
                    </Button>

                    <Button
                      variant="info"
                      size="sm"
                      className="w-100 mb-2"
                      onClick={() => startEditing(product)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      className="w-100"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ManageProducts;