import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate, NavLink } from 'react-router-dom';
import './styles/sb-admin-2.min.css';
import './styles/sb-admin-2.css';


function Dashboard() {
    const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem('role'));

    const changeStyle = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    };

    const changeStyle1 = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setRole(null);
        navigate('/login');
    };

    return (
        <div id="page-top">
            <div id="wrapper">
                <ul className={style} id="accordionSidebar">


                    <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to="#">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fa-laugh-wink"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">GS {role}<sup>2</sup></div>
                    </NavLink>

                    <hr className="sidebar-divider my-0" style={{ borderColor: '#fff' }} />
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/index.html">
                            <i className="fas fa-fw fa-tachometer-alt"></i>
                            <span>Liste des Tables</span>
                        </NavLink>
                    </li>
                    <hr className="sidebar-divider my-0" style={{ borderColor: '#fff' }} />

                    <li className="nav-item">
                        {role === 'Admin' && (
                            <>
                                <NavLink className="nav-link" to='/SubCategoryMatierPremier' >
                                    <i className="fas fa-fw fa-folder"></i>
                                    <span>SubCategory MP</span></NavLink>
                                <NavLink className="nav-link" to='/MatierPremier' >
                                    <i className="fas fa-fw fa-folder"></i>
                                    <span>Matier Premier</span></NavLink>
                                <NavLink className="nav-link" to='/Societe' >
                                    <i className="fas fa-fw fa-home"></i>
                                    <span>Societe</span></NavLink>
                                <NavLink className="nav-link" to='/Concurrents' >
                                    <i class="fas fa-fw fa-user"></i>
                                    <span>Concurrents</span></NavLink>
                            </>
                        )}

                        <NavLink className="nav-link" to='/Fournisseurs' >
                            <i class="fas fa-fw fa-user"></i>
                            <span>Fournisseurs</span></NavLink>
                        <NavLink className="nav-link" to='/ConcurrenceTransactions' >
                            <i className="fas fa-fw fa-wrench"></i>
                            <span>ConcurrenceTransactions</span></NavLink>
                        <NavLink className="nav-link" to='/ProductionsNT' >
                            <i className="fas fa-fw fa-cog"></i>
                            <span>ProductionsNT</span></NavLink>
                        <NavLink className="nav-link" to='/Achats' >
                            <i className="fas fa-fw fa-chart-area"></i>
                            <span>Achats</span></NavLink>
                        <NavLink className="nav-link" to='/MatierUsedFabrication' >
                            <i className="fas fa-fw fa-table"></i>
                            <span>Matier Used Fabrication</span></NavLink>

                    </li>


                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                    </div>
                </ul>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={changeStyle1}>
                                <i className="fa fa-bars"></i>
                            </button>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown no-arrow">
                                    <NavLink className="nav-link dropdown-toggle" to="#" id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{role}</span>
                                        <img className="img-profile rounded-circle"
                                            src="img/undraw_profile.svg" alt="profile" />
                                    </NavLink>
                                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown">
                                        <NavLink className="dropdown-item" to="#" data-toggle="modal" data-target="#logoutModal">
                                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Logout
                                        </NavLink>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                        <div>
                            <div className="jumbotron">
                                <h1 className="display-3">Bonjour, Bienvenue !!!
                                    <i className="fas fa-laugh-wink"></i>

                                </h1>
                                <div class="ag-format-container">
                                    <div class="ag-courses_box">
                                        <div class="ag-courses_item">
                                            <a href="#" class="ag-courses-item_link">
                                                <div class="ag-courses-item_bg"></div>
                                                <div class="ag-courses-item_title">
                                                    BakriFile
                                                    <p className="lead"> BakriFile est une société spécialisée dans la production de tous types de fils.</p>

                                                </div>

                                                <div class="ag-courses-item_date-box">
                                                    Start:
                                                    <span class="ag-courses-item_date">
                                                        31.10.2022
                                                    </span>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="ag-courses_item">
                                            <a href="#" class="ag-courses-item_link">
                                                <div class="ag-courses-item_bg"></div>
                                                <div class="ag-courses-item_title">
                                                    RotoPrint
                                                    <p className="lead">La société RotoPrint est spécialisée dans la production de sacs de transport pour nourriture.</p>
                                                </div>
                                                <div class="ag-courses-item_date-box">
                                                    Start:
                                                    <span class="ag-courses-item_date">
                                                        31.10.2022
                                                    </span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>RotoPrint &copy; BakriFile</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <button className="btn btn-light btn-outline-primary" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
