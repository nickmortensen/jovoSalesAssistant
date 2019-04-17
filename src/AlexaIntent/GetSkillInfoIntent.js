const Alexa              = require('ask-sdk-core');
const Hubspot            = require('hubspot');
const { XmlEntities }    = require('html-entities');
const helpers            = require('../helpers/helpers');
const config             = require('../configuration/configuration');
const hubspot            = new Hubspot({ apiKey: '8376fde1-d78e-434e-a775-6d78bee0bbfa' });
const AllIntents = require('./AlexaIntent/intents_described.json');
const { intents } = AllIntents;

exports.GetSkillInfoIntentHandler = function(handlerInput) {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'LaunchRequest' || (request.type === 'IntentRequest' && request.intent.name === 'GetSkillInfoIntent');
  },
  handle(handlerInput) {
    let speechOutput = 'Launch has Been Initiated';
    let cardText = config.intents[2].card;
    const intentIndex = helpers.getRandomInteger(0, config.intents.length);
    speechOutput = describe.describeIntent(intentIndex, 'spoken');
    cardText = describe.describeIntent(intentIndex, 'card');
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(MESSAGES.SKILLNAME, cardText)
      .getResponse();
  },
};
