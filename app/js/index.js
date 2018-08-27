import React from 'react'
import ReactDOM from 'react-dom'
const Router = require('react-router-component')
const Locations = Router.Locations
const Location = Router.Location

import HomePage from './components/HomePage';
import HackathonPage from './components/HackathonPage';
import SubmissionPage from './components/SubmissionPage';
import ViewSubmission from './components/ViewSubmission';

import EmbarkJS from 'Embark/EmbarkJS';

class Hacks extends React.Component {
  constructor() {
    super();
    // this.state = {}
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      console.log('Default account', web3.eth.defaultAccount);
    })
  }

  render() {
    return (
      <Locations>
        <Location path="/" handler={HomePage} />
        <Location path="/hackathons/:id" handler={HackathonPage} />
        <Location path="/hackathons/:id/submit" handler={SubmissionPage} />
        <Location path="/hackathons/:id/:teamId" handler={ViewSubmission} />
      </Locations>
    )
  }
}

ReactDOM.render(
  <Hacks />,
  document.getElementById('app')
)

