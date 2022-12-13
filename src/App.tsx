import React from 'react';
import './App.css';

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import LogIn from "./pages/LogIn";
import ProfilePreviewWithToken from "./pages/ProfilePreviewWithToken";
import ProfilePreview from "./pages/ProfilePreview";

function App() {
  return (
      <Routes>
        
        <Route path="/" element={<Home />} />

        <Route path="/logIn" element={<LogIn />} />

        <Route path="/createAccount" element={<CreateAccount />} />

        <Route path="/profile/preview/:token" element={<ProfilePreviewWithToken />} />

        <Route path="/profile/preview" element={<ProfilePreview />} />

      </Routes>    
  );
}

export default App;
