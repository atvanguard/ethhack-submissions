import React from 'react'
import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';
const Bluebird = require("bluebird");

class TeamRow extends React.Component {
  render() {
    // return <Link href={"/hackathons/" + this.props.id}>{this.props.name}</Link>
    return <li class="list-group-item">{this.props.name}</li>
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
        .then(name => teams.push({name}))
    })
    this.setState({teams});
  }

  render() {
    let rows = [];
    (this.state.teams || []).forEach((team,i) => {
      rows.push(<TeamRow name={team.name} key={i} />)
    });
    return (
      <ul class="list-group">{rows}</ul>
    )
  }
}
