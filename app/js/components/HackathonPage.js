import React from 'react'
import HackathonDetails from './HackathonDetails';
import RegisterTeamForm from './RegisterTeamForm';
import TeamsList from './TeamsList';

export default class HackathonPage extends React.Component {
  render() {
    return (
      <div>
        <HackathonDetails id={this.props.id} />
        <RegisterTeamForm hack_id={this.props.id} />
        <TeamsList hack_id={this.props.id} />
      </div>
    )
  }
}
