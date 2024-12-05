import React from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useGoogleLogin } from '@react-oauth/google';

const MyCustomButton = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

const LoginPage = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      
      // sed to backend to save data
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
      
        await axios.post('http://localhost:5001/auth/google', {
          googleId: userInfo.sub, 
          email: userInfo.email, 
          name: userInfo.name, 
          profilePicture: userInfo.picture, 
          accessToken: tokenResponse.access_token, //for future call
          refreshToken: tokenResponse.refresh_token, 
        });
      } catch (error) {
        console.error('Error fetching user info or sending to backend:', error);
      }
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <MyCustomButton onClick={() => login()}>Sign in with Google </MyCustomButton>
    </div>
  );
};

export default LoginPage;
