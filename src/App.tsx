import React from 'react';
import './App.css';

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import LogIn from "./pages/LogIn";
import ProfilePreviewWithToken from "./pages/ProfilePreviewWithToken";
import ProfilePreview from "./pages/ProfilePreview";
import VideosPage from "./pages/Videos";
import CreateVideoPage from "./pages/CreateVideo";
import EditVideoPage from './pages/EditVideo';
import TrainersClientPage from "./pages/TrainersClient";

function App() {
  return (
      <Routes>
        
        <Route path="/profile" element={<Home />} />

        <Route path="/logIn" element={<LogIn />} />

        <Route path="/createAccount" element={<CreateAccount />} />

        <Route path="/profile/preview/:token" element={<ProfilePreviewWithToken />} />

        <Route path="/" element={<ProfilePreview />} />
        
        <Route path="/videos" element={<VideosPage />} />

        <Route path="/createVideo" element={<CreateVideoPage />} />

        <Route path="video/:videoId/edit" element={<EditVideoPage />} />

        <Route path="/clients" element={<TrainersClientPage />} />

      </Routes>    
  );
}

export default App;
