import React from 'react'
import ReactDOM from 'react-dom'
var Router = require('react-router-component')
var Locations = Router.Locations
var Location = Router.Location

import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';
import RegisterTeamForm from './RegisterTeamForm';
import TeamsList from './TeamsList';

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
        startsAt <span class="badge badge-light">{this.state.startsAt}</span>
          {/* <span class="sr-only">unread messages</span> */}
        </button>

        <button type="button" class="btn btn-primary">
        duration <span class="badge badge-light">{this.state.duration}</span>
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

        <RegisterTeamForm hack_id={this.props.id} />
        <TeamsList hack_id={this.props.id} />
      </div>
    )
  }
}
