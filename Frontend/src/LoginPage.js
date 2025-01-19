import React from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import './css/LoginPage.css';
import  { useEffect } from 'react';


const MyCustomButton = ({ onClick, children }) => (
  <button className='login-button' onClick={onClick}>{children}</button>
);

const LoginPage = () => {

  useEffect(() => {
    // Add a unique class to the <body> tag when this component is mounted
    document.body.className = 'login-page';

    // Cleanup: Remove the class when the component is unmounted
    return () => {
      document.body.className = '';
    };
  }, []);
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

        // // Optionally include refresh token if available
        // if (tokenResponse.refresh_token) {
        //   payload.refreshToken = tokenResponse.refresh_token;
        // }

        // Send user data to backend for authentication/registration
        const response = await axios.post('http://localhost:5001/auth/google', payload, {
          withCredentials: true,
          validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
        });

        if (response.status === 500) {
          console.warn('Server returned a 500 status code');
          return; // Exit if there's a server error
        }

        console.log('Backend Response:', response.data);
        
        // // Optional: Get authenticated user data from the backend
        // const userResponse = await axios.get('http://localhost:5001/auth/user', {
        //   withCredentials: true,
        // });

        // console.log('Authenticated User:', userResponse.data);
        
        // Redirect to events page only after successful authentication
        window.location.href = '/events';

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
    <div className='login-container'>
      <h1>Login</h1>
      <MyCustomButton onClick={() => login()}>Sign in with Google</MyCustomButton>
    </div>
  );
};

export default LoginPage;
