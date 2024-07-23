import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';



export class Concurrents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      concurrents: [],
      modalTitle: "",
      fullName: "",
      adress: "",
      contact: "",
      idConcurrent: 0,
      concurrentsWithoutFilter: [],
      isAdmin: true,
      itemsPerPage: 5,
      fullNameFilter: "",
      itemOffset: 0,
      pageCount: 0,
      currentItems: []

    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    axios.get('https://192.168.1.20:5000/api/Concurrents')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);

        this.setState({
          concurrents: response.data,
          concurrentsWithoutFilter: response.data,
          pageCount,
          currentItems
        });
      })
      .catch(error => {
        console.error('Failed to fetch Concurrents data:', error);
      });
  }


  filterFn() {
    const fullNameFilter = this.state.fullNameFilter.toLowerCase();
    const filteredData = this.state.concurrentsWithoutFilter.filter(
      el => el.fullName.toLowerCase().includes(fullNameFilter)
    );

    // Update pageCount and currentItems based on filtered data
    const pageCount = Math.ceil(filteredData.length / this.state.itemsPerPage);
    const newOffset = this.state.itemOffset >= filteredData.length ? 0 : this.state.itemOffset;
    const currentItems = filteredData.slice(newOffset, newOffset + this.state.itemsPerPage);

    this.setState({ concurrents: filteredData, pageCount, itemOffset: newOffset, currentItems });
  }

  sortResult(prop, asc) {
    const sortedData = this.state.concurrentsWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
    const currentItems = sortedData.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);
    this.setState({ concurrents: sortedData, currentItems });
  }

  changeconcurrentnameFilter = (e) => {
    this.setState({ fullNameFilter: e.target.value }, this.filterFn);
  }

  changeFullName = (e) => {
    const value = e.target.value.toUpperCase();
    // Check if the name already exists
    if (this.state.concurrents.some(c => c.fullName === value)) {
      alert('Ce nom de concurrent existe déjà.');
      return;
    }
    this.setState({ fullName: value });
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
      modalTitle: "Add Concurrent",
      idConcurrent: 0,
      fullName: "",
      adress: "",
      contact: ""
    });
  }

  editClick(concurrent) {
    this.setState({
      modalTitle: "Edit Concurrent",
      idConcurrent: concurrent.idConcurrent,
      fullName: concurrent.fullName,
      adress: concurrent.adress,
      contact: concurrent.contact
    });
  }

  validateFields() {
    const { fullName } = this.state;

    if (!fullName) {
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

    axios.post('https://192.168.1.20:5000/api/Concurrents', {
      fullName: this.state.fullName,
      adress: this.state.adress,
      contact: this.state.contact
    })
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          alert('Concurrent créé avec succès');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Échec de la création du concurrent');
        }
      })
      .catch(error => {
        alert('Échec de la création du concurrent');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.20:5000/api/Concurrents/${this.state.idConcurrent}`, {
      idConcurrent: this.state.idConcurrent,
      fullName: this.state.fullName,
      adress: this.state.adress,
      contact: this.state.contact
    })
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          alert('Concurrent mis à jour avec succès');
        } else {
          alert('Échec de la mise à jour du concurrent');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Échec de la mise à jour du concurrent');
      });
  }

  deleteClick(idConcurrent) {
    if (window.confirm('Êtes-vous sûr?')) {
      axios.delete(`https://192.168.1.20:5000/api/Concurrents/${idConcurrent}`)
        .then(response => {
          if (response.status === 200) {
            alert('Concurrent supprimé avec succès');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Échec de la suppression du concurrent');
        });
    }
  }

  clearFields() {
    this.setState({
      fullName: "",
      adress: "",
      contact: ""
    });
  }

  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.concurrents.length;
    const currentItems = this.state.concurrents.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }
  render() {
    const {

      modalTitle,
      fullName,
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
            <h1 class="display-6"> Table des Concurrents</h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Add Concurrent
        </button>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className='d-flex flex-row'>

                </div>
                Nom Complet
              </th>
              {isAdmin && <th>
                <div className="d-flex flex-row">
                  <input className="form-control m-2"
                    onChange={this.changeconcurrentnameFilter}
                    placeholder="Filter" />

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('fullName', true)}>
                    Sort ↑
                  </button>

                  <button type="button" className="btn btn-light"
                    onClick={() => this.sortResult('fullName', false)}>
                    Sort ↓
                  </button>
                </div>
                Adresse
              </th>}
              {isAdmin && <th>Contact</th>}
              {isAdmin && <th>Options</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(concurrent =>
              <tr key={concurrent.idConcurrent}>
                <td>{concurrent.fullName}</td>
                {isAdmin && <td>{concurrent.adress}</td>}
                {isAdmin && <td>{concurrent.contact}</td>}
                {isAdmin &&
                  <td>
                    <button type="button"
                      className="btn btn-light mr-1"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      onClick={() => this.editClick(concurrent)}>

                      <FontAwesomeIcon icon={faEdit} />

                    </button>

                    <button type="button"
                      className="btn btn-light mr-1"
                      onClick={() => this.deleteClick(concurrent.idConcurrent)}>
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
                  <span className="input-group-text">Nom Complet</span>
                  <input type="text" className="form-control"
                    value={fullName}
                    onChange={this.changeFullName} />
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
                  onClick={this.state.idConcurrent === 0 ? () => this.createClick() : () => this.updateClick()}>
                  {this.state.idConcurrent === 0 ? "create" : "Mettre à jour"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Concurrents;
