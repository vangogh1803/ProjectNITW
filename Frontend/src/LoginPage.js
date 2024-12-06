import React from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const MyCustomButton = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

const LoginPage = () => {
  const login = useGoogleLogin({ 
    onSuccess: async (tokenResponse) => {
      console.log('Login Success:', tokenResponse);

      try { 
        // Fetch user info from Google API using the provided token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!userInfoResponse.ok) {
          console.error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
          return;
        }

        const userInfo = await userInfoResponse.json();
        console.log('Fetched User Info:', userInfo);

        // Prepare the payload to send to the backend
        const payload = {
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          profilePicture: userInfo.picture,
          accessToken: tokenResponse.access_token,
        };

        // Optionally include refresh token if available
        if (tokenResponse.refresh_token) {
          payload.refreshToken = tokenResponse.refresh_token;
        }

        // Send user data to backend for authentication/registration
        const response = await axios.post('http://localhost:5001/auth/google', payload, {
          withCredentials: true,
          validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
        });

        if (response.status === 500) {
          console.warn('Server returned a 500 status code');
        }

        console.log('Backend Response:', response.data);

        // Optional: Get authenticated user data from the backend
        const userResponse = await axios.get('http://localhost:5001/auth/user', {
          withCredentials: true,
        });
        console.log('Authenticated User:', userResponse.data);

        // Redirect to the events page after successful login
        window.location.href = '/events'; // Adjust as necessary for your frontend
      } catch (error) {
        console.error('Error during login:', error);

        if (error.response) {
          console.error('Backend Error:', error.response.data);
        } else if (error.request) {
          console.error('No Response from Backend:', error.request);
        } else {
          console.error('Setup Error:', error.message);
        }
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <MyCustomButton onClick={() => login()}>Sign in with Google</MyCustomButton>
    </div>
  );
};

export default LoginPage;


// import React from 'react';
// import axios from 'axios'; // Import axios for making HTTP requests
// import { useGoogleLogin } from '@react-oauth/google';

// const MyCustomButton = ({ onClick, children }) => (
//   <button onClick={onClick}>{children}</button>
// );

// const LoginPage = () => {
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       console.log('Login Success:', tokenResponse);

//       // Send data to the backend
//       try {
//         // Fetch user info from Google using the access token
//         const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`, // Corrected syntax for template literals
//           },
//         });

//         if (!userInfoResponse.ok) {
//           // If fetching user info fails, log it but don't throw an error
//           console.error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
//           return; // Exit early but don't stop execution
//         }

//         const userInfo = await userInfoResponse.json();

//         // Send the user info to the backend
//         const response = await axios.post(
//           'http://localhost:5001/auth/google',
//           {
//             googleId: userInfo.sub,
//             email: userInfo.email,
//             name: userInfo.name,
//             profilePicture: userInfo.picture,
//             accessToken: tokenResponse.access_token, // For future calls
//             refreshToken: tokenResponse.refresh_token,
//           },
//           {
//             // Custom validateStatus to treat status codes >= 200 and 500 as valid
//             validateStatus: (status) => {
//               return (status >= 200 && status < 300) || status === 500; // Accept 500 as valid
//             },
//           }
//         );
//         //this
//         axios.get('http://localhost:5001/auth/user', { withCredentials: true });
//         axios.interceptors.request.use(request => {
//           console.log('Starting Request', request);
//           return request;
//         });
        
//         axios.interceptors.response.use(response => {
//           console.log('Response:', response);
//           return response;
//         });


//         // Check if the response status is 500 and log a warning
//         if (response.status === 500) {
//           console.warn('Received status code 500 from the server');
//         }

//         // Continue execution even after receiving a 500 or successful response
//         console.log('Backend response:', response.data);
//       } catch (error) {
//         // Log any other errors (network issues, etc.), but don't stop execution
//         console.error('Error fetching user info or sending to backend:', error);
//       }
//     },
//     onError: () => {
//       console.log('Login Failed');
//     },
//   });

//   return (
//     <div>
//       <h1>Login</h1>
//       <MyCustomButton onClick={() => login()}>Sign in with Google</MyCustomButton>
//     </div>
//   );
// };

// export default LoginPage;
// import React from 'react';
// import axios from 'axios'; // Import axios for making HTTP requests
// import { useGoogleLogin } from '@react-oauth/google';

// const MyCustomButton = ({ onClick, children }) => (
//   <button onClick={onClick}>{children}</button>
// );

// const LoginPage = () => {
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       console.log('Login Success:', tokenResponse);

//       try {
//         // Fetch user info from Google using the access token
//         const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//         });

//         if (!userInfoResponse.ok) {
//           console.error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
//           return;
//         }

//         const userInfo = await userInfoResponse.json();
//         console.log('Fetched User Info:', userInfo);

//         // Send the user info to the backend
//         const response = await axios.post(
//           'http://localhost:5001/auth/google', // Backend endpoint for Google login
//           {
//             googleId: userInfo.sub, // Unique Google user ID
//             email: userInfo.email, // User's email
//             name: userInfo.name, // User's name
//             profilePicture: userInfo.picture, // User's profile picture URL
//             accessToken: tokenResponse.access_token, // Google access token
//           },
//           {
//             withCredentials: true, // Send cookies for authentication
//           }
//         );

//         console.log('Backend Response:', response.data);

//         // Redirect to the events page after successful login
//         window.location.href = '/events';
//       } catch (error) {
//         console.error('Error during login or backend communication:', error);

//         // Handle common Axios or network issues
//         if (error.response) {
//           console.error('Backend returned an error:', error.response.data);
//         } else if (error.request) {
//           console.error('No response received from backend:', error.request);
//         } else {
//           console.error('Error setting up request:', error.message);
//         }
//       }
//     },
//     onError: (error) => {
//       console.error('Login Failed:', error);
//     },
//   });

//   return (
//     <div>
//       <h1>Login</h1>
//       <MyCustomButton onClick={() => login()}>Sign in with Google</MyCustomButton>
//     </div>
//   );
// };

// export default LoginPage;


// import React from 'react';
// import axios from 'axios';
// import { useGoogleLogin } from '@react-oauth/google';

// const MyCustomButton = ({ onClick, children }) => (
//   <button onClick={onClick}>{children}</button>
// );

// const LoginPage = () => {
//   const login = useGoogleLogin({ 
//     onSuccess: async (tokenResponse) => {
//       console.log('Login Success:', tokenResponse);

//       try { 
//         const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//         });

//         if (!userInfoResponse.ok) {
//           console.error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
//           return;
//         }

//         const userInfo = await userInfoResponse.json();
//         console.log('Fetched User Info:', userInfo);

//         const payload = {
//           googleId: userInfo.sub,
//           email: userInfo.email,
//           name: userInfo.name,
//           profilePicture: userInfo.picture,
//           accessToken: tokenResponse.access_token,
//         };

//         if (tokenResponse.refresh_token) {
//           payload.refreshToken = tokenResponse.refresh_token;
//         }

//         const response = await axios.post('http://localhost:5001/auth/google', payload, {
//           withCredentials: true,
//           validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
//         });

//         if (response.status === 500) {
//           console.warn('Server returned a 500 status code');
//         }

//         console.log('Backend Response:', response.data);

//         // Optional: Get authenticated user data
//         const userResponse = await axios.get('http://localhost:5001/auth/user', {
//           withCredentials: true,
//         });
//         console.log('Authenticated User:', userResponse.data);

//         // Redirect on success
//         window.location.href = '/events';
//       } catch (error) {
//         console.error('Error during login:', error);

//         if (error.response) {
//           console.error('Backend Error:', error.response.data);
//         } else if (error.request) {
//           console.error('No Response from Backend:', error.request);
//         } else {
//           console.error('Setup Error:', error.message);
//         }
//       }
//     },
//     onError: (error) => {
//       console.error('Login Failed:', error);
//     },
//   });

//   return (
//     <div>
//       <h1>Login</h1>
//       <MyCustomButton onClick={() => login()}>Sign in with Google</MyCustomButton>
//     </div>
//   );
// };

// export default LoginPage;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useGoogleLogin } from '@react-oauth/google';

// const LoginPage = () => {
//   const [loading, setLoading] = useState(false);

//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setLoading(true);
//       console.log('Login Success:', tokenResponse);

//       try {
//         const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//         });

//         if (!userInfoResponse.ok) {
//           console.error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
//           alert('Failed to fetch user info.');
//           return;
//         }

//         const userInfo = await userInfoResponse.json();
//         console.log('Fetched User Info:', userInfo);

//         const payload = {
//           googleId: userInfo.sub,
//           email: userInfo.email,
//           name: userInfo.name,
//           profilePicture: userInfo.picture,
//           accessToken: tokenResponse.access_token,
//         };

//         const response = await axios.post('http://localhost:5001/auth/google', payload, {
//           withCredentials: true,
//           validateStatus: (status) => status >= 200 && status < 300,
//         });

//         console.log('Backend Response:', response.data);

//         // Redirect on success
//         window.location.href = '/events';
//       } catch (error) {
//         console.error('Error during login:', error);
//         alert('Error occurred. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     },
//     onError: (error) => {
//       console.error('Login Failed:', error);
//       setLoading(false);
//     },
//   });

//   return (
//     <div>
//       <h1>Login</h1>
//       <button onClick={() => !loading && login()}>
//         {loading ? 'Signing in...' : 'Sign in with Google'}
//       </button>
//     </div>
//   );
// };

// export default LoginPage;
