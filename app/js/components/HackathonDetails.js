import React from 'react'

var Router = require('react-router-component')
var Locations = Router.Locations
var Location = Router.Location

import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';
import RegisterTeamForm from './RegisterTeamForm';
import TeamsList from './TeamsList';
import SubmissionPage from './SubmissionPage';

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
    let hack;
    try {
      hack = await HackSubmissions.methods.getHackathon(id).call();
      console.log(hack);
    } catch(e) {
      console.log('HackSubmissions.methods.getHackathon(id).call()', e)
    }

    if (hack.details) {
      try {
        hack.content = await EmbarkJS.Storage.get(hack.details);
        const content = JSON.parse(hack.content);
        hack.description = content.description;
        hack.questionnaire = content.submission_questionnaire;
        console.log('hack.content', hack.content);
      } catch(e) {
        console.log('error in loading from IPFS', e)
      }
    }
    if(hack) this.setState(hack);
  }

  onSubmitProjectCLick(e) {
    this.setState({showSubmissiongPage: true});
  }

  render() {
    if (this.state.showSubmissiongPage) {
      return <SubmissionPage hackId={this.props.id} questionnaire={this.state.questionnaire} />
    }
    return (
      <div>
        <h1>{this.state.name}</h1>
        <h3>{this.state.description}</h3>

        {/* <p>{this.state.content}</p> */}

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
        <button type="submit" class="btn btn-success" onClick={(e) => this.onSubmitProjectCLick(e)}>Submit your project</button>
      </div>
    )
  }
}
