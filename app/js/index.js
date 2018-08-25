import React from 'react'
import ReactDOM from 'react-dom'
const Router = require('react-router-component')
const Locations = Router.Locations
const Location = Router.Location

import HomePage from './components/HomePage';
import HackathonDetails from './components/HackathonDetails';

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
        <Location path="/hackathons/:id" handler={HackathonDetails} />
      </Locations>
    )
  }
}

ReactDOM.render(
  <Hacks />,
  document.getElementById('app')
)

