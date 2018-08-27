import React from 'react'
import { Alert } from 'react-bootstrap';
const Link = require('react-router-component').Link

import EmbarkJS from 'Embark/EmbarkJS';
import HackSubmissions from 'Embark/contracts/HackSubmissions';
import ipfsUtil from '../IpfsUtil';

export default class HackathonDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backendError: ''
    }
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      this.getHackathonDetails(this.props.id);
    })
  }

  async getHackathonDetails(id) {
    let hack;
    try {
      hack = await HackSubmissions.methods.getHackathon(id).call();
      if (hack.details) {
        hack.content = await ipfsUtil.decodeIpfsHash(hack.details, true /* jsonParse */);
        hack.description = hack.content.description || '';
      }
    } catch(e) {
      return this.setState({backendError: e.message || e});
    }

    let {name, prizes, startsAt, endsAt, description, numTeams} = hack;
    prizes = web3.utils.fromWei(prizes);
    this.setState({name, description, startsAt, endsAt, prizes, numTeams, backendError: ''});
  }

  onSubmitProjectCLick(e) {
    this.setState({showSubmissiongPage: true});
  }

  render() {
    return (
      <div class="card" style={{"margin-bottom": "50px"}}>
      <div class="card-body">
        <h5 class="card-title">{this.state.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{this.state.description}</h6>
        {
          this.state.backendError !== '' &&
          <Alert bsStyle="danger">{this.state.backendError}</Alert>
        }
        <form>
          <div class="form-group row">
            <label for="startsAt" class="col-sm-2 col-form-label">Starts at:</label>
            <div class="col-sm-10">
              <input type="text" readonly class="form-control-plaintext" id="startsAt" value={this.state.startsAt} />
            </div>
          </div>

          <div class="form-group row">
            <label for="endsAt" class="col-sm-2 col-form-label">Ends at:</label>
            <div class="col-sm-10">
              <input type="text" readonly class="form-control-plaintext" id="endsAt" value={this.state.endsAt} />
            </div>
          </div>

          <div class="form-group row">
            <label for="prizes" class="col-sm-2 col-form-label">Prizes:</label>
            <div class="col-sm-10">
              <input type="text" readonly class="form-control-plaintext" id="prizes" value={this.state.prizes + ' ETH'} />
            </div>
          </div>

          <div class="form-group row">
            <label for="numTeams" class="col-sm-2 col-form-label"># Teams:</label>
            <div class="col-sm-10">
              <input type="text" readonly class="form-control-plaintext" id="numTeams" value={this.state.numTeams} />
            </div>
          </div>

          <Link href={"/hackathons/" + this.props.id + "/submit"}>
            <button class="btn btn-success">Submit project</button>
          </Link>
        </form>
      </div>
      </div>
    )
  }
}
