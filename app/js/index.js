import React from 'react'
import ReactDOM from 'react-dom'

import HackathonsList from './components/HackathonsList';

import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';

class Hacks extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      hacks: [{name: 'Dummy Hackathon 1'}, {name: 'Dummy Hackathon 2'}]
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      console.log(web3.eth.defaultAccount);
      await this.getHackathonList();
    })
  }

  async createHackathon(name) {
    const gas = await HackSubmissions.methods.createHackathon(name).estimateGas({
      from: web3.eth.defaultAccount
    });
    console.log('estimateGas', gas);
    const createHackathonTx = await HackSubmissions.methods.createHackathon(name).send({
      from: web3.eth.defaultAccount,
      gas: gas + 1000
    });
    console.log('createHackathonTx', createHackathonTx);
  }

  async getHackathonList() {
    const counter = await HackSubmissions.methods.hackathonCounter().call();
    console.log('hackathonCounter', counter);
    if (counter) {
      let hacks = [], getHacks = [];
      for(let i = 0; i < counter; i++) {
        getHacks.push(
          HackSubmissions.methods.getHackathon(i).call()
          .then(name => hacks.push({name}))
        )
      }
      await Promise.all(getHacks);
      console.log('hacks', hacks);
      this.setState({hacks})
    }
  }

  async handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    await this.createHackathon(this.state.value);
    // this would be pretty cool, but has no effect becauce the tx takes time to confirm
    // Workaround is refreshing the UI
    // await this.getHackathonList();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label for="hackathon_name">Create New Hackathon</label>
            <input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter hackathon name"
                   value={this.state.value} onChange={this.handleChange} />
          </div>
          <button type="submit" class="btn btn-primary">Create</button>
        </form>
        <HackathonsList hacks={this.state.hacks}/>
      </div>
    )
  }
}

ReactDOM.render(
  <Hacks />,
  document.getElementById('app')
)

