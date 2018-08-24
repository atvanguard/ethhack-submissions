import React from 'react'
import ReactDOM from 'react-dom'

class HackathonRow extends React.Component {
  render() {
    return <a href="#" class="list-group-item list-group-item-action">{this.props.name}</a>
  }
}

export default class HackathonsList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    let rows = [];
    (this.props.hacks || []).forEach((hack,i) => {
      rows.push(<HackathonRow name={hack.name} key={i} />)
    });
    return (
      <div class="list-group">{rows}</div>
    )
  }
}
