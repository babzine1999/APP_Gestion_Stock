// src/routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Fournisseurs } from './Components/Fournisseurs';
import { Concurrents } from './Components/Concurrents';
import { MatierPremier } from './Components/MatierPremier';
import { SubCategoryMatierPremier } from './Components/SubCategoryMatierPremier';
import { Societe } from './Components/Societe';
import { Achats } from './Components/Achats';
import { MatierUsedFabrication } from './Components/MatierUsedFabrication';
import { ProductionsNT } from './Components/ProductionsNT';
import { ConcurrenceTransactions } from './Components/ConcurrenceTransactions';
import Login from './Components/Account/Login';
import Register from './Components/Account/Register';
import Dashboard from './Dashboard'; // Importez le composant Dashboard

const AppRoutes = ({ role, setRole }) => {
  if (!role) {
    return (
      <Routes>
        <Route path='/login' element={<Login setRole={setRole} />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Ajoutez une route pour le Dashboard */}
      <Route path='/dashboard' element={<Dashboard />} />

      {/* Ajoutez vos autres routes existantes */}
      <Route path='/Fournisseurs' element={<Fournisseurs />} />
      <Route path='/MatierPremier' element={<MatierPremier />} />
      <Route path='/Societe' element={<Societe />} />
      <Route path='/Concurrents' element={<Concurrents />} />
      <Route path='/Achats' element={<Achats />} />
      <Route path='/ProductionsNT' element={<ProductionsNT />} />
      <Route path='/MatierUsedFabrication' element={<MatierUsedFabrication />} />
      <Route path='/ConcurrenceTransactions' element={<ConcurrenceTransactions />} />
      <Route path='/SubCategoryMatierPremier' element={<SubCategoryMatierPremier />} />
      
      {/* Redirigez vers le tableau de bord par défaut après la connexion */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
