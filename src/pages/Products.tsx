import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as reduxAddToCart } from "../redux/cartSlice";
import { RootState } from "../redux/store";
import CategoryDropdown from "../components/CategoriesDropdown";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { auth, db } from "../firebaseConfig"; 

import {
  doc,
  setDoc,
} from "firebase/firestore";

// Define the Product type
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

// Fetch products
const fetchProducts = async (category: string): Promise<Product[]> => {
  const url = category
    ? `https://fakestoreapi.com/products/category/${category}`
    : `https://fakestoreapi.com/products`;
  const response = await axios.get(url);
  return response.data;
};

// Hook to get current user's UID
function useUserUid() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return uid;
}

const Products = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({});

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  const uid = useUserUid();


  const handleAddToCart = async (product: Product) => {
    if (!uid) {
      console.log("User not authenticated");
      return;
    }

    const cartProduct = {
      ...product,
      qty: 1,
      TotalProductPrice: product.price * 1,
    };

    try {
      
      const cartDocRef = doc(db, "carts", uid, "cartItems", product.id.toString());
      await setDoc(cartDocRef, cartProduct);

      console.log("Successfully added to Firestore cart");

      
      dispatch(reduxAddToCart(product));
    } catch (error) {
      console.error("Error adding to Firestore cart:", error);
    }
  };

  const getProductQuantity = (productId: number) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const toggleDescription = (id: number) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <Container>
      <h2 className="text-center my-4">Products</h2>
      <CategoryDropdown onCategoryChange={setSelectedCategory} />

      <Row className="g-4 mt-3">
        {data?.map((product) => {
          const quantity = getProductQuantity(product.id);
          const isExpanded = expandedDescriptions[product.id];

          return (
            <Col key={product.id} sm={6} md={4} lg={3}>
              <Card className="product-card text-center shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.image}
                  className="p-3"
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6">{product.title}</Card.Title>
                  <Card.Text className="text-muted">
                    ${product.price.toFixed(2)}
                  </Card.Text>
                  <Card.Text>
                    <Badge bg="info">{product.category}</Badge>
                  </Card.Text>

                  {/* Expandable Description */}
                  <Card.Text>
                    {isExpanded
                      ? product.description
                      : `${product.description.slice(0, 80)}...`}
                    <Button
                      variant="link"
                      className="p-0 ms-1"
                      onClick={() => toggleDescription(product.id)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </Button>
                  </Card.Text>

                  <Card.Text className="fw-bold">
                    ⭐ {product.rating.rate}/5
                  </Card.Text>

                  {/* Show quantity if added to cart */}
                  {quantity > 0 ? (
                    <Button variant="secondary" className="w-100" disabled>
                      Added to Cart ({quantity})
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      className="w-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Products;