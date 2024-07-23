import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';




export class MatierUsedFabrication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matierUsedFabrications: [],
      modalTitle: "",
      date: "",
      idSociete: 0,
      idSubCategory: 0,
      quantiteUsed: 0,
      unite: "",
      idFab: 0,
      societes: [],
      subcategories: [],
      isAdmin: true,
      itemsPerPage: 5,
      itemOffset: 0,
      pageCount: 0,
      currentItems: []
    };
  }

  componentDidMount() {
    this.refreshList();
    this.loadSocietes();
    this.loadSubCategories();
  }

  refreshList() {
    axios.get('https://192.168.1.20:5000/api/MatierUsedFabrications')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
        this.setState({ 
          matierUsedFabrications: response.data,
          subcategoriesWithoutFilter:response.data,
          pageCount,
          currentItems });
      })
      .catch(error => {
        console.error('Failed to fetch MatierUsedFabrication data:', error);
      });
  }

  loadSocietes() {
    axios.get('https://192.168.1.20:5000/api/Societe')
      .then(response => {
        this.setState({ societes: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch Societe data:', error);
      });
  }

  loadSubCategories() {
    axios.get('https://192.168.1.20:5000/api/SubCategoryMatierPremier')
      .then(response => {
        this.setState({ subcategories: response.data, subcategoriesWithoutFilter: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch SubCategoryMatierPremier data:', error);
      });
  }

  filterFn() {
    const subcategoryNameFilter = this.state.subcategoryNameFilter.toLowerCase();

    const filteredData = this.state.subcategoriesWithoutFilter.filter(
      el => el.subcategoryName.toLowerCase().includes(subcategoryNameFilter)
    );

    this.setState({ subcategories: filteredData });
  }

  sortResult(prop, asc) {
    const sortedData = this.state.subcategoriesWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });

    this.setState({ subcategories: sortedData });
  }

  changeDate = (e) => {
    const date = new Date(e.target.value).toISOString().split('T')[0];
    this.setState({ date });
  }

  changeSocieteId = (e) => {
    this.setState({ idSociete: parseInt(e.target.value, 10) });
  }

  changeSubcategoryId = (e) => {
    this.setState({ idSubCategory: parseInt(e.target.value, 10) });
  }

  changeQuantiteUsed = (e) => {
    this.setState({ quantiteUsed: parseFloat(e.target.value) });
  }

  changeUnite = (e) => {
    this.setState({ unite: e.target.value });
  }

  addClick = () => {
    this.setState({
      modalTitle: "Add MatierUsedFabrication",
      idFab: 0,
      date: "",
      idSociete: 0,
      idSubCategory: 0,
      quantiteUsed: 0,
      unite: "kg"
    });
  }

  editClick = (matierUsedFabrication) => {
    this.setState({
      modalTitle: "Edit MatierUsedFabrication",
      idFab: matierUsedFabrication.idFab,
      date: matierUsedFabrication.date,
      idSociete: matierUsedFabrication.idSociete,
      idSubCategory: matierUsedFabrication.idSubCategory,
      quantiteUsed: matierUsedFabrication.quantiteUsed,
      unite: matierUsedFabrication.unite
    });
  }

  validateFields = () => {
    const { date, idSociete, idSubCategory, quantiteUsed, unite } = this.state;

    if (!date || !idSociete || !idSubCategory || !quantiteUsed || !unite) {
      alert('Please fill out all fields');
      return false;
    }

    return true;
  }

  createClick = () => {
    if (!this.validateFields()) {
      return;
    }

    axios.post('https://192.168.1.20:5000/api/MatierUsedFabrications', {
      date: this.state.date,
      idSociete: this.state.idSociete,
      idSubCategory: this.state.idSubCategory,
      quantiteUsed: this.state.quantiteUsed,
      unite: this.state.unite
    })
      .then(response => {
        if (response.status === 201 || response.status === 200 || response.status === 204) {
          alert('MatierUsedFabrication created successfully');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Failed to create MatierUsedFabrication');
        }
      })
      .catch(error => {
        alert('Failed to create MatierUsedFabrication');
      });
  }

  updateClick = () => {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.20:5000/api/MatierUsedFabrications/${this.state.idFab}`, {
      idFab: this.state.idFab,
      date: this.state.date,
      idSociete: this.state.idSociete,
      idSubCategory: this.state.idSubCategory,
      quantiteUsed: this.state.quantiteUsed,
      unite: this.state.unite
    })
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          alert('MatierUsedFabrication updated successfully');
        } else {
          alert('Failed to update MatierUsedFabrication');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Failed to update MatierUsedFabrication');
      });
  }

  deleteClick = (idFab) => {
    if (window.confirm('Are you sure?')) {
      axios.delete(`https://192.168.1.20:5000/api/MatierUsedFabrications/${idFab}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            alert('MatierUsedFabrication deleted successfully');
          } else {
            alert('Failed to delete MatierUsedFabrication');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Failed to delete MatierUsedFabrication');
        });
    }
  }

  clearFields = () => {
    this.setState({
      date: "",
      idSociete: 0,
      idSubCategory: 0,
      quantiteUsed: 0,
      unite: ""
    });
  }
  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.matierUsedFabrications.length;
    const currentItems = this.state.matierUsedFabrications.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }


  convertirDate = (date) => {
    return new Date(date).toLocaleDateString(); // Cette méthode utilise le format local par défaut
  }
  render() {
    const {
      matierUsedFabrications,
      modalTitle,
      date,
      idSociete,
      idSubCategory,
      quantiteUsed,
      unite,
      societes,
      subcategories,
      currentItems,
      pageCount
    } = this.state;

    const isAdmin = localStorage.getItem('role') === 'Admin';

    return (
      <div>
         <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-6"> Table Matier utiliser pour la fabrication </h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={this.addClick}>
          Add MatierUsedFabrication
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Societe</th>
              <th>Subcategory</th>
              <th>Quantite Used</th>
              <th>Unite</th>
              {isAdmin && <th>Options</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(matierUsed =>
              <tr key={matierUsed.idFab}>
                <td>{this.convertirDate(matierUsed.date)}</td>
                <td>{societes.find(soc => soc.idSociete === matierUsed.idSociete)?.societeName}</td>
                <td>{subcategories.find(sub => sub.idSubcategory === matierUsed.idSubCategory)?.subcategoryName}</td>
                <td>{matierUsed.quantiteUsed}</td>
                <td>{matierUsed.unite}</td>
                {isAdmin &&
                <td>
                  <button type="button"
                    className="btn btn-light mr-1"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => this.editClick(matierUsed)}>
                    
                    <FontAwesomeIcon icon={faEdit} />

                  </button>
                  <button type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(matierUsed.idFab)}>
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
                  <span className="input-group-text">Date</span>
                  <input type="date" className="form-control"
                    value={date}
                    onChange={this.changeDate} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Societe</span>
                  <select className="form-control"
                    value={idSociete}
                    onChange={this.changeSocieteId}>
                    <option value="">-- Select Societe --</option>
                    {societes.map(soc =>
                      <option key={soc.idSociete} value={soc.idSociete}>{soc.societeName}</option>
                    )}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Subcategory</span>
                  <select className="form-control"
                    value={idSubCategory}
                    onChange={this.changeSubcategoryId}>
                    <option value="">-- Select Subcategory --</option>
                    {subcategories.map(sub =>
                      <option key={sub.idSubcategory} value={sub.idSubcategory}>{sub.subcategoryName}</option>
                    )}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Quantite Used</span>
                  <input type="number" className="form-control"
                    value={quantiteUsed}
                    onChange={this.changeQuantiteUsed} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Unite</span>
                  <input type="text" className="form-control"
                    value={unite} readOnly 
                    onChange={this.changeUnite}  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={() => this.state.idFab === 0 ? this.createClick() : this.updateClick()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatierUsedFabrication;
