import { useState, FormEvent } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

       // firestore user collection
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        alert("Registration successful!");
      }
    } catch {
      setError(
        isLogin
          ? "Invalid email or password. Please try again."
          : "Registration error. Please try again."
      );
    }
  };

  return (
    <Card className="p-4 shadow-sm w-100" style={{ maxWidth: "400px" }}>
      <Card.Body>
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant={isLogin ? "primary" : "success"}
            type="submit"
            className="w-100"
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <Button variant="link" onClick={() => setIsLogin(false)}>
                Register here
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button variant="link" onClick={() => setIsLogin(true)}>
                Login here
              </Button>
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuthForm;