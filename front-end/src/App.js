

import "./App.css";
import Home from "./components/Home";
import NotFound from "./components/404NotFound";
import Profile from "./components/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";import Vote from "./components/Vote";
import Navbar from "./components/Navbar";
;

function App() {
 
  

  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="vote" element={<Vote />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
