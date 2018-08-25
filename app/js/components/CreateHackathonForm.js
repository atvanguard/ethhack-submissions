import React from 'react'

import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';

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
    await this.createHackathon(this.state.value);
    // refresh the parent after the tx has confirmed to list the new hackathon
    // alternatively, populate from the event
  }

  async createHackathon(name) {
    const gas = await HackSubmissions.methods.createHackathon(name).estimateGas({
      from: web3.eth.defaultAccount
    });
    console.log('estimateGas', gas);
    const createHackathonTx = await HackSubmissions.methods.createHackathon(name).send({
      from: web3.eth.defaultAccount,
      gas: gas + 1000
    });
    console.log('createHackathonTx', createHackathonTx);
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