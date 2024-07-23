import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


export class Societe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      societes: [],
      societeNameFilter: "",
      societesWithoutFilter: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    axios.get('https://192.168.1.249:5000/api/Societe')
      .then(response => {
        this.setState({ societes: response.data, societesWithoutFilter: response.data });
      })
      .catch(error => {
        console.error('Failed to fetch Societe data:', error);
      });
  }

  filterFn() {
    const societeNameFilter = this.state.societeNameFilter.toLowerCase();

    const filteredData = this.state.societesWithoutFilter.filter(
      el => el.societeName.toLowerCase().includes(societeNameFilter)
    );

    this.setState({ societes: filteredData });
  }

  sortResult(prop, asc) {
    const sortedData = this.state.societesWithoutFilter.sort((a, b) => {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });

    this.setState({ societes: sortedData });
  }

  changeSocieteNameFilter = (e) => {
    this.setState({ societeNameFilter: e.target.value }, this.filterFn);
  }

  render() {
    const {
      societes,
      societeNameFilter
    } = this.state;

    return (
      <div>
              <div className="jumbotron">
          <h1 className="display-4">Table Societe</h1>
          <p className="lead">La société RotoPrint est spécialisée dans la production de sacs de transport pour nourriture.</p>
          <hr className="my-1" />
          <p className="lead"> BakriFile est une société spécialisée dans la production de tous types de fils.</p>
          <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
        </div>


        

        <table className="table table-striped table-sm text-nowrap">
          <thead>
            <tr>
              <th>Societe Name</th>
            </tr>
          </thead>
          <tbody>
            {societes.map(societe =>
              <tr key={societe.idSociete}>
                <td>{societe.societeName}</td>
              </tr>
            )}
          </tbody>
        </table>
        <NavLink className="nav-link" to="/dashboard'">
          <button type='button' className="btn btn-outline-secondary">Back to Dashboard</button>
        </NavLink>
      </div>
    );
  }
}

export default Societe;
