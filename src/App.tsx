import React from 'react';
import './App.css';

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import LogIn from "./pages/LogIn";

function App() {
  return (
      <Routes>
        
        <Route path="/" element={<Home />} />

        <Route path="/logIn" element={<LogIn />} />

        <Route path="/createAccount" element={<CreateAccount />} />

      </Routes>    
  );
}

export default App;
