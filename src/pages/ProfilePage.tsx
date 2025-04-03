import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
  const [editName, setEditName] = useState<string>('');
  const [editAge, setEditAge] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedProfile: UserProfile = {
            id: docSnap.id,
            name: data.name,
            age: data.age,
            address: data.address,
          };
          setProfile(fetchedProfile);
          setEditName(data.name);
          setEditAge(data.age.toString());
          setEditAddress(data.address || '');
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async () => {
    if (!profile) return;
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        name: editName,
        age: Number(editAge),
        address: editAddress,
      });
      // Update local state with the new data
      setProfile({ ...profile, name: editName, age: Number(editAge), address: editAddress });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setProfile(null);
      alert('Account deleted successfully');
      // Additional logic (like redirecting the user) can be added here
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div style={{ border: '2px solid blue', padding: '20px' }}>
      <h2>User Profile</h2>
      <div>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
      </div>
      <h3>Edit Profile</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Enter new name"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="number"
          value={editAge}
          onChange={(e) => setEditAge(e.target.value)}
          placeholder="Enter new age"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={editAddress}
          onChange={(e) => setEditAddress(e.target.value)}
          placeholder="Enter new address"
        />
      </div>
      <button onClick={updateProfile}>Update Profile</button>
      <button
        style={{ backgroundColor: 'crimson', marginLeft: '10px' }}
        onClick={deleteAccount}
      >
        Delete Account
      </button>
    </div>
  );
};

export default ProfilePage;