import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';



export class SubCategoryMatierPremier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subcategories: [],
      modalTitle: "",
      subcategoryName: "",
      idMatierPremier: 0,
      stock: 0,
      id: 0,
      subcategoryNameFilter: "",
      subcategoriesWithoutFilter: [],
      matierPremiers: [],     
      itemsPerPage: 5,
      itemOffset: 0,
      pageCount: 0,
      currentItems: []
    };
  }

  componentDidMount() {
    this.refreshList();
    this.loadMatierPremiers();
  }

  refreshList() {
    axios.get('https://192.168.1.20:5000/api/SubCategoryMatierPremier')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
        this.setState({
          subcategories: response.data,
          subcategoriesWithoutFilter: response.data,
          pageCount,
          currentItems
        });
      })
      .catch(error => {
        console.error('Failed to fetch SubCategoryMatierPremier data:', error);
      });
  }

  loadMatierPremiers() {
    axios.get('https://192.168.1.20:5000/api/MatierPremier')
      .then(response => {
        this.setState({ matierPremiers: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch MatierPremier data:', error);
      });
  }

  filterFn() {
    const subcategoryNameFilter = this.state.subcategoryNameFilter.toLowerCase();
    const filteredData = this.state.subcategoriesWithoutFilter.filter(
      el => el.subcategoryName.toLowerCase().includes(subcategoryNameFilter)
    );
  
    // Update pageCount and currentItems based on filtered data
    const pageCount = Math.ceil(filteredData.length / this.state.itemsPerPage);
    const newOffset = this.state.itemOffset >= filteredData.length ? 0 : this.state.itemOffset;
    const currentItems = filteredData.slice(newOffset, newOffset + this.state.itemsPerPage);
  
    this.setState({ subcategories: filteredData, pageCount, itemOffset: newOffset, currentItems });
  }
  

  sortResult(prop, asc) {
    const sortedData = this.state.subcategoriesWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
    const currentItems = sortedData.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
    this.setState({ subcategories: sortedData, currentItems });
  }

  changeSubcategoryNameFilter = (e) => {
    this.setState({ subcategoryNameFilter: e.target.value }, this.filterFn);
  }
  

  changeSubcategoryName = (e) => {
    const input = e.target.value;
    // Autoriser les caractères alphabétiques, espaces et chiffres
    const formattedInput = input.replace(/[^A-Za-z0-9\s]/g, '');
    // Mettre tout en majuscules
    const capitalizedInput = formattedInput.toUpperCase();
    this.setState({ subcategoryName: capitalizedInput });
  }
  
  


  changeStock = (e) => {
    this.setState({ stock: parseFloat(e.target.value) });
  }
  

  changeMatierPremierId = (e) => {
    this.setState({ idMatierPremier: parseInt(e.target.value, 10) });
  }

  addClick() {
    this.setState({
      modalTitle: "Add SubCategoryMatierPremier",
      id: 0,
      subcategoryName: "",
      idMatierPremier: 0,
      stock: 0
    });
  }

  editClick(subcategory) {
    this.setState({
      modalTitle: "Edit SubCategoryMatierPremier",
      id: subcategory.idSubcategory,
      subcategoryName: subcategory.subcategoryName,
      idMatierPremier: subcategory.idMatierPremier,
      stock: subcategory.stock
    });
  }

  validateFields() {
    const { subcategoryName, idMatierPremier, stock } = this.state;
  
    if (!subcategoryName || subcategoryName.length < 3 || !idMatierPremier || stock.length < 3) {
      alert('Please fill out all fields with at least 3 characters');
      return false;
    }
  
    if (!this.isValidInput(subcategoryName)) {
      alert('Please use only alphabetic characters (A-Z, a-z) in Subcategory Name');
      return false;
    }
  
    // Check if subcategoryName already exists only if it's a new entry or name has been changed
    if (this.state.id === 0 || subcategoryName !== this.props.subcategoryName) {
      if (this.isDuplicateSubcategoryName(subcategoryName)) {
        alert('Subcategory with this name already exists');
        return false;
      }
    }
  
    return true;
  }
  
   
  isDuplicateSubcategoryName(subcategoryName) {
    return this.state.subcategories.some(subcategory =>
      subcategory.subcategoryName.trim().toLowerCase() === subcategoryName.trim().toLowerCase()
      && subcategory.idSubcategory !== this.state.id  // Exclude current subcategory being edited
    );
  }
  

  isValidInput(input) {
    // Allow only alphabetic characters and spaces
    return /^[A-Za-z0-9\s]+$/.test(input);
  }

  createClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.post('https://192.168.1.20:5000/api/SubCategoryMatierPremier', {
      idMatierPremier: this.state.idMatierPremier,
      stock: this.state.stock,
      subcategoryName: this.state.subcategoryName
    })
      .then(response => {
        if (response.status === 201 || response.status === 204 || response.status === 200) {
          alert('SubCategoryMatierPremier created successfully');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Failed to create SubCategoryMatierPremier');
        }
      })
      .catch(error => {
        alert('Failed to create SubCategoryMatierPremier');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.20:5000/api/SubCategoryMatierPremier/${this.state.id}`, {
      idSubcategory: this.state.id,
      idMatierPremier: this.state.idMatierPremier,
      stock: this.state.stock,
      subcategoryName: this.state.subcategoryName
    })
      .then(response => {
        if (response.status === 200 || response.status === 204 ) {
          alert('SubCategoryMatierPremier updated successfully');
        } else {
          alert('Failed to update SubCategoryMatierPremier');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Failed to update SubCategoryMatierPremier');
      });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      axios.delete(`https://192.168.1.20:5000/api/SubCategoryMatierPremier/${id}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            alert('SubCategoryMatierPremier deleted successfully');
          } else {
            alert('Failed to delete SubCategoryMatierPremier');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Failed to delete SubCategoryMatierPremier');
        });
    }
  }

  clearFields() {
    this.setState({
      subcategoryName: "",
      idMatierPremier: 0,
      stock: 0
    });
  }

  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.subcategories.length;
    const currentItems = this.state.subcategories.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }

  render() {
    const {
      modalTitle,
      subcategoryName,
      idMatierPremier,
      stock,
      
      matierPremiers,
      currentItems,
      pageCount
    } = this.state;

    return (
      <div>

<div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-6"> Table des sous-catégories pour la matière première </h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Add SubCategoryMatierPremier
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className='d-flex flex-row'>

                </div>
                  Subcategory Name
              </th>

              <th>
              <div className="d-flex flex-row">
                  <input className="form-control m-2"
                    onChange={this.changeSubcategoryNameFilter}
                    placeholder="Filter" />

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('subcategoryName', true)}>
                    Sort ↑
                  </button>

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('subcategoryName', false)}>
                    Sort ↓
                  </button>
                </div>
                Matier Premier
              </th>
              <th>Stock</th>
              <th>Options</th>
            </tr>
          </thead>



          <tbody>
          {currentItems.map(subcategory =>
              <tr key={subcategory.idSubcategory}>
                <td>{subcategory.subcategoryName}</td>
                <td>
                  {matierPremiers.find(mp => mp.id === subcategory.idMatierPremier)?.categoryName}
                </td>
                <td>{subcategory.stock}</td>
                <td>
                  <button type="button" className="btn btn-light mr-1"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => this.editClick(subcategory)}>
                    
                    <FontAwesomeIcon icon={faEdit} /> 
                  </button>
                  <button type="button" className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(subcategory.idSubcategory)}>
                     <FontAwesomeIcon icon={faTrash} />
                    
                  </button>
                </td>
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
                  <span className="input-group-text">Subcategory Name</span>
                  <input type="text" className="form-control"
                    value={subcategoryName}
                    onChange={this.changeSubcategoryName} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Matier Premier</span>
                  <select className="form-select"
                    value={idMatierPremier}
                    onChange={this.changeMatierPremierId}>
                    <option value={0}>Select Matier Premier</option>
                    {matierPremiers.map(matierPremier =>
                      <option key={matierPremier.id} value={matierPremier.id}>{matierPremier.categoryName}</option>
                    )}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Stock</span>
                  <input type="number" className="form-control"
                    value={stock}
                    onChange={this.changeStock} /> 
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary"
                  onClick={this.state.id === 0 ? () => this.createClick() : () => this.updateClick()}>
                  {this.state.id === 0 ? "Create" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubCategoryMatierPremier;
