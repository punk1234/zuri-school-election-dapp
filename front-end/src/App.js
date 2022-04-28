
import React, {useContext, useEffect} from 'react'
import "./App.css";

import Home from "./components/Home";
import NotFound from "./components/404NotFound";
import Profile from "./components/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { electionContext } from './context/ViewElectionContext'

function App() {
  const { generalError, setGeneralError } =
    useContext(electionContext);
 //notification popups
  const notify = (message) => {
    return toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      
      draggable: true,
      progress: undefined,
      limit: 1,
    });
  };
  
  //notification
  useEffect(() => {
    if(generalError){
    notify(generalError)
    
    }
    setGeneralError("")
  }, [generalError])
  

  return (
    <BrowserRouter>
    <ToastContainer position="top-center" />
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
       
    </BrowserRouter>
  );
}

export default App;
