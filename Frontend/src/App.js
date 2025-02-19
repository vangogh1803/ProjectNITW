import React from 'react';
import { GoogleOAuthProvider} from '@react-oauth/google';
import LoginPage from './LoginPage';
import Events from './Events';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './UserPage';

const App = () => (
  <GoogleOAuthProvider clientId="384266850449-2abgqa8f41csod595crjlj5kiugulrf3.apps.googleusercontent.com">
    <Router>
      <Routes>
      <Route path="/" element= {<LoginPage />}/>{}
      <Route path="/Events" element={<Events />  } />{}
      <Route path="/UserPage" element={<UserPage />} />
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);

export default App;