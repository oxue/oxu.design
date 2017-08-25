import React, { Component, PropTypes } from 'react';
import SummaryCard from './summaryCard.jsx';
import { SummaryCards } from '../api/summaryCards.js';
import { createContainer } from 'meteor/react-meteor-data';

class Summary extends Component {

  summaryCards() {
    return [
      {
        _id: 1,
        info: "INFO BOX 1",
      },
      {
        _id: 2,
        info: "INFO BOX 2",
      },
    ];
  
  }

  renderSummaryCards() {
    return this.props.summaryCards.map((card) => (
      <SummaryCard key={card._id} info={card.title} />
    ));
  }
 
  render() {
    return (
      <ul className="summary">
        
        {this.renderSummaryCards()}
      }
      </ul>
    );
  }
}

Summary.propTypes = {
  summaryCards: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    summaryCards: SummaryCards.find({}).fetch(),
  };
},Summary)