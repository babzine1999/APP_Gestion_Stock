// src/navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ role, handleLogout }) => (
  <nav className="navbar navbar-expand-sm bg-light navbar-dark">
    <ul className="navbar-nav">
      {role && (
        <>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/MatierUsedFabrication">
              MatierUsedFabrication
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/Achats">
              Achats
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/ProductionsNT">
              ProductionsNT
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/ConcurrenceTransactions">
              ConcurrenceTransactions
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/Fournisseurs">
              Fournisseurs
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/Concurrents">
              Concurrents
            </NavLink>
          </li>
          {role === 'Admin' && (
            <>
              <li className="nav-item m-1">
                <NavLink className="btn btn-light btn-outline-primary" to="/Societe">
                  Societes
                </NavLink>
              </li>
              <li className="nav-item m-1">
                <NavLink className="btn btn-light btn-outline-primary" to="/MatierPremier">
                  MatierPremier
                </NavLink>
              </li>
              <li className="nav-item m-1">
                <NavLink className="btn btn-light btn-outline-primary" to="/SubCategoryMatierPremier">
                  SubCategoryMatierPremier
                </NavLink>
              </li>
            </>
          )}
          <li className="nav-item m-1">
            <button className="btn btn-light btn-outline-primary" onClick={handleLogout}>
              Déconnexion
            </button>
          </li>
        </>
      )}
      
    </ul>
  </nav>
);

export default Navbar;
