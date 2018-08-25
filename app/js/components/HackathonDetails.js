import React from 'react'
import ReactDOM from 'react-dom'
var Router = require('react-router-component')
var Locations = Router.Locations
var Location = Router.Location

import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';

export default class HackathonDetails extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      console.log('in HackathonDetails');
      this.getHackathonDetails(this.props.id);
    })
  }

  async getHackathonDetails(id) {
    const hack = await HackSubmissions.methods.getHackathon(id).call();
    console.log(hack);
    this.setState(hack);
  }

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>

        <button type="button" class="btn btn-primary">
        isOver <span class="badge badge-light">{this.state.isOver == true ? 'Yes' : 'No'}</span>
          {/* <span class="sr-only">unread messages</span> */}
        </button>

        <button type="button" class="btn btn-primary">
        prizes bag <span class="badge badge-light">{this.state.prizes}</span>
          {/* <span class="sr-only">unread messages</span> */}
        </button>

        {/* <span class="badge badge-success">{this.state.prizes}</span> */}
        <button type="button" class="btn btn-primary">
          Teams <span class="badge badge-light">{this.state.numTeams}</span>
          {/* <span class="sr-only">unread messages</span> */}
        </button>
      </div>
    )
  }
}
