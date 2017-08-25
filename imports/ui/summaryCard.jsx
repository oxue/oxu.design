import React, { Component } from 'react';

export default class SummaryCard extends Component{
  render() {
    return (<div className="summary-card"> {this.props.info} </div>);
  }
}