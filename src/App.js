// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
//import Navbar from './navbar';

function App() {

  // Initialise l'état role avec la valeur stockée dans localStorage. Si le rôle n'est pas défini, il sera null
  const [role, setRole] = useState(localStorage.getItem('role'));

  //
  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

 {/* <!--  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
  }; --> */}
 
  return (
    <BrowserRouter>
      <div className="App container">
        {/* <!-- <Navbar role={role} handleLogout={handleLogout} />-->*/}
        <AppRoutes role={role} setRole={setRole} />
      </div>
    </BrowserRouter>
  );
}

export default App;
