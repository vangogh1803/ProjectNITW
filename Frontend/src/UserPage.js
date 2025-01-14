import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the authenticated user details from the backend
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5001/auth/user', {
          withCredentials: true,
        });

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details. Please try again.');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Google ID:</strong> {user.googleId}</p>
      <img src={user.profilePicture} alt="Profile" style={{ borderRadius: '50%', width: '100px' }} />
    </div>
  );
};

export default UserPage;



/*import React, { useEffect, useState } from 'react';
import axios from 'axios';


const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5001/auth/user', {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        console.log('User details fetched:', response.data); 
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details. Please log in again.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello</h1>
      <h1>User Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <img src={user.profilePicture} alt="Profile" style={{ width: '150px', borderRadius: '50%' }} />
    </div>
  );
};

export default UserPage;*/





/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the backend
        const response = await axios.get('http://localhost:5001/auth/user', {
          withCredentials: true, // Required if cookies are used for session management
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {user.profilePicture && (
        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
          style={{ borderRadius: '50%', width: '100px', height: '100px' }}
        />
      )}
    </div>
  );
};

export default UserPage;*/