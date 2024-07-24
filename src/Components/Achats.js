import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';



export class Achats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      achats: [],
      modalTitle: "",
      achatDate: "",
      idSubCategory: 0,
      idFournisseur: 0,
      quantite: 0,
      unite: "",
      cost: 0,
      idAchat: 0,
      subcategories: [],
      
      fournisseurs: [],
      isAdmin: true,
      itemsPerPage: 5,
      itemOffset: 0,
      pageCount: 0,
      currentItems: []
    };
  }

  componentDidMount() {
    this.refreshList();
    this.loadSubCategories();
    this.loadFournisseurs();
  }

  refreshList() {
    axios.get('https://localhost:7230/api/Achats')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
        this.setState({ 
          achats: response.data ,
          achatsWithoutFilter: response.data,
          pageCount,
          currentItems
        });
      })
      .catch(error => {
        console.error('Failed to fetch Achats data:', error);
      });
  }

  loadSubCategories() {
    axios.get('https://localhost:7230/api/SubCategoryMatierPremier')
      .then(response => {
        this.setState({ subcategories: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch SubCategoryMatierPremier data:', error);
      });
  }

  loadFournisseurs() {
    axios.get('https://localhost:7230/api/Fournisseurs')
      .then(response => {
        this.setState({ fournisseurs: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch Fournisseurs data:', error);
      });
  }

 
  changeachatDate = (e) => {
    this.setState({ achatDate: e.target.value });
  }
 

  changeIdSubCategory = (e) => {
    this.setState({ idSubCategory: parseInt(e.target.value, 10) });
  }

  changeIdFournisseur = (e) => {
    this.setState({ idFournisseur: parseInt(e.target.value, 10) });
  }

  changeQuantite = (e) => {
    this.setState({ quantite: parseFloat(e.target.value) });
  }

  changeUnite = (e) => {
    this.setState({ unite: e.target.value });
  }

  changeCost = (e) => {
    this.setState({ cost: parseFloat(e.target.value) });
  }

  addClick() {
    this.setState({
      modalTitle: "Add Achats",
      idAchat: 0,
      achatDate: "",
      idSubCategory: 0,
      idFournisseur: 0,
      quantite: 0,
      unite: "kg",
      cost: 0
    });
  }

  editClick(achat) {
    this.setState({
      modalTitle: "Edit Achats",
      idAchat: achat.idAchat,
      achatDate: achat.achatDate,
      idSubCategory: achat.idSubCategory,
      idFournisseur: achat.idFournisseur,
      quantite: achat.quantite,
      unite: achat.unite,
      cost: achat.cost
    });
  }

  validateFields() {
    const { achatDate,idSubCategory, idFournisseur, quantite } = this.state;

    if (!achatDate || !idSubCategory || !idFournisseur || !quantite) {
      alert('Please fill out all fields');
      return false;
    }

    return true;
  }

  createClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.post('https://localhost:7230/api/Achats', {
      achatDate: this.state.achatDate,
      idSubCategory: this.state.idSubCategory,
      idFournisseur: this.state.idFournisseur,
      quantite: this.state.quantite,
      unite: this.state.unite,
      cost: this.state.cost
    })
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          alert('Achats created successfully');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Failed to create Achats');
        }
      })
      .catch(error => {
        alert('Failed to create Achats');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://localhost:7230/api/Achats/${this.state.idAchat}`, {
      idAchat: this.state.idAchat,
      achatDate: this.state.achatDate,
      idSubCategory: this.state.idSubCategory,
      idFournisseur: this.state.idFournisseur,
      quantite: this.state.quantite,
      unite: this.state.unite,
      cost: this.state.cost
    })
      .then(response => {
        if (response.status === 200 || response.status === 204 ) {
          alert('Achats updated successfully');
        } else {
          alert('Failed to update Achats');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Failed to update Achats');
      });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      axios.delete(`https://localhost:7230/api/Achats/${id}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            alert('Achats deleted successfully');
          } else {
            alert('Failed to delete Achats');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Failed to delete Achats');
        });
    }
  }

  clearFields() {
    this.setState({
      idSubCategory: 0,
      idFournisseur: 0,
      achatDate:"",
      quantite: 0,
      unite: "",
      cost: 0
    });
  }

  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.achats.length;
    const currentItems = this.state.achats.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }

  convertirDate = (achatDate) => {
    return new Date(achatDate).toLocaleDateString(); // Cette méthode utilise le format local par défaut
  }
  render() {
    const {
      achats,
      achatDate,
      modalTitle,
      idSubCategory,
      idFournisseur,
      quantite,
      unite,
      cost,
      subcategories,
      fournisseurs,
      currentItems,
      pageCount
    } = this.state;

    const isAdmin = localStorage.getItem('role') === 'Admin';

    return (
      <div>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-6"> Table des Achats </h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Add Achats
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>achat Date</th>
              <th>Subcategory Name</th>
              <th>Fournisseur</th>
              <th>Quantite</th>
              <th>Unite</th>
              {isAdmin && <th>Cost</th>}
              {isAdmin && <th>Options</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(achat =>
              <tr key={achat.idAchat}>
                <td>{this.convertirDate(achat.achatDate)}</td>
                <td>
                  {/* Afficher le subcategoryName correspondant */}
                  {subcategories.find(subcat => subcat.idSubcategory === achat.idSubCategory)?.subcategoryName}
                </td>
                <td>
                  {/* Afficher le nom du fournisseur correspondant */}
                  {fournisseurs.find(fourn => fourn.idFournisseur === achat.idFournisseur)?.nomFournisseur}
                </td>
                <td>{achat.quantite}</td>
                <td>{achat.unite}</td>
                {isAdmin && <td>{achat.cost}</td>}
                {isAdmin && 
                <td>
                  <button type="button"
                    className="btn btn-light mr-1"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => this.editClick(achat)}>
                      <FontAwesomeIcon icon={faEdit} /> 
                    
                  </button>

                  <button type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(achat.idAchat)}>
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
                  <span className="input-group-text">achatDate</span>
                  <input type="date" className="form-control"
                    value={achatDate}
                    onChange={this.changeachatDate} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Subcategory Name</span>
                  <select className="form-select"
                    value={idSubCategory}
                    onChange={this.changeIdSubCategory}>
                    <option value={0}>Select Subcategory</option>
                    {subcategories.map(subcategory =>
                      <option key={subcategory.idSubcategory} value={subcategory.idSubcategory}>{subcategory.subcategoryName}</option>
                    )}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Fournisseur</span>
                  <select className="form-select"
                    value={idFournisseur}
                    onChange={this.changeIdFournisseur}>
                    <option value={0}>Select Fournisseur</option>
                    {fournisseurs.map(fournisseur =>
                      <option key={fournisseur.idFournisseur} value={fournisseur.idFournisseur}>{fournisseur.nomFournisseur}</option>
                    )}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Quantite</span>
                  <input type="number" className="form-control"
                    value={quantite}
                    onChange={this.changeQuantite} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Unite</span>
                  <input type="text" className="form-control"
                    value={unite} readOnly 
                    onChange={this.changeUnite} />
                </div>
                {isAdmin &&
                <div className="input-group mb-3">
                  <span className="input-group-text">Cost</span>
                  <input type="number" className="form-control"
                    value={cost}
                    onChange={this.changeCost} />
                </div>}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={() => this.state.idAchat === 0 ? this.createClick() : this.updateClick()}>create</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Achats;
