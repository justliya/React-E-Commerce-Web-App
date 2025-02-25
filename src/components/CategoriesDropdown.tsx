import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Form, Container } from "react-bootstrap";

type Category = string[];

// Fetch function for categories
const fetchCategories = async (): Promise<Category> => {
  const response = await axios.get(
    "https://fakestoreapi.com/products/categories"
  );
  return response.data;
};

// Component
const CategoryDropdown = ({
  onCategoryChange,
}: {
  onCategoryChange: (category: string) => void;
}) => {
  const { data, isLoading, error } = useQuery<Category>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <Container className="my-3 text-center">
      <Form.Group className="d-inline-block">
        <Form.Label className="fw-bold">Filter by Category</Form.Label>
        <Form.Select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="shadow-sm border-primary"
          style={{ width: "250px", textTransform: "capitalize" }}
        >
          <option value="">All Categories</option>
          {data?.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Container>
  );
};

export default CategoryDropdown;
