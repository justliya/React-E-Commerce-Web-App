import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddDataForm from "../components/AddDataForm";


jest.mock("../firebaseConfig", () => ({
  db: {}, 
}));


jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
}));

describe("AddDataForm", () => {
  it("renders name and age inputs", () => {
    render(<AddDataForm />);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/age/i)).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    render(<AddDataForm />);
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "John", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText(/age/i), {
      target: { value: "25", name: "age" },
    });
    expect(screen.getByPlaceholderText(/name/i)).toHaveValue("John");
    expect(screen.getByPlaceholderText(/age/i)).toHaveValue(25);
  });

  it("submits form without crashing", async () => {
    const { getByPlaceholderText, getByText } = render(<AddDataForm />);
    fireEvent.change(getByPlaceholderText(/name/i), {
      target: { value: "Test", name: "name" },
    });
    fireEvent.change(getByPlaceholderText(/age/i), {
      target: { value: "30", name: "age" },
    });
    fireEvent.submit(getByText(/add user/i));
    await waitFor(() => {});
  });
});