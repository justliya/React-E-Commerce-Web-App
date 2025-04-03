import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

interface User {
    id?: string; // id is optional, as it will only be available after data is fetched
    name: string;
    age: number;
    address?: string;
}
  
const DisplayData = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newAge, setNewAge] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [createName, setCreateName] = useState<string>('');
    const [createAge, setCreateAge] = useState<string>('');
    const [createAddress, setCreateAddress] = useState<string>('');
    const [newAddress, setNewAddress] = useState<string>('');
  
    // updateUser Function
    const updateUser = async (userId, updatedData) => {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, updatedData);
    };
  
    // deleteUser Function
    const deleteUser = async (userId) => {
      await deleteDoc(doc(db, 'users', userId))
    }

    const createUser = async () => {
      try {
        const docRef = await addDoc(collection(db, 'users'), {
          name: createName,
          age: Number(createAge),
          address: createAddress
        });
        setUsers([...users, { id: docRef.id, name: createName, age: Number(createAge), address: createAddress }]);
        setCreateName('');
        setCreateAge('');
        setCreateAddress('');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(dataArray);
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <div style={{ border: '2px solid green', padding: '10px', marginBottom: '20px' }}>
          <h2>Register New User</h2>
          <input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            type="text"
            placeholder="Enter name"
          />
          <input
            value={createAge}
            onChange={(e) => setCreateAge(e.target.value)}
            type="number"
            placeholder="Enter age"
          />
          <input
            value={createAddress}
            onChange={(e) => setCreateAddress(e.target.value)}
            type="text"
            placeholder="Enter address"
          />
          <button onClick={createUser}>Register User</button>
        </div>
        <h2>Users List</h2>
        {users.map((user) => (
          <div
            key={user.id}
            style={{ border: '2px solid black', margin: '10px' }}
          >
            <div key={user.id}>
              <p>Name: {user.name}</p>
              <p>Age: {user.age}</p>
              <p>Address: {user.address || 'N/A'}</p>
            </div>
            <input
              onChange={(e) => setNewName(e.target.value)}
              type="string"
              placeholder="Enter new name:"
            />
            <button onClick={() => updateUser(user.id, { name: newName })}>
              Update Name
            </button>
            <input
              onChange={(e) => setNewAge(e.target.value)}
              type="number"
              placeholder="Enter new age:"
            />
            <button onClick={() => updateUser(user.id, { age: newAge })}>
              Update Age
            </button>
            <input
              onChange={(e) => setNewAddress(e.target.value)}
              type="text"
              placeholder="Enter new address:"
            />
            <button onClick={() => updateUser(user.id, { address: newAddress })}>
              Update Address
            </button>
            <button style={{ backgroundColor: 'crimson'}} onClick={() => deleteUser(user.id)}>Delete User</button>
          </div>
        ))}
      </div>
    );
};
  
export default DisplayData;