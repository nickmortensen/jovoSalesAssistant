/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable no-multiple-empty-lines */
/* BST FOLDER INDEX.JS */

const Alexa       = require('ask-sdk-core');
const Hubspot     = require('hubspot');
const Entities    = require('html-entities').XmlEntities;
const MESSAGES    = require('./helpers/Messages'); // houekeeping for constants and recurring messages
const config      = require('./config/config.json');
const describe    = require('./intents/describe-intent');
const helpers     = require('./helpers/helpers.js');
const alexaHelper = require('./helpers/alexa-helper');

const hubspot = new Hubspot({ apiKey: config.hubspot.api_key });
// const entities      = new Entities();
// const dateReadable = 'MMM Do, YYYY';  // for use with moment.jhs

/**
 * TABLE OF CONTENTS
 * ======= HANDLERS CUSTOM
 * ======= 1.GetContactInfoHandler
 * ======= HANDLERS GENERAL
 * ======= 1. LaunchRequestHandler
 * ======= 2. EMPTY
 * ======= 3. HelpIntentHandler
 * ======= 4. CancelAndStopIntentHandler
 * ======= 5. SessionEndedRequestHandler
 * ======= 6. ErrorHandler
 * ======= SKILLBUILDER STUFF
*/

/* HANDLERS CUSTOM */
// ============== 1.GetContactInfoHandler
/**
 * Grabs a specified piece of information from Hubspot.
 */

const GetContactInfoHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { intent } = request;
    return request.type === 'IntentRequest' && intent.name === 'GetContactInfo';
  },
  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const { request } = handlerInput.requestEnvelope;
    const { intent } = request;
    const { slots } = intent;
    const slotValues = alexaHelper.getSlotValues(slots);
    const contactInfo = slotValues.contactInfo.resolved;
    const contact = slotValues.contact.resolved;
    let speechOutput = 'SKill to Use is Get Contact Info';
    let cardText = `${helpers.toTitleCase(contact)}'s ${contactInfo} is: `;
    speechOutput = `OK, you want the ${contactInfo} for ${contact}`;
    try {
      await helpers.callDirectiveService(handlerInput);
    } catch (err) {
      console.error(`DirectiveService Errror error ${err} `);
    }
    try {
      // let client = {}; // the client object should be instantiated outside of the search function
      await hubspot.contacts.search(contact)
        .then(results => {
          speechOutput = helpers.getThisInfo(results, contactInfo);
          cardText += speechOutput;
          const { properties } = results.contacts[0];
          const firstname = Object.prototype.hasOwnProperty.call(properties, 'firstname') ? properties.firstname.value : '';
          const lastname = Object.prototype.hasOwnProperty.call(properties, 'lastname') ? properties.lastname.value : '';
          const name = helpers.toTitleCase(`${firstname} ${lastname}`);
          const phone = 'phone' in properties ? helpers.formatPhoneNumber(properties.phone.value) : '';
          speechOutput = helpers.sayThePhoneNumber(phone);

        }).catch(console.error);
    } catch (error) {
      console.error(error);
    }
    return responseBuilder
      .speak(speechOutput)
      .withSimpleCard(MESSAGES.SKILLNAME, cardText)
      .getResponse();
  },
};








// ======= END GetContactInfoHandler
/* HANDLERS GENERAL */
// ======= 1. GetSkillInfoHandler
const GetSkillInfoHandler = {
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

// 3. HelpIntentHandler
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
// 4. CancelAndStopIntentHandler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(MESSAGES.STOPMESSAGE)
      .getResponse();
  },
};

// 5. SessionEndedRequestHandler
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};
// 6. ErrorHandler
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

// SKILLBUILDER STUFF -- BE SURE AND ADD ANY NEW INTENTS BELOW
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    GetContactInfoHandler,
    GetSkillInfoHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
