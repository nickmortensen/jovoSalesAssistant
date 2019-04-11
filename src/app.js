

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask('Might the app ask your name?', 'Please tell me your name.');
  },

  MyNameIsIntent() {
    this.tell(`Hey ${this.$inputs.name.value}, nice to meet you!`);
  },
  GetNewDealsIntent() {},
  GetContactInfoIntent() {},
  GetSkillInfoIntent() {},
});

module.exports.app = app;
