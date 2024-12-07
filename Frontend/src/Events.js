// import axios from 'axios';
import React, { useState } from 'react';

const EventsPage = () => {
  const user = useState(null);

  // useEffect(() => {
  //   // Fetch user data from backend
  //   axios.get('http://localhost:5001/auth/user', { withCredentials: true }) // Ensure credentials are sent
  //     .then(response => {
  //       setUser(response.data); // Set user data in state
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user data:', error);
  //     });
  // }, []);

  return (
    <div>
      {user ? (
        <h1>Welcome {user.name}!</h1>
      ) : (
        <h1>Loading user data...</h1>
      )}
    </div>
  );
};

export default EventsPage;
