import React from 'react'
import EmbarkJS from 'Embark/EmbarkJS';
import web3Util from '../Web3Util';
import { Alert } from 'react-bootstrap';
const Bluebird = require("bluebird");

export default class ViewSubmission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {backendError: '', comment: ''}
  }

  componentDidMount() { 
    EmbarkJS.onReady(async () => {
      this.getTeam();
    })
  }

  commentText(e) {
    e.preventDefault();
    this.setState({comment: e.target.value});
  }

  async onComment(e) {
    e.preventDefault();
    console.log('in onComment', this.state)
    try {
      const hash = await EmbarkJS.Storage.saveText(this.state.comment);
      await web3Util.comment(this.props.id, this.props.teamId, hash);
    } catch (e) {
      const msg = '\nProbable cause is - only registered teams are allowed to comment';
      this.setState({backendError: (e.message || e) + msg});
    }
  }

  async getTeam() {
    try {
      let {name, content, numVotes, numComments} = await web3Util.getTeam(this.props.id, this.props.teamId);
      this.getComments(numComments); // fire and forget
      content = await EmbarkJS.Storage.get(web3.utils.hexToAscii(content));
      this.setState({content, name, numVotes, backendError: ''});
    } catch (e) {
      this.setState({backendError: e.message || e});
    }
  }

  async getComments(numComments) {
    let comments = [];
    try {
      for (let i = 0; i < parseInt(numComments, 10); i++) {
        const comment = await web3Util.getComment(this.props.id, this.props.teamId, i)
        await Bluebird.join(
          EmbarkJS.Storage.get(web3.utils.hexToAscii(comment.content)),
          web3Util.getTeam(this.props.id, comment.writer)
        )
        .spread((content, {name}) => {
          comments.push({team: name, content})
        })
      }
      console.log('comments', comments)
      if(comments.length) {
        this.setState({comments});
      }
    } catch(e) {
      this.setState({backendError: e.message || e});
    }
  }

  async onUpvote(e) {
    e.preventDefault();
    try {
      await web3Util.upvote(this.props.id, this.props.teamId);
    } catch(e) {
      const msg = '\nProbable cause is - only registered teams are allowed to vote or you have already voted!';
      this.setState({backendError: (e.message || e) + msg});
    }
  }

  render() {
    const rows = [], comments = [];
    const content = JSON.parse(this.state.content || '{}');
    Object.keys(content).forEach((q,i) => {
      rows.push(
        <div class="card-text" key={i}>
          <h5>{q}</h5>
          <p>{content[q]}</p>
        </div>
      );
    });
    (this.state.comments || []).forEach((comment, i) => {
      comments.push(
        <div key={i} class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{comment.team}</h5>
          </div>
          <p class="mb-1">{comment.content}</p>
        </div>
      );
    })

    return (
      <div class="card">
        {
          this.state.backendError !== '' &&
          <Alert bsStyle="danger">{this.state.backendError}</Alert>
        }
        <h4 class="card-title">{this.state.name}</h4>
        <div class="card-body">
          {rows}
          <button type="button" class="btn btn-info" onClick={(e) => this.onUpvote(e)}>
            Upvote <span class="badge badge-light">{this.state.numVotes}</span>
          </button>
          <br></br>
          <h4 class="card-title" style={{"margin-top": "30px"}}>Comments</h4>
          {comments.length &&
            <div class="list-group">
              {comments}
            </div>
          }
          <textarea class="form-control" onChange={(e) => this.commentText(e)}>{this.state.comment}</textarea>
          <button type="button" class="btn btn-info" onClick={(e) => this.onComment(e)}>Comment</button>
        </div>
      </div>
    )
  }
}
