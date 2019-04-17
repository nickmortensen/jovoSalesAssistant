const Alexa              = require('ask-sdk-core');
const Hubspot            = require('hubspot');
const { XmlEntities }    = require('html-entities');
const helpers            = require('../helpers/helpers');
const config             = require('../config/config.json');
const hubspot            = new Hubspot({ apiKey: '8376fde1-d78e-434e-a775-6d78bee0bbfa' });

exports.GetContactInfoHandler = () => {};