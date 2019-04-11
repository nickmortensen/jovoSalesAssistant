const moment = require('moment');

// The following functions return true or false if time is within parameters
const timeGreater = (timestamp, compTimestamp) => timestamp.isAfter(compTimestamp);
// const timeLesser  = (timestamp, compTimestamp) => timestamp.isBefore(compTimestamp);
const timeEqual   = (timestamp, compTimestamp) => timestamp.isSame(compTimestamp);
const timeBetween = (timestamp, lowTimestamp, highTimestamp) => timestamp.isBetween(lowTimestamp, highTimestamp, null, '[]');


const timeframes = [
  {
    name: 'today',
    properties: {
      operator: timeEqual,
      comparable: moment().startOf('date'),
      range: false,
    },
  },
  {
    name: 'yesterday',
    properties: {
      operator: timeEqual,
      comparable: moment().startOf('date').subtract(1, 'days'),
      range: false,
    },
  },
  {
    name: 'tomorrow',
    properties: {
      operator: timeEqual,
      comparable: moment().startOf('date').add(1, 'days'),
      range: false,
    },
  },
  {
    name: 'this week',
    properties: {
      operator: timeGreater,
      comparable: moment().startOf('week'),
      range: false,
    },
  },
  {
    name: 'last week',
    properties: {
      operator: timeBetween,
      comparable_low: moment().startOf('week').subtract(1, 'weeks'),
      comparable_high: moment().startOf('week'),
      range: true,
    },
  },
  {
    name: 'next week',
    properties: {
      operator: timeBetween,
      comparable_low: moment().startOf('week'),
      comparable_high: moment().startOf('week').add(1, 'weeks'),
      range: true,
    },
  },
  {
    name: 'this month',
    properties: {
      operator: timeGreater,
      comparable: moment().startOf('month'),
      range: false,
    },
  },
  {
    name: 'last month',
    properties: {
      operator: timeBetween,
      comparable_low: moment().startOf('month').subtract(1, 'months'),
      comparable_high: moment().startOf('month'),
      range: true,
    },
  },
  {
    name: 'next month',
    properties: {
      operator: timeBetween,
      comparable_low: moment().startOf('month'),
      comparable_high: moment().startOf('month').add(1, 'month'),
      range: true,
    },
  },
  {
    name: 'this year',
    properties: {
      operator: timeGreater,
      comparable: moment().startOf('year'),
      range: false,
    },
  },
];

// this function determines whether the slot time provided is valid
exports.timeframeCheck = (slotTimeframe) => {
  let timeframeObj = false;
  console.log(`***** Timeframe passed in is: ${slotTimeframe} *****`);
  // if the slot timeframe isn't valid, sheck the see it if it listed in config file
  if (moment(slotTimeframe, 'YYYY-MM-DD', true).isValid() === true) {
    timeframeObj = {
      operator: timeEqual,
      comparable: moment(slotTimeframe).startOf('date'),
      range: false,
    };
    console.log('timeframeObj.comparable', timeframeObj.comparable);
  // return timeframeObj;
  } else if (moment(slotTimeframe, 'MM-DD-YYYY', true) === true) {
    timeframeObj = {
      operator: timeEqual,
      comparable: moment(slotTimeframe).startOf('date'),
      range: false,
    };
    console.log('timeframeObj.comparable', timeframeObj.comparable);
    // return timeframeObj;
  } else {
    timeframes.forEach((timeframe) => {
      if (slotTimeframe.includes(timeframe.name) === true) {
        timeframeObj = timeframe.properties;
      }
    });
  }
  return timeframeObj;
};
