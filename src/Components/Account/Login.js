import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Importez Navigate depuis react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../styles/sb-admin-2.min.css'; // Chemin ajusté
import '../../styles/sb-admin-2.css';

const Login = ({ setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(''https://localhost:7230/api/Account/login', {
        username,
        password,
      });

      const { token, userRoleDto } = response.data;

      if (userRoleDto) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRoleDto.role); // Stockez le rôle dans localStorage
        setRole(userRoleDto.role); // Stockez le rôle dans l'état de l'application
        console.log(userRoleDto); // Affichez UserRoleDto pour voir ses valeurs
        

        // Redirigez l'utilisateur vers le tableau de bord après la connexion
        return <Navigate to="/dashboard" replace />;
      } else {
        setError('Données utilisateur non disponibles');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  return (
    <div className="bg-gradient-primary" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome !</h1>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            id="exampleInputUsername"
                            aria-describedby="usernameHelp"
                            placeholder="Enter Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          Login
                        </button>
                      </form>
                      <div className="text-center">
                        <a className="small" href="forgot-password.html">Forgot Password?</a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="Register">Create an Account!</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
