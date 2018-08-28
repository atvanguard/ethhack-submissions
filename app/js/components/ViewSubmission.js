import React from 'react'
import EmbarkJS from 'Embark/EmbarkJS';
import web3Util from '../Web3Util';
import { Alert } from 'react-bootstrap';

export default class ViewSubmission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {backendError: ''}
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      this.getTeam();
    })
  }

  async getTeam() {
    console.log('in getTeam')
    try {
      let {name, content} = await web3Util.getTeam(this.props.id, this.props.teamId);
      // console.log('name, content', name, content)
      content = await EmbarkJS.Storage.get(web3.utils.hexToAscii(content));
      this.setState({content, name, backendError: ''});
    } catch (e) {
      this.setState({backendError: e.message || e});
    }
  }

  render() {
    const rows = [];
    const content = JSON.parse(this.state.content || '{}');
    Object.keys(content).forEach((q,i) => {
      rows.push(
        <div class="card-text" key={i}>
          <h5>{q}</h5>
          <p>{content[q]}</p>
        </div>
      );
    });

    return (
      <div class="card">
        {
          this.state.backendError !== '' &&
          <Alert bsStyle="danger">{this.state.backendError}</Alert>
        }
        <h4 class="card-title">{this.state.name}</h4>
        <div class="card-body">
          {rows}
          <button type="button" class="btn btn-info">Upvote</button>
        </div>
      </div>
    )
  }
}
