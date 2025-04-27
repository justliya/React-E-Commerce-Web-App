/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  address?: string;
}

interface ProfilePageProps {
  userId: string;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editName, setEditName] = useState<string>("");
  const [editAge, setEditAge] = useState<string>("");
  const [editAddress, setEditAddress] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        let docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, { name: "Your Name", age: 0, address: "" });
          docSnap = await getDoc(docRef);
        }
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            id: docSnap.id,
            name: data.name,
            age: data.age,
            address: data.address,
          });
          setEditName(data.name);
          setEditAge(data.age.toString());
          setEditAddress(data.address || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const updateProfile = async () => {
    if (!profile) return;
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        name: editName,
        age: Number(editAge),
        address: editAddress,
      });
      setProfile({ ...profile, name: editName, age: Number(editAge), address: editAddress });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteAccountHandler = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        const user = auth.currentUser;
        if (user) {
          await user.delete();
          alert("Your account has been permanently deleted.");
          window.location.href = "/";
        }
      } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
          alert("Please log in again to delete your account.");
        } else {
          alert("Failed to delete account. Try again later.");
        }
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "100%", maxWidth: "500px", backgroundColor: "#e0f0ff", borderRadius: "15px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
        <Card.Header style={{ backgroundColor: "#3399ff", color: "#fff", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
          User Profile
        </Card.Header>
        <Card.Body style={{ padding: "25px" }}>
          <Card.Text className="mb-2"><strong>Name:</strong> {profile.name}</Card.Text>
          <Card.Text className="mb-4"><strong>Address:</strong> {profile.address || "N/A"}</Card.Text>

          <div className="d-flex justify-content-between mb-4">
            <Button
              variant="primary"
              onClick={() => setEditing((prev) => !prev)}
              style={{ borderRadius: "10px", width: "48%" }}
            >
              {editing ? "Cancel Editing" : "Edit Profile"}
            </Button>
            <Button
              variant="outline-danger"
              onClick={deleteAccountHandler}
              style={{ borderRadius: "10px", width: "48%" }}
            >
              Delete Account
            </Button>
          </div>

          {editing && (
            <>
              <hr />
              <h5 className="mb-3" style={{ color: "#555" }}>Update Your Info</h5>

              <Form>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="formAddress" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Button
                  variant="success"
                  className="mt-2 w-100"
                  onClick={updateProfile}
                  style={{ borderRadius: "10px" }}
                >
                  Save Changes
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;