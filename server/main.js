import { Meteor } from 'meteor/meteor';
import {SummaryCards} from '../imports/api/summaryCards.js';

Meteor.startup(() => {
  // code to run on server at startup
  global.s = SummaryCards;
});
