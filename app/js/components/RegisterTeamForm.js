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
    this.registerTeam(this.props.hack_id, this.state.value);
  }

  async registerTeam(hackId, name) {
    await web3Util.registerTeam(hackId, name);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="form-group">
          <label>Register Team</label>
          <input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter team name"
                  value={this.state.value} onChange={this.handleChange} />
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
    )
  }
}