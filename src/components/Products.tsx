import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import CategoryDropdown from '../components/Categories';

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

// Fetch function 
const fetchProducts = async (category: string): Promise<Product[]> => {
  const url = category ? `https://fakestoreapi.com/products/category/${category}` : `https://fakestoreapi.com/products`;
  const response = await axios.get(url);
  return response.data;
};

const Products = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <div>
      <h2>Products</h2>
      <CategoryDropdown onCategoryChange={setSelectedCategory} />
      <div className="product-grid">
        {data?.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>{product.description}</p>
            <p> {product.category}</p>
            <p>Rating: {product.rating.rate}</p>
            <img src={product.image} alt={product.title} width="100" />
            <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;