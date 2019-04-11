const Speech = require('ssml-builder');
// const helper = require('../helpers/helpers');
const config = require('../config/config.json');
// if using Amazon SSML specific tags
// const AmazonSpeech  = require('ssml-builder/amazon_speech');
/**
 * describeAnIntent(intentIndex, outputType)
 *
 * todo: add a condition that the intent cannot have been previously described in this session
 *
 * Describes a single intent within this skill using JSON data from the config.json file
 *
 * intentIndex {number} The intent number to choose, should probably add to attributes
 * outputType {} Output could be 'spoken', or anything else.  If 'spoken,we'll use the instance of the Speech object we set up
 */
exports.describeIntent = (intentIndex, outputType) => {
  const aboutIntent                   = new Speech();
  const allTheIntents                 = config.intents;
  const { spoken, description, card } = allTheIntents[intentIndex];
  let output                          = `Interact with Hubspot CRM. Try:"${spoken}": If you aim to ${description}`;
  aboutIntent.say('Interact with Hubspot CRM.')
    .pause('500ms')
    .say(' Try:"')
    .say(spoken)
    .pause('500ms')
    .say('". In order to ')
    .say(description);
  switch (outputType) {
    case 'card':
      output = card;
      break;
    default:
      output = aboutIntent.ssml(true); // if spoken is the chosen output, use the ssml we've set up in the aboutMe instance of Speech
  }
  return output;
};
/* ======= end describeAnIntent(intentIndex, outputType) ======= */
