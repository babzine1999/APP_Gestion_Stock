import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export class MatierPremier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      modalTitle: "",
      DepartmentName: "",
      id: 0,
      DepartmentNameFilter: "",
      departmentsWithoutFilter: [],
      matiereType: "",
      itemsPerPage: 5,
      itemOffset: 0,
      pageCount: 0,
      currentItems: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    axios.get('https://192.168.1.249:5000/api/MatierPremier')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
        this.setState({
          departments: response.data,
          departmentsWithoutFilter: response.data,
          pageCount,
          currentItems
        });
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
  }

  FilterFn() {
    const DepartmentNameFilter = this.state.DepartmentNameFilter.toLowerCase();

    const filteredData = this.state.departmentsWithoutFilter.filter(
      el => el.categoryName.toLowerCase().includes(DepartmentNameFilter)
    );

    const pageCount = Math.ceil(filteredData.length / this.state.itemsPerPage);
    const newOffset = this.state.itemOffset >= filteredData.length ? 0 : this.state.itemOffset;
    const currentItems = filteredData.slice(newOffset, newOffset + this.state.itemsPerPage);

    this.setState({
      departments: filteredData,
      pageCount,
      itemOffset: newOffset,
      currentItems
    });
  }

  sortResult(prop, asc) {
    const sortedData = this.state.departmentsWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
    const currentItems = sortedData.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
    this.setState({ departments: sortedData, currentItems });
  }

  changeDepartmentNameFilter = (e) => {
    this.setState({ DepartmentNameFilter: e.target.value }, this.FilterFn);
  }

  changeDepartmentName = (e) => {
    this.setState({ DepartmentName: this.capitalizeFirstLetter(e.target.value) });
  }

  changeDepartmentType = (e) => {
    this.setState({ matiereType: this.capitalizeFirstLetter(e.target.value) });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  addClick() {
    this.setState({
      modalTitle: "Add Matier premier",
      id: 0,
      DepartmentName: "",
      matiereType: ""
    });
  }

  editClick(dep) {
    this.setState({
      modalTitle: "Edit Matier premier",
      id: dep.id,
      DepartmentName: dep.categoryName,
      matiereType: dep.matiereType
    });
  }

  isDuplicateCategoryName(categoryName) {
    return this.state.departments.some(dep =>
      dep.categoryName.trim().toLowerCase() === categoryName.trim().toLowerCase()
    );
  }

  validateFields() {
    if (!this.state.DepartmentName || !this.state.matiereType) {
      alert('Veuillez remplir tous les champs.');
      return false;
    }

    if (this.state.DepartmentName.length < 3 || this.state.matiereType.length < 3) {
      alert('Please enter at least 3 characters for Category Name and Type of Material');
      return false;
    }

    if (!this.isValidInput(this.state.DepartmentName) || !this.isValidInput(this.state.matiereType)) {
      alert('Please use only alphabetic characters (A-Z, a-z) in Category Name and Type of Material');
      return false;
    }

    return true;
  }

  isValidInput(input) {
    // Allow only alphabetic characters, spaces, and ensure first letter is uppercase
    return /^[A-Z][a-zA-Z\s]*$/.test(input);
  }

  createClick() {
    if (!this.validateFields()) {
      return;
    }

    if (this.isDuplicateCategoryName(this.state.DepartmentName)) {
      alert('MatierPremier with this Category Name already exists');
      return;
    }

    axios.post('https://192.168.1.249:5000/api/MatierPremier', {
      categoryName: this.capitalizeFirstLetter(this.state.DepartmentName),
      matiereType: this.capitalizeFirstLetter(this.state.matiereType)
    })
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          alert('MatierPremier created successfully');
          this.refreshList();
          this.clearFields();


        } else {
          alert('Failed to create Matier premier');
        }
      })
      .catch(error => {
        alert('Failed to create department');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.249:5000/api/MatierPremier/${this.state.id}`, {
      id: this.state.id,
      categoryName: this.capitalizeFirstLetter(this.state.DepartmentName),
      matiereType: this.capitalizeFirstLetter(this.state.matiereType)
    })
      .then(response => {
        if (response.status === 200) {
          alert('MatierPremier updated successfully');
        } else {
          alert('Failed to update MatierPremier');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Failed to update MatierPremier');
      });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      axios.delete(`https://192.168.1.249:5000/api/MatierPremier/${id}`)
        .then(response => {
          if (response.status === 200) {
            alert('MatierPremier deleted successfully');
          } else {
            alert('Failed to delete MatierPremier');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Failed to delete MatierPremier');
        });
    }
  }

  clearFields() {
    this.setState({
      DepartmentName: "",
      matiereType: ""
    });
  }
  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.departments.length;
    const currentItems = this.state.departments.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }


  render() {
    const {
      
      modalTitle,
      DepartmentName,
      matiereType,
      currentItems,
      pageCount
    } = this.state;

    return (
      <div>

        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-6"> Table Matier Premier</h1>
          </div>
        </div>

        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Add MatierPremier
        </button>
       
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className="d-flex flex-row">
                </div>
                Category Name
              </th>
              <th>
                <div className="d-flex flex-row">
                  <input className="form-control m-2"
                    onChange={this.changeDepartmentNameFilter}
                    placeholder="Filter" />

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('categoryName', true)}>
                    Sort ↑
                  </button>

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('categoryName', false)}>
                    Sort ↓
                  </button>
                </div>
                Type of Material
              </th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(dep =>
              <tr key={dep.id}>
                <td>{dep.categoryName}</td>
                <td>{dep.matiereType}</td>
                <td>
                  <button type="button"
                    className="btn btn-light mr-1"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => this.editClick(dep)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(dep.id)}>
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
                  <span className="input-group-text">MatierPremier Name</span>
                  <input type="text" className="form-control"
                    value={DepartmentName}
                    onChange={this.changeDepartmentName} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">MatierPremier Type</span>
                  <input type="text" className="form-control"
                    value={matiereType}
                    onChange={this.changeDepartmentType} />
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

export default MatierPremier;
