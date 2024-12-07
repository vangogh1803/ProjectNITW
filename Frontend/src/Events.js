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
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <h1>Loading user data...</h1>
      )}
    </div>
  );
};

export default EventsPage;
// // import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const EventsPage = () => {
//   const [user, setUser] = useState(null);

//   // useEffect(() => {
//   //   // Fetch user data from backend
//   //   axios.get('http://localhost:5001/auth/user', { withCredentials: true }) // Ensure credentials are sent
//   //     .then(response => {
//   //       setUser(response.data); // Set user data in state
//   //     })
//   //     .catch(error => {
//   //       console.error('Error fetching user data:', error);
//   //     });
//   // }, []);

//   return (
//     <div>
//       {user ? (
//         <h1>Welcome, {user.name}!</h1>
//       ) : (
//         <h1>Loading user data...</h1>
//       )}
//     </div>
//   );
// };

// export default EventsPage;
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const EventsPage = () => {
//   const [user, setUser ] = useState(null);
//   const [error, setError] = useState(null); // State to hold error messages
//   const [loading, setLoading] = useState(true); // State to manage loading status

//   useEffect(() => {
//     // Fetch user data from backend
//     axios.get('http://localhost:5001/auth/user', { withCredentials: true })
//       .then(response => {
//         setUser (response.data); // Set user data in state
//         setLoading(false); // Set loading to false
//       })
//       .catch(error => {
//         console.error('Error fetching user data:', error);
//         setError('Failed to fetch user data. Please try again.'); // Set error message
//         setLoading(false); // Set loading to false
//       });
//   }, []);

//   if (loading) {
//     return <h1>Loading user data...</h1>; // Show loading state
//   }

//   if (error) {
//     return <h1>{error}</h1>; // Show error message
//   }

//   return (
//     <div>
//       {user ? (
//         <h1>Welcome, {user.name}!</h1>
//       ) : (
//         <h1>User not authenticated. Please log in.</h1>
//       )}
//     </div>
//   );
// };

// export default EventsPage;