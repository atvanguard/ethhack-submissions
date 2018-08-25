import React from 'react'

import HackathonsList from './HackathonsList';
import CreateHackathonForm from './CreateHackathonForm';

import EmbarkJS from 'Embark/EmbarkJS';

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  // componentDidMount() { 
  //   EmbarkJS.onReady(async () => {
  //   })
  // }

  render() {
    return (
      <div>
        <CreateHackathonForm />
        <HackathonsList />
      </div>
    )
  }
}
