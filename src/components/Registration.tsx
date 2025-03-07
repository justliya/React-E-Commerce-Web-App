import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Form, Button, Card, Alert } from "react-bootstrap";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch {
      setError("Registration error. Please try again.");
    }
  };

  return (
    <Card className="p-4 shadow-sm w-100" style={{ maxWidth: "400px" }}>
      <Card.Body>
        <h2 className="text-center mb-4">Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;