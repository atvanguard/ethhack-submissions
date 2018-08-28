import React from 'react'
import EmbarkJS from 'Embark/EmbarkJS';
import web3Util from '../Web3Util';
import ipfsUtil from '../ipfsUtil';
import { Alert } from 'react-bootstrap';
import HackSubmissions from 'Embark/contracts/HackSubmissions';

export default class SubmissionPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {backendError: ''}
    this.questions = {}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateContentHash = this.generateContentHash.bind(this);
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      this.checkTeamIsRegistered(this.props.id);
    })
  }

  async checkTeamIsRegistered() {
    try {
      const team = await web3Util.getTeam(this.props.id);
      if (team.content) {
        return this.setState({alreadySubmitted: true, teamName: team.name, backendError: ''});
      }
      this.setState({teamName: team.name, backendError: ''});
      this.getHackathonDetails(this.props.id);
    } catch(e) {
      // team not registered
      let msg = e.message || e;
      msg += '\nThe most probable cause is that you haven\'t registered a team with this metamask account.';
      this.setState({backendError: msg});
    }
  }

  async getHackathonDetails(id) {
    try {
      const hack = await HackSubmissions.methods.getHackathon(id).call();
      if (hack.details) {
        const content = await ipfsUtil.decodeIpfsHash(hack.details, true /* jsonParse */);
        const questionnaire = content.submission_questionnaire;
        console.log('content, questionnaire', content, questionnaire);
        this.setState({questionnaire, backendError: ''})
      }
    } catch(e) {
      this.setState({backendError: e.message || e});
    }
  }

  handleChange(event, id) {
    this.setState({[id]: event.target.value});
  }

  canonicalizeQuestion(q) {
    return q.toLowerCase().replace(/ /g, '_');
  }

  buildSubmissionString() {
    let sub = {};
    Object.keys(this.state.questionnaire || {}).forEach(q => {
      const id = this.canonicalizeQuestion(q);
      // console.log(q, id);
      sub[q] = this.state[id];
    });
    return JSON.stringify(sub);
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log('in handleSubmit', this.state.uploadHash);
    try {
      web3Util.createSubmission(this.props.id, this.state.uploadHash);
    } catch (e) {
      this.setState({backendError: e.message || e});
    }
  }

  async generateContentHash(event) {
    event.preventDefault();
    const submissionString = this.buildSubmissionString();
    // console.log('submissionString', submissionString);
    const hash = await EmbarkJS.Storage.saveText(submissionString);
    // console.log('hash', hash);
    this.setState({uploadHash: hash})
  }

  render() {
    if (this.state.backendError !== '') {
      return <Alert bsStyle="danger">{this.state.backendError}</Alert>
    } else if (this.state.alreadySubmitted) {
      return (
        <div class="alert alert-success" role="alert">
          Submission has already been made for team: {this.state.teamName}
        </div>
      )
    }

    const rows = [];
    Object.keys(this.state.questionnaire || {}).forEach((q,i) => {
      const id = this.canonicalizeQuestion(q);
      rows.push(
        <div class="form-group" key={id}>
          <label>{q}</label>
          <textarea class="form-control" onChange={(e) => this.handleChange(e, id)}>{this.state[id]}</textarea>
          {/* <textarea class="form-control" id={i} rows="3"}></textarea> */}
        </div>
      );
    });

    return (
      <div class="card">
      <div class="card-body">
        <h5 class="card-title">{this.state.teamName}</h5>
        <form onSubmit={this.handleSubmit}>
          {rows}
          <button class="btn btn-primary" onClick={this.generateContentHash}>Generate upload hash</button>
          {this.state.uploadHash &&
            <div>
              <input type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="uploadHelp"
                disabled
                value={this.state.uploadHash} />
              <small id="uploadHelp" class="form-text text-muted">The IPFS hash of the submission</small>
              <button type="submit" class="btn btn-success">Submit</button>
            </div>
          }
        </form>
      </div>
      </div>
    )
  }
}
