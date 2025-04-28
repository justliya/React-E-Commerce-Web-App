import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../components/AuthForm";


jest.mock("../firebaseConfig", () => ({
  auth: {
    currentUser: null,
  },
}));

describe("AuthForm", () => {
  it("renders email and password inputs", () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("allows typing into email and password fields", async () => {
    render(<AuthForm />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("handles form submission without crashing", async () => {
    render(<AuthForm />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

   
    await waitFor(() => {
      expect(emailInput).toHaveValue("test@example.com");
    });
  });
});