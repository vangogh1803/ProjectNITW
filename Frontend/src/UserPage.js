import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserPage.css';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // API base URL
  withCredentials: true, // Enable sending cookies with requests
});


const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details from the backend
        const response = await axiosInstance.get('http://localhost:5001/auth/user', {
          withCredentials: true,
          validateStatus: (status) => (status >= 200 && status < 500) || status === 500,
        });

        if (response.status === 200) {
          setUser(response.data); // Set user details
        } else if (response.status === 500) {
          console.warn('Server returned a 500 status code');
          setError('Server error. Please try again later.');
        } else {
          setError('Could not fetch user details. Please log in.');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Could not fetch user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="loading">Loading user details...</div>; // Show loading while fetching data
  }

  return (
    <div className="user-page">
      <h1>Welcome, {user.name}!</h1>
      {user.profilePicture && (
        <img
          src={user.profilePicture || '/default-profile.png'} // Fallback to default if no profile picture
          alt="Profile"
          className="profile-picture"
        />
      )}
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserPage;


