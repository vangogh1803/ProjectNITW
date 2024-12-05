import React from 'react';
import { GoogleOAuthProvider} from '@react-oauth/google';
import LoginPage from './LoginPage';
import Events from './Events';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Wrap your application with GoogleOAuthProvider in your main entry file (e.g., index.js)
const App = () => (
  <GoogleOAuthProvider clientId="384266850449-2abgqa8f41csod595crjlj5kiugulrf3.apps.googleusercontent.com">
    <Router>
      <Routes>
      <Route path="/" element= {<LoginPage />}/>{}
      <Route path="/Events" element={<Events />  } />{}
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);

export default App;