import React from 'react'
const Bluebird = require("bluebird");

import EmbarkJS from 'Embark/EmbarkJS';
const Link = require('react-router-component').Link

import HackSubmissions from 'Embark/contracts/HackSubmissions';

class TeamRow extends React.Component {
  render() {
    console.log('TeamRow props', this.props)
    const href = `/hackathons/${this.props.hack_id}/${this.props.team_id}`
    return (
      <div class="list-group-item list-group-item-action">
        <label>{this.props.name}</label>
        {this.props.content &&
          <Link href={href} style={{color: 'green', float: 'right'}}>View Submission</Link>
        }
      </div>
    )
  }
}

export default class TeamsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hacks: [{name: 'Team 1'}, {name: 'Team 2'}]
    }
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      console.log('in TeamsList');
      this.getTeamsList();
    })
  }

  async getTeamsList() {
    let _teams = await HackSubmissions.methods.getTeams(this.props.hack_id).call();
    console.log('teams', _teams);
    _teams = _teams || [];
    const teams = [];
    await Bluebird.map(_teams, id => {
      return HackSubmissions.methods.getTeam(this.props.hack_id, id).call()
        .then(res => {
          // console.log(res);
          const t = {name: res.name, team_id: id};
          if (res.content) t.content = web3.utils.hexToAscii(res.content);
          console.log('t', t)
          teams.push(t);
        });
    })
    this.setState({teams});
  }

  render() {
    let rows = [];
    (this.state.teams || []).forEach((team,i) => {
      rows.push(<TeamRow {...team} hack_id={this.props.hack_id} key={i} />)
    });
    return (
      <div class="list-group">{rows}</div>
    )
  }
}
