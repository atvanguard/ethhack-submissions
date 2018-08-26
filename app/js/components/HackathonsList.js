import React from 'react'
import EmbarkJS from 'Embark/EmbarkJS';
const Link = require('react-router-component').Link
import HackSubmissions from 'Embark/contracts/HackSubmissions';

class HackathonRow extends React.Component {
  render() {
    return (
      <div class="list-group-item list-group-item-action">
        <Link href={"/hackathons/" + this.props.id}>{this.props.name}</Link>
      </div>
    )
  }
}

export default class HackathonsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hacks: [{name: 'Dummy Hackathon 1'}, {name: 'Dummy Hackathon 2'}]
    }
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      this.getHackathonList();
    })
  }

  async getHackathonList() {
    const counter = await HackSubmissions.methods.hackathonCounter().call();
    console.log('hackathonCounter', counter);
    if (counter) {
      let hacks = [], getHacks = [];
      for(let i = 0; i < counter; i++) {
        getHacks.push(
          HackSubmissions.methods.getHackathon(i).call()
          .then(hack => hacks.push({name: hack.name, id: i}))
        )
      }
      await Promise.all(getHacks);
      console.log('hacks', hacks);
      this.setState({hacks})
    }
  }

  render() {
    let rows = [];
    (this.state.hacks || []).forEach((hack,i) => {
      rows.push(<HackathonRow name={hack.name} id={hack.id} key={i} />)
    });
    return (
      <div class="list-group">{rows}</div>
    )
  }
}
