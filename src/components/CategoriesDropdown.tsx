import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Category = string[]; 

// Fetch function for categories
const fetchCategories = async (): Promise<Category> => {
  const response = await axios.get('https://fakestoreapi.com/products/categories');
  return response.data;
};

// Component
const CategoryDropdown = ({ onCategoryChange }: { onCategoryChange: (category: string) => void }) => {
  const { data, isLoading, error } = useQuery<Category>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <select onChange={(e) => onCategoryChange(e.target.value)}>
      <option value="">All Categories</option>
      {data?.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;