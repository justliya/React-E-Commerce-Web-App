/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Container, Card, Form, Button } from "react-bootstrap";

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

  // State variables for editing profile details
  const [editName, setEditName] = useState<string>("");
  const [editAge, setEditAge] = useState<string>("");
  const [editAddress, setEditAddress] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        let docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.log("Profile not found, creating a new one.");
          await setDoc(docRef, {
            name: "Your Name", // Default values; you may prompt the user for these later
            age: 0,
            address: "",
          });
          docSnap = await getDoc(docRef);
        }
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched profile data:", data);
          setProfile({
            id: docSnap.id,
            name: data.name,
            age: data.age,
            address: data.address,
          });
          setEditName(data.name);
          setEditAge(data.age.toString());
          setEditAddress(data.address || "");
        } else {
          console.error("No such document after creation!");
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
      setProfile({
        ...profile,
        name: editName,
        age: Number(editAge),
        address: editAddress,
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteAccountHandler = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      )
    ) {
      try {
        // Delete the user's profile document from Firestore
        await deleteDoc(doc(db, "users", userId));

        // Delete the Firebase Auth user account
        const user = auth.currentUser;
        if (user) {
          await user.delete();
          alert("Your account has been permanently deleted.");
          // Redirect to login page (update URL as needed)
          window.location.href = "/login";
        }
      } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
          alert("You need to log in again before deleting your account.");
        } else {
          alert("Failed to delete account. Please try again.");
        }
        console.error("Error deleting account:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Header as="h3" className="text-center">
          User Profile
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Name:</strong> {profile.name}
          </Card.Text>
          <Card.Text>
            <strong>Address:</strong> {profile.address || "N/A"}
          </Card.Text>
          <hr />
          <h5>Edit Profile</h5>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group controlId="formAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new address"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-between mt-4">
              <Button variant="primary" onClick={updateProfile}>
                Update Profile
              </Button>
              <Button variant="danger" onClick={deleteAccountHandler}>
                Delete Account
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;