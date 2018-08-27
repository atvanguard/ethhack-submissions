import React from 'react'

import HackathonsList from './HackathonsList';
import CreateHackathonForm from './CreateHackathonForm';

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    return (
      <div>
        <HackathonsList />
        <CreateHackathonForm />
      </div>
    )
  }
}
