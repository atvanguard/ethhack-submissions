import React from 'react'

import web3Util from '../Web3Util';

export default class RegisterTeamForm extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    web3Util.registerTeam(this.props.hack_id, this.state.value);
  }

  render() {
    return (
      // style={{"margin-bottom": "50px"}}
      <div class="card">
      <div class="card-body">
        <h5 class="card-title">Register new team</h5>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Enter team name"
              value={this.state.value} onChange={this.handleChange} />
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </div>
      </div>
    )
  }
}