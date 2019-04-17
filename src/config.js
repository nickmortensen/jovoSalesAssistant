/* eslint-disable object-curly-newline */
// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  intentMap: {
    'AMAZON.StopIntent': 'END',
    'AMAZON.CancelkIntent': 'END',
    'AMAZON.HelpIntent': 'HelpIntent',
    'AMAZON.YesIntent': 'YesIntent',
    'AMAZON.NoIntent': 'NoIntent',
    'AMAZON.RepeatIntent': 'RepeatIntent'
  },
};
