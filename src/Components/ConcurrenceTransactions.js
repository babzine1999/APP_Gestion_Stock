import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';




export class ConcurrenceTransactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      modalTitle: "",
      date: "",
      idSubCategory: 0,
      idConcurrent: 0,
      quantiteDonee: 0,
      quantiteRecuEquivalent: 0,
      quantitePrise: 0,
      montantPaye: 0,
      montantRecu: 0,
      type: "",
      unit: "kg",
      id: 0,
      concurrents: [],
      subcategories: [],
      TransactionWithoutFilter: [],
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
    this.loadConcurrents();
    this.loadSubCategories();
  }

  refreshList() {
    axios.get('https://192.168.1.249:5000/api/ConcurrenceTransactions')
      .then(response => {
        const pageCount = Math.ceil(response.data.length / this.state.itemsPerPage);
        const currentItems = response.data.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage);

        this.setState({ 
          transactions: response.data,
          TransactionWithoutFilter:response.data,
          pageCount,
          currentItems

         });
      })
      .catch(error => {
        console.error('Failed to fetch ConcurrenceTransactions data:', error);
      });
  }

  loadConcurrents() {
    axios.get('https://192.168.1.249:5000/api/Concurrents')
      .then(response => {
        this.setState({ concurrents: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch Concurrents data:', error);
      });
  }

  loadSubCategories() {
    axios.get('https://192.168.1.249:5000/api/SubCategoryMatierPremier')
      .then(response => {
        this.setState({ subcategories: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch SubCategoryMatierPremier data:', error);
      });
  }

  changeDate = (e) => {
    this.setState({ date: e.target.value });
  }

  changeIdSubCategory = (e) => {
    this.setState({ idSubCategory: parseInt(e.target.value, 10) });
  }

  changeIdConcurrent = (e) => {
    this.setState({ idConcurrent: parseInt(e.target.value, 10) });
  }

  changeQuantiteDonee = (e) => {
    this.setState({ quantiteDonee: parseInt(e.target.value, 10) });
  }

  changeQuantiteRecuEquivalent = (e) => {
    this.setState({ quantiteRecuEquivalent: parseInt(e.target.value, 10) });
  }

  changeQuantitePrise = (e) => {
    this.setState({ quantitePrise: parseInt(e.target.value, 10) });
  }

  changeMontantPaye = (e) => {
    this.setState({ montantPaye: parseFloat(e.target.value) });
  }

  changeMontantRecu = (e) => {
    this.setState({ montantRecu: parseFloat(e.target.value) });
  }

  changeType = (e) => {
    this.setState({ type: e.target.value });
  }

  changeUnit = (e) => {
    this.setState({ unit: e.target.value });
  }

  addClick() {
    this.setState({
      modalTitle: "Add Transaction",
      id: 0,
      date: "",
      idSubCategory: 0,
      idConcurrent: 0,
      quantiteDonee: 0,
      quantiteRecuEquivalent: 0,
      quantitePrise: 0,
      montantPaye: 0,
      montantRecu: 0,
      type: "",
      unit: "kg"
    });
  }

  editClick(transaction) {
    this.setState({
      modalTitle: "Edit Transaction",
      id: transaction.idTransaction,
      date: transaction.date,
      idSubCategory: transaction.idSubCategory,
      idConcurrent: transaction.idConcurrent,
      quantiteDonee: transaction.quantiteDonee,
      quantiteRecuEquivalent: transaction.quantiteRecuEquivalent,
      quantitePrise: transaction.quantitePrise,
      montantPaye: transaction.montantPaye,
      montantRecu: transaction.montantRecu,
      type: transaction.type,
      unit: transaction.unit
    });
  }

  validateFields() {
    const { date, idSubCategory, idConcurrent,type, unit } = this.state;

    if (!date || !idSubCategory || !idConcurrent ||!type || !unit) {
      alert('Please fill out all fields');
      return false;
    }

    return true;
  }

  createClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.post('https://192.168.1.249:5000/api/ConcurrenceTransactions', {
      date: this.state.date,
      idSubCategory: this.state.idSubCategory,
      idConcurrent: this.state.idConcurrent,
      quantiteDonee: this.state.quantiteDonee,
      quantiteRecuEquivalent: this.state.quantiteRecuEquivalent,
      quantitePrise: this.state.quantitePrise,
      montantPaye: this.state.montantPaye,
      montantRecu: this.state.montantRecu,
      type: this.state.type,
      unit: this.state.unit
    })
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          alert('Transaction created successfully');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Failed to create Transaction');
        }
      })
      .catch(error => {
        alert('Failed to create Transaction');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.249:5000/api/ConcurrenceTransactions/${this.state.id}`, {
      idTransaction: this.state.id,
      date: this.state.date,
      idSubCategory: this.state.idSubCategory,
      idConcurrent: this.state.idConcurrent,
      quantiteDonee: this.state.quantiteDonee,
      quantiteRecuEquivalent: this.state.quantiteRecuEquivalent,
      quantitePrise: this.state.quantitePrise,
      montantPaye: this.state.montantPaye,
      montantRecu: this.state.montantRecu,
      type: this.state.type,
      unit: this.state.unit
    })
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          alert('Transaction updated successfully');
        } else {
          alert('Failed to update Transaction');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Failed to update Transaction');
      });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      axios.delete(`https://192.168.1.249:5000/api/ConcurrenceTransactions/${id}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            alert('Transaction deleted successfully');
          } else {
            alert('Failed to delete Transaction');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Failed to delete Transaction');
        });
    }
  }

  clearFields() {
    this.setState({
      date: "",
      idSubCategory: 0,
      idConcurrent: 0,
      quantiteDonee: 0,
      quantiteRecuEquivalent: 0,
      quantitePrise: 0,
      montantPaye: 0,
      montantRecu: 0,
      type: "",
      unit: "kg"
    });
  }

  convertirDate = (date) => {
    return new Date(date).toLocaleDateString(); // Cette méthode utilise le format local par défaut
  }
  handlePageClick = (event) => {
    const newOffset = (event.selected * this.state.itemsPerPage) % this.state.transactions.length;
    const currentItems = this.state.transactions.slice(newOffset, newOffset + this.state.itemsPerPage);
    this.setState({ itemOffset: newOffset, currentItems });
  }
  render() {
    const {
      transactions,
      modalTitle,
      date,
      idSubCategory,
      idConcurrent,
      quantiteDonee,
      quantiteRecuEquivalent,
      quantitePrise,
      montantPaye,
      montantRecu,
      type,
      unit,
      concurrents,
      subcategories,
      currentItems,
      pageCount
    } = this.state;

    const isAdmin = localStorage.getItem('role') === 'Admin';


    return (
      <div>

        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-12"> Table des Transaction avec les concurrents </h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Add Transaction
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subcategory</th>
              <th>Concurrent</th>
              <th>Quantite Donee</th>
              <th>Quantite Recu Equivalent</th>
              <th>Quantite Prise</th>
              <th>Montant Paye</th>
              <th>Montant Recu</th>
              <th>Type</th>
              <th>Unit</th>
              {isAdmin && <th>Options</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(transaction =>
              <tr key={transaction.idTransaction}>
                <td>{this.convertirDate(transaction.date)}</td>
                <td>{subcategories.find(sc => sc.idSubcategory === transaction.idSubCategory)?.subcategoryName}</td>
                <td>{concurrents.find(con => con.idConcurrent === transaction.idConcurrent)?.fullName}</td>
                <td>{transaction.quantiteDonee}</td>
                <td>{transaction.quantiteRecuEquivalent}</td>
                <td>{transaction.quantitePrise}</td>
                <td>{transaction.montantPaye}</td>
                <td>{transaction.montantRecu}</td>
                <td>{transaction.type}</td>
                <td>{transaction.unit}</td>
                {isAdmin &&
                  <td className="d-flex align-items-center">
                    <button type="button"
                      className="btn btn-light mr-1"
                      data-toggle="modal"
                      data-target="#exampleModal"
                      onClick={() => this.editClick(transaction)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> 
                    </button>

                    <button className="btn btn-light mr-1"
                      onClick={() => this.deleteClick(transaction.idTransaction)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> 
                      
                    </button>
                  </td>
              }
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Date</span>
                  <input type="date" className="form-control" value={date} onChange={this.changeDate} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Subcategory</span>
                  <select className="form-select" value={idSubCategory} onChange={this.changeIdSubCategory}>
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sc =>
                      <option key={sc.idSubcategory} value={sc.idSubcategory}>{sc.subcategoryName}</option>
                    )}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Concurrent</span>
                  <select className="form-select" value={idConcurrent} onChange={this.changeIdConcurrent}>
                    <option value="">Select Concurrent</option>
                    {concurrents.map(con =>
                      <option key={con.idConcurrent} value={con.idConcurrent}>{con.fullName}</option>
                    )}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Quantite Donee</span>
                  <input type="number" className="form-control" value={quantiteDonee} onChange={this.changeQuantiteDonee} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Quantite Recu Equivalent</span>
                  <input type="number" className="form-control" value={quantiteRecuEquivalent} onChange={this.changeQuantiteRecuEquivalent} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Quantite Prise</span>
                  <input type="number" className="form-control" value={quantitePrise} onChange={this.changeQuantitePrise} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Montant Paye</span>
                  <input type="number" step="0.01" className="form-control" value={montantPaye} onChange={this.changeMontantPaye} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Montant Recu</span>
                  <input type="number" step="0.01" className="form-control" value={montantRecu} onChange={this.changeMontantRecu} />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Type</span>
                  <select className="form-control" value={type} onChange={this.changeType}>
                    <option >choisir le type</option>
                    <option value="entre">ENTRE</option>
                    <option value="sortie">SORTIE</option>
                  </select>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Unit</span>
                  <input type="text" className="form-control" value={unit} readOnly onChange={this.changeUnit} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.clearFields()}>close</button>
                <button type="button" className="btn btn-primary" onClick={() => this.createClick()}>{modalTitle === "Add Transaction" ? "Create" : "Update"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConcurrenceTransactions;
