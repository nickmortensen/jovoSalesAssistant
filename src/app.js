// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App }             = require('jovo-framework');
const { Alexa }           = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger }    = require('jovo-plugin-debugger');
const { FileDb }          = require('jovo-db-filedb');
const helpers             = require('./helpers/helpers');
const Hubspot             = require('hubspot');
const configuration       = require('./configuration/configuration');
const { apiKey }              = configuration.hubspot;
const hubspot             = new Hubspot({ apiKey });
const AllIntents          = require('./AlexaIntent/intents_described');
const { intents }         = AllIntents;
const randomIntent        = helpers.getRandomInteger(0, intents.length);

const app = new App();
// const model     = require('../models/en-US');

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------


const handlers = {
  LAUNCH() {
    // let speech = 'Launch has been initiated for Sales Assistant from Jones Sign Company';
    // let card = speech;
    // speech = intents[randomIntent].spoken; // any old intent -- this is just what we talk about at launch
    // const { welcome, reprompt } = messages;
    // this.tell(reprompt, welcome);
    return this.toIntent('GetContactInfo');
  },
  // end of LAUNCH() definition.

  GetSkillInfo() {
    const speech = 'GetSkillInfo has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of GetSkillInfo() definition.

  async GetContactInfo(jovo) {
    /**
     * handlerInput becomes 'jovo'  -- be sure to use 'jovo' in any helper methods
     * contact, contactInfo
     */
    const contact = jovo.$inputs.contact.value;
    let contactInfo = jovo.$inputs.contactInfo.value;
    contactInfo = 'email';
    let speech = 'GetContactInfo has been initiated';
    console.log(`***** ${contact} : ${contactInfo} *****`);
    speech = `You want the ${contactInfo} for ${contact}, correct?`;
    const attributes = jovo.$session.$data; // JOVO stores session data in key values
    attributes.contact = contact;
    // TODO Add Display Outpt
    jovo.ask(speech); // jovo is the speech output within the JOVO framework -- anlogue would be the responsebuilder
    jovo.tell(speech);
  },
  // End of GetContactInfo() definition.

  CompareSalesPeople() {
    const speech = 'CompareSalesPeople has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of CompareSalesPeople() definition.

  DealsInStage() {
    const speech = 'DealsInStage has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of DealsInStage() definition.

  TotalInDeals() {
    const speech = 'TotalInDeals has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of TotalInDeals() definition.

  CreateNewContact() {
    const speech = 'CreateNewContact has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of CreateNewContact() definition.

  UpdateContact() {
    const speech = 'UpdateContact has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of UpdateContact() definition.

  GetOwnerInfo() {
    const speech = 'GetOwnerInfo has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of GetOwnerInfo() definition.

  EngagementsByPeople() {
    const speech = 'EngagementsByPeople has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of EngagementsByPeople() definition.

  CreateEngagement() {
    const speech = 'CreateEngagement has been initiated';
    console.log(`***** ${speech} *****`);
  },
  // End of CreateEngagement() definition.

  END() {},
  ON_ERROR() {},
}; // END const handlers.

const alexaHandlers = {};
const googleActionHandlers = {};
app.setHandler(handlers);
app.setAlexaHandler(alexaHandlers);
app.setGoogleAssistantHandler(googleActionHandlers);

module.exports.app = app;


// common messages -- may end up moving these to a separate messages.json file for tidyness
const messages = {
  jsc: 'Jones Sign Company',
  jco: 'Jones Sign Co.',
  jss: 'Jones Sign',
  appname: 'Sales Assistant',
  welcome: 'Welcome to Jones Sign Assistant',
  reprompt: 'ask me \'what can you do?\'',
};
