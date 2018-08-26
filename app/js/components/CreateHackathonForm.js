import React from 'react'
import { Alert, Form, FormGroup, FormControl, HelpBlock, Button } from 'react-bootstrap';

import EmbarkJS from 'Embark/EmbarkJS';
import web3Util from '../Web3Util';

export default class CreateHackathonForm extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      fileToUpload: null,
      fileHash: '',
      storageError: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailsHashChange = this.handleDetailsHashChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleDetailsHashChange(event) {
    this.setState({fileHash: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.createHackathon(this.state.value, this.state.fileHash);
    // refresh the parent after the tx has confirmed to list the new hackathon
    // alternatively, populate from the event
  }

  handleFileUpload(e) {
    this.setState({ fileToUpload: [e.target] });
  }

  async uploadFile(e) {
    e.preventDefault();
    try {
      const hash = await EmbarkJS.Storage.uploadFile(this.state.fileToUpload);
      this.setState({fileHash: hash, storageError: ''});
    } catch(err) {
      this.setState({storageError: err.message});
      console.log("Storage uploadFile Error => " + err.message);
    }
  }

  async createHackathon(name, detailsHash) {
    web3Util.createHackathon(name, detailsHash);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="form-group">
          <h3>Create New Hackathon</h3>
          {/* <label for="hackathon_name">Create New Hackathon</label> */}
          <input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter hackathon name"
              value={this.state.value} onChange={this.handleChange} />
        </div>

        <label>Upload questionnaire</label>
        {
          this.state.storageError !== '' ?
          <Alert bsStyle="danger">{this.state.storageError}</Alert>
          : ''
        }
        <Form inline>
          <FormGroup>
              <FormControl
                  type="file"
                  onChange={(e) => this.handleFileUpload(e)} />
              <Button bsStyle="primary" onClick={(e) => this.uploadFile(e)}>Upload</Button>
              {/* <HelpBlock>Questionnaire hash: <span className="fileHash">{this.state.fileHash}</span></HelpBlock> */}
          </FormGroup>
        </Form>
        <input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter hackathon questionnaire file hash"
               value={this.state.fileHash} onChange={this.handleDetailsHashChange} />

        <button type="submit" class="btn btn-success">Create</button>
      </form>
    )
  }
}