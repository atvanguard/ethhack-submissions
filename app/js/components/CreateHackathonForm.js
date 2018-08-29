import React from 'react'
import DateTimePicker from 'react-datetime-picker';
import { Alert, Form, FormGroup, FormControl, Button } from 'react-bootstrap';

import EmbarkJS from 'Embark/EmbarkJS';
import web3Util from '../Web3Util';

export default class CreateHackathonForm extends React.Component {
  constructor() {
    super();
    this.state = {
      hackathonName: '',
      prizes: '',
      fileHash: '',
      startsAt: '',
      endsAt: '',
      fileToUpload: null,
      backendError: '',
      startsAt: new Date(),
      endsAt: new Date(),
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, key) {
    this.setState({[key]: event.target.value});
  }

  handleCalChange(key, date) {
    console.log(key, date)
    this.setState({[key]: date})
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    try {
      const startsAt = Date.parse(this.state.startsAt) / 1000;
      const endsAt = Date.parse(this.state.endsAt) / 1000;
      await web3Util.createHackathon(this.state.hackathonName, this.state.fileHash, this.state.prizes, startsAt, endsAt);
    } catch (err) {
      this.setState({backendError: err.message || err});
    }
  }

  handleFileUpload(e) {
    this.setState({ fileToUpload: [e.target] });
  }

  async uploadFile(e) {
    e.preventDefault();
    try {
      const hash = await EmbarkJS.Storage.uploadFile(this.state.fileToUpload);
      this.setState({fileHash: hash, backendError: ''});
    } catch(err) {
      this.setState({backendError: err.message || err});
    }
  }

  render() {
    return (
      <div class="card">
      <div class="card-body">
        <h5 class="card-title">Create new hackathon</h5>
        {
          this.state.backendError !== '' &&
          <Alert bsStyle="danger">{this.state.backendError}</Alert>
        }
        <form onSubmit={this.handleSubmit}>

          <div class="form-group">
            <label for="hackathonName">Hackathon name</label>
            <input type="text" class="form-control" id="hackathonName"
              placeholder="Enter Hackathon name"
              value={this.state.hackathonName}
              onChange={(e) => this.handleChange(e, 'hackathonName')} />
          </div>

          <div class="form-group">
            <label for="prizes">Total prizes</label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="prizesHelp">Collective bag of prizes: ETH</span>
              </div>
              <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="prizesHelp"
                placeholder="3.5" id="prizes"
                value={this.state.prizes}
                onChange={(e) => this.handleChange(e, 'prizes')} />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label for="startsAt">Starts at</label>
              <div style={{"height": "35px"}}>
                <DateTimePicker
                  onChange={(date) => this.handleCalChange('startsAt', date)}
                  value={this.state.startsAt} />
              </div>
            </div>            
            <div class="form-group col">
              <label for="endsAt">Ends at</label>
              <div style={{"height": "35px"}}>
                <DateTimePicker
                  onChange={(date) => this.handleCalChange('endsAt', date)}
                  value={this.state.endsAt} />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Upload other Hackathon details</label>
            <Form inline>
              <FormGroup>
                <FormControl
                  type="file"
                  onChange={(e) => this.handleFileUpload(e)} />
                <Button bsStyle="primary" onClick={(e) => this.uploadFile(e)}>Upload to IPFS</Button>
              </FormGroup>
            </Form>
            <input type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="uploadHelp"
              disabled
              value={this.state.fileHash}
              onChange={(e) => this.handleChange(e, 'fileHash')} />
            <small id="uploadHelp" class="form-text text-muted">The IPFS hash of the hackathon details doc</small>
          </div>

          <button type="submit" class="btn btn-success">Create hackathon</button>
        </form>
      </div>
      </div>
    )
  }
}