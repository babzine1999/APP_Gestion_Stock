import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';




export class ProductionsNT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productions: [],
      modalTitle: "",
      dateProduction: "",
      idSociete: 0,
      color: "",
      poitTotal: 0.0,
      grammage: 0.0,
      idProduction: 0,
      dateProductionFilter: "",
      productionsWithoutFilter: [],
      societes: [],
      isAdmin: true, 
    };
  }

  componentDidMount() {
    this.refreshList();
    this.loadSocietes();
  }

  refreshList() {
    axios.get('https://192.168.1.20:5000/api/ProductionNT') 
      .then(response => {
        this.setState({ productions: response.data, productionsWithoutFilter: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch ProductionsNT data:', error);
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

  filterFn() {
    const dateProductionFilter = this.state.dateProductionFilter.toLowerCase();

    const filteredData = this.state.productionsWithoutFilter.filter(
      el => el.dateProduction.toLowerCase().includes(dateProductionFilter)
    );

    this.setState({ productions: filteredData });
  }

  sortResult(prop, asc) {
    const sortedData = this.state.productionsWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });

    this.setState({ productions: sortedData });
  }

  changeDateProductionFilter = (e) => {
    this.setState({ dateProductionFilter: e.target.value }, this.filterFn);
  }

  changeDateProduction = (e) => {
    this.setState({ dateProduction: e.target.value });
  }

  changeIDSociete = (e) => {
    this.setState({ idSociete: parseInt(e.target.value, 10) });
  }

  changeColor = (e) => {
    this.setState({ color: e.target.value });
  }

  changePoitTotal = (e) => {
    this.setState({ poitTotal: parseFloat(e.target.value) });
  }

  changeGrammage = (e) => {
    this.setState({ grammage: parseFloat(e.target.value) });
  }

  addClick() {
    this.setState({
      modalTitle: "Add Production",
      idProduction: 0,
      dateProduction: "",
      idSociete: 0,
      color: "",
      poitTotal: 0.0,
      grammage: 0.0
    });
  }

  editClick(production) {
    this.setState({
      modalTitle: "Edit Production",
      idProduction: production.idProduction,
      dateProduction: production.dateProduction,
      idSociete: production.idSociete,
      color: production.color,
      poitTotal: production.poitTotal,
      grammage: production.grammage
    });
  }

  validateFields() {
    const { dateProduction, idSociete, color, poitTotal, grammage } = this.state;

    if (!dateProduction || !idSociete || !color || !poitTotal || !grammage) {
      alert('Please fill out all fields');
      return false;
    }

    return true;
  }

  createClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.post('https://192.168.1.20:5000/api/ProductionNT', {
      dateProduction: this.state.dateProduction,
      idSociete: this.state.idSociete,
      color: this.state.color,
      poitTotal: this.state.poitTotal,
      grammage: this.state.grammage
    })
      .then(response => {
        if (response.status === 201 || response.status === 200 || response.status === 204) {
          alert('Production created successfully');
          this.refreshList();
          this.clearFields();
        } else {
          alert('Failed to create Production');
        }
      })
      .catch(error => {
        alert('Failed to create Production');
      });
  }

  updateClick() {
    if (!this.validateFields()) {
      return;
    }

    axios.put(`https://192.168.1.20:5000/api/ProductionNT/${this.state.idProduction}`, {
      idProduction: this.state.idProduction,
      dateProduction: this.state.dateProduction,
      idSociete: this.state.idSociete,
      color: this.state.color,
      poitTotal: this.state.poitTotal,
      grammage: this.state.grammage
    })
      .then(response => {
        if (response.status === 200|| response.status === 204) {
          alert('Production updated successfully');
        } else {
          alert('Failed to update Production');
        }
        this.refreshList();
      })
      .catch(error => {
        alert('Failed to update Production');
      });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      axios.delete(`https://192.168.1.20:5000/api/ProductionNT/${id}`)
        .then(response => {
          if (response.status === 200 || response.status === 204) {
            alert('Production deleted successfully');
          } else {
            alert('Failed to delete Production');
          }
          this.refreshList();
        })
        .catch(error => {
          alert('Failed to delete Production');
        });
    }
  }

  clearFields() {
    this.setState({
      dateProduction: "",
      idSociete: 0,
      color: "",
      poitTotal: 0.0,
      grammage: 0.0
    });
  }
  convertirDate = (achatDate) => {
    return new Date(achatDate).toLocaleDateString(); // Cette méthode utilise le format local par défaut
  }
  render() {
    const {
      productions,
      modalTitle,
      dateProduction,
      idSociete,
      color,
      poitTotal,
      grammage
      ,
      societes
    } = this.state;

    const isAdmin = localStorage.getItem('role') === 'Admin';


    return (
      <div>
         <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-6"> Table pour la ProductionNT </h1>
          </div>
        </div>
        <button type="button"
          className="btn btn-primary m-2 float-end"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => this.addClick()}>
          Add Production
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date Production</th>
              <th>Societe</th>
              <th>Color</th>
              <th>Poit Total</th>
              <th>Grammage</th>
              {isAdmin && <th>Options</th>}
            </tr>
          </thead>
          <tbody>
            {productions.map(production =>
              <tr key={production.idProduction}>
                <td>{this.convertirDate(production.dateProduction)}</td>
                <td>{production.idSociete}</td>
                <td>{production.color}</td>
                <td>{production.poitTotal}</td>
                <td>{production.grammage}</td>
                {isAdmin &&
                <td>
                  <button type="button"
                    className="btn btn-light mr-1"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() => this.editClick(production)}>
                    
                    <FontAwesomeIcon icon={faEdit} /> 
                     
                  </button>

                  <button type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.deleteClick(production.idProduction)}>
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

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5>
                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Date Production</span>
                  <input type="date" className="form-control"
                    value={dateProduction}
                    onChange={this.changeDateProduction} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Societe</span>
                  <select className="form-select"
                    value={idSociete}
                    onChange={this.changeIDSociete}>
                    <option value={0}>Select Societe</option>
                    {societes.map(societe =>
                      <option key={societe.idSociete} value={societe.idSociete}>{societe.societeName}</option>
                    )}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Color</span>
                  <input type="text" className="form-control"
                    value={color}
                    onChange={e => this.setState({ color: e.target.value })} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Poit Total</span>
                  <input type="number" className="form-control"
                    value={poitTotal}
                    onChange={e => this.setState({ poitTotal: parseFloat(e.target.value) })} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Grammage</span>
                  <input type="number" className="form-control"
                    value={grammage}
                    onChange={e => this.setState({ grammage: parseFloat(e.target.value) })} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary"
                  onClick={this.state.idProduction === 0 ? () => this.createClick() : () => this.updateClick()}>
                  {this.state.idProduction === 0 ? "Create" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductionsNT;
