import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';




export class Fournisseurs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fournisseurs: [],
      modalTitle: "",
      nomFournisseur: "",
      adress: "",
      contact: "",
      idFournisseur: 0,
      fournisseursWithoutFilter: [],
      isAdmin: true, // Mettez ici votre logique pour déterminer si l'utilisateur est admin
      itemsPerPage: 5,
      nomFournisseurFilter:"",
      itemOffset: 0,
      pageCount: 0,
      currentItems: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    axios.get('https://192.168.1.20:5000/api/Fournisseurs')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
        
        this.setState({ 
          fournisseurs: response.data, 
          fournisseursWithoutFilter: response.data,
          pageCount,
          currentItems
         });
      })
      .catch(error => {
        console.error('Failed to fetch Fournisseurs data:', error);
      });
  }


  filterFn() {
    const nomFournisseurFilter = this.state.nomFournisseurFilter.toLowerCase();
    const filteredData = this.state.fournisseursWithoutFilter.filter(
      el => el.nomFournisseur.toLowerCase().includes(nomFournisseurFilter)
    );
  
    // Update pageCount and currentItems based on filtered data
    const pageCount = Math.ceil(filteredData.length / this.state.itemsPerPage);
    const newOffset = this.state.itemOffset >= filteredData.length ? 0 : this.state.itemOffset;
    const currentItems = filteredData.slice(newOffset, newOffset + this.state.itemsPerPage);
  
    this.setState({ fournisseurs: filteredData, pageCount, itemOffset: newOffset, currentItems });
  }

  sortResult(prop, asc) {
    const sortedData = this.state.fournisseursWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
    const currentItems = sortedData.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
    this.setState({ fournisseurs: sortedData, currentItems });
  }
  changenomFournisseurFilter = (e) => {
    this.setState({ nomFournisseurFilter: e.target.value }, this.filterFn);
  }
  changeNomFournisseur = (e) => {
    const value = e.target.value.toUpperCase();
    // Check if the name already exists
    if (this.state.fournisseurs.some(f => f.nomFournisseur === value)) {
      alert('Ce nom de fournisseur existe déjà.');
      return;
    }
    this.setState({ nomFournisseur: value });
  }

  changeAdress = (e) => {
    const value = e.target.value.toUpperCase();
    // Validate address: only letters and digits
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
      alert('L\'adresse ne doit contenir que des lettres et des chiffres.');
      return;
    }
    this.setState({ adress: value });
  }

  changeContact = (e) => {
    const value = e.target.value;
    // Validate contact: only digits
    if (!/^\d+$/.test(value)) {
      alert('Le contact ne doit contenir que des chiffres.');
      return;
    }
    this.setState({ contact: value });
  }

  addClick() {
    this.setState({
      modalTitle: "Add Fournisseur",
      idFournisseur: 0,
      nomFournisseur: "",
      adress: "",
      contact: ""
    });
  }

  editClick(fournisseur) {
    this.setState({
      modalTitle: "Edit Fournisseur",
      idFournisseur: fournisseur.idFournisseur,
      nomFournisseur: fournisseur.nomFournisseur,
      adress: fournisseur.adress,
      contact: fournisseur.contact
    });
  }

  validateFields() {
    const { nomFournisseur } = this.state;

    if (!nomFournisseur ) {
      alert('Veuillez remplir tous les champs.');
      return false;
    }

    // Additional validation if needed

    return true;
  }

  createClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.post('https://192.168.1.20:5000/api/Fournisseurs', {
      nomFournisseur: this.state.nomFournisseur,
      adress: this.state.adress,
      contact: this.state.contact
    })
      .then(response => {
        if (response.status === 201 || response.status === 200 || response.status === 204) {
          alert('Fournisseur créé avec succès');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Échec de la création du fournisseur');
        }
      })
      .catch(error => {
        alert('Échec de la création du fournisseur');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.20:5000/api/Fournisseurs/${this.state.idFournisseur}`, {
      idFournisseur: this.state.idFournisseur,
      nomFournisseur: this.state.nomFournisseur,
      adress: this.state.adress,
      contact: this.state.contact
    })
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          alert('Fournisseur mis à jour avec succès');
        } else {
          alert('Échec de la mise à jour du fournisseur');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Échec de la mise à jour du fournisseur');
      });
  }

  deleteClick(idFournisseur) {
    if (window.confirm('Êtes-vous sûr?')) {
      axios.delete(`https://192.168.1.20:5000/api/Fournisseurs/${idFournisseur}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            alert('Fournisseur supprimé avec succès');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Échec de la suppression du fournisseur');
        });
    }
  }

  clearFields() {
    this.setState({
      nomFournisseur: "",
      adress: "",
      contact: ""
    });
  }
  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.fournisseurs.length;
    const currentItems = this.state.fournisseurs.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }

  render() {
    const {
      fournisseurs,
      modalTitle,
      nomFournisseur,
      adress,
      contact,
      currentItems,
      pageCount
      
    } = this.state;

    const isAdmin = localStorage.getItem('role') === 'Admin';


    return (
      <div>
         <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-6"> Table des Fournisseurs </h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Ajouter Fournisseur
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className='d-flex flex-row'>

                </div>Nom Fournisseur
              </th>
              {isAdmin && <th>
                <div className="d-flex flex-row">
                  <input className="form-control m-2"
                    onChange={this.changenomFournisseurFilter}
                    placeholder="Filter" />

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('nomFournisseur', true)}>
                    Sort ↑
                  </button>

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('nomFournisseur', false)}>
                    Sort ↓
                  </button>
                </div>          
                Adresse</th>}
              {isAdmin && <th>Contact</th>}
              {isAdmin && <th>Options</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(fournisseur =>
              <tr key={fournisseur.idFournisseur}>
                <td>{fournisseur.nomFournisseur}</td>
                {isAdmin && <td>{fournisseur.adress}</td>}
                {isAdmin && <td>{fournisseur.contact}</td>}
                {isAdmin &&
                <td>
                  <button type="button"
                    className="btn btn-light mr-1"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => this.editClick(fournisseur)}>
                   
                   <FontAwesomeIcon icon={faEdit} /> 
                   
                  </button>

                  <button type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(fournisseur.idFournisseur)}>
                     <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>}
              </tr>
            )}
          </tbody>
        </table>
        <NavLink className="nav-link" to="/dashboard'">
          <button type='button' className="btn btn-outline-secondary">Back to Dashboard</button>
        </NavLink>

        <ReactPaginate
          nextLabel="next >"
          onPageChange={this.handlePageClick}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />


        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5>
                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Nom Fournisseur</span>
                  <input type="text" className="form-control"
                    value={nomFournisseur}
                    onChange={this.changeNomFournisseur} />
                </div>

                {isAdmin &&
                  <div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Adresse</span>
                      <input type="text" className="form-control"
                        value={adress}
                        onChange={this.changeAdress} />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">Contact</span>
                      <input type="text" className="form-control"
                        value={contact}
                        onChange={this.changeContact} />
                    </div>
                  </div>
                }
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">close</button>
                <button type="button" className="btn btn-primary"
                  onClick={this.state.idFournisseur === 0 ? () => this.createClick() : () => this.updateClick()}>
                  {this.state.idFournisseur === 0 ? "create" : "Mettre à jour"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Fournisseurs;
