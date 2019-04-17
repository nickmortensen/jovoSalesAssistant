const Alexa              = require('ask-sdk-core');
const Hubspot            = require('hubspot');
const { XmlEntities }    = require('html-entities');
const helpers            = require('../helpers/helpers');
const config             = require('../config/config.json');
const hubspot            = new Hubspot({ apiKey: config.hubspot.api_key });

exports.GetNewDealsIntentHandler = () => {};