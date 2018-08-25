import React from 'react'

import EmbarkJS from 'Embark/EmbarkJS';
import web3Util from '../Web3Util';

export default class CreateHackathonForm extends React.Component {
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
    this.createHackathon(this.state.value);
    // refresh the parent after the tx has confirmed to list the new hackathon
    // alternatively, populate from the event
  }

  async createHackathon(name) {
    web3Util.createHackathon(name);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="form-group">
          <label for="hackathon_name">Create New Hackathon</label>
          <input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter hackathon name"
                  value={this.state.value} onChange={this.handleChange} />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    )
  }
}