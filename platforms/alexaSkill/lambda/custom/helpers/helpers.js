/* REFACTOR on 2019-02-27 */

const Hubspot       = require('hubspot');
const Speech        = require('ssml-builder'); // eslint-disable-line
const AmazonSpeech  = require('ssml-builder/amazon_speech'); // if using Amazon SSML specific tags
const moment        = require('moment');
const config        = require('../config/config.json');  // main config folder contains hapi key among other things

const hubspot       = new Hubspot({ apiKey: config.hubspot.api_key });


/**
 * TABLE OF CONTENTS
 * 1. formatQuery(query) - Replaces Hyphen in contact names with a sapce
 * 2. getRandomInteger(min,max)
 * 3. capitalizeFirstLetter(string)
 * 4. validateEmail(email) - is the email address valid - boolean
 * 5. splitTheEmailAddress(email) - split email into object.name & object.domain
 * 6. sayTheEmailAddress(email) - uses SSML to say the email
 * 7. formatPhoneNumber(phone) - formats any phone into (111) 111-1111 standard
 * 8. sayThePhoneNumber(phone)
 * 9. sayTheClientTitle(client) - if a client has a title, output the title
 * 10. sayTheClientCompany(client) - say which company the client is with
 * 11. getTheClientEmail(client) - get the client email
 * 12. retrieveAllInformation(info, client)
 * 13. retrieveTheInformation(info, client, format)
 * 14. formatUpdateData(data) - Format New Data to Create an Update Object
 * 15. getReadableDate(time) - return the UNIX time as Month Day, Year
 * 16. serialFormatArray(array) - Oxford Commas on arrays longer than two and an ' or ' between items in an array of 2 exactly;
 */

/**
 * format name query to remove hyphen -- add any other edge cases as they happen
 * "Jane Kerkovich-Williams" Becomes "Jane Kerkovich Williams"
 * @param string query First and Last Name of Contact in Hubspot
 *
 * @return string First and last name absent of any hyphens
 */
const formatQuery = query => query.replace(/-/g, ' '); // implicit return and only one variable
module.exports.formatQuery = formatQuery;
/* ======= END 1. formatQuery(query) ======= */

/**
 * 2. ======= getRandomInteger(min/max)
 * @param integer min Minimum digit
 * @param integer max Maximum digit
 * returns a whole number no larger than max and no smaller than min
 */
// const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;
exports.getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min; // using implicit return to make this a single-line function
/* ======= 2. END getRandomInteger(min,max) ======= */

/**
 * 3. Capitalize the first letter in a string
 *
 * @param {string} string to capitalize the first character of the first word
 */
exports.capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
/** Capitalize EVERY word in a string */
exports.toTitleCase = string => string.replace(/\b\S/g, t => t.toUpperCase());
/* ======= END 3. capitalizeFirstLetter(string) ======= */


/**
 * ======= 4. validateEmail(email)
 * Validates an email address
 * @param {string} email email address to validate
 * @returns {boolean} whether the email is valid or invalid
 */

exports.validateEmail = email => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};
/* ======= END 4. validateEmail(email) ======= */

/**
 * 5. splitTheEmailAddress(email)
 * Turns email address into an object
 * @param {string} email the email address to split apart
 * @returns {object} emailInfo an object containing name, domain
 */
const splitTheEmailAddress = email => {
  const emailInfo    = {
    name: email.substring(0, email.lastIndexOf('@')),
    domain: email.substring(email.lastIndexOf('@') + 1),
  };
  return emailInfo;
};

exports.splitTheEmailAddress = email => {
  const emailInfo    = {
    name: email.substring(0, email.lastIndexOf('@')),
    domain: email.substring(email.lastIndexOf('@') + 1),
  };
  return emailInfo;
};
/* ======= END 5. splitTheEmailAddress(email) ======= */

/**
 * 6. sayTheEmailAddress(email)
 * Reconstructs the email address so that it can be read off letter by letter for the first name
 * and as normal for the domain name by Amazon Alexa
 * example: nick@nickmortensen.com becomes n-i-c-k at nickmortensen.com
 * @param {string} email
 */
const sayTheEmailAddress = email => {
  // 'email' is an object consisting of a name and a domain name
  const emailAddress  = splitTheEmailAddress(email);
  const { name, domain }    = emailAddress;
  const speech = new AmazonSpeech();
  speech
    .say('email address is:')
    .sayAs({
      word: name,
      interpret: 'characters',
    })
    .say('@')
    .say(domain);
  return speech.ssml();
};

exports.sayTheEmailAddress = email => {
  // 'email' is an object consisting of a name and a domain name
  const emailAddress      = splitTheEmailAddress(email);
  const { name, domain }  = emailAddress;
  const speech            = new AmazonSpeech();
  speech
    .say('email address is:')
    .sayAs({
      word: name,
      interpret: 'characters',
    })
    .say('@')
    .say(domain);
  return speech.ssml();
};
/* ======= END 6. sayTheEmailAddress(email) ======= */

/**
 * ======= 7. formatPhoneNumber(phone)
 * Remove anything that isn't a digit from a phone number
 * Reformat to: (820) 040-3419
 * if there is a country code in the phone number, prepend '+1'
 *
 * @param {string} phone  Phone number with any parentheses, spaces, dashes or periods, etc.
 */
exports.formatPhoneNumber = phone => {
  const cleaned = phone.replace(/\D/g, '');
  const match   = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
};
// local function only to this file
const cleanPhoneNumber = phone => phone.replace(/\D/g, ''); // removes anything that isn't a digit from the phone number
const formatPhoneNumber = phone => {
  let cleaned = cleanPhoneNumber(phone);
  const match   = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = (match[1] ? '+1 ' : '');
    cleaned = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return cleaned;
};
/* ======= END 7. formatPhoneNumber(phone) ======= */

/**
 * 8. sayThePhoneNumber(phone)
 * use SSML to say the phone number
 *
 * @param {string} phone
 * @returns {string} speech
 */
exports.sayThePhoneNumber = phone => {
  const formatted = formatPhoneNumber(phone);
  const speech    = new AmazonSpeech();
  speech
    .sayAs({
      word: formatted,
      interpret: 'telephone',
    });
  return speech.ssml();
};

// 11_October_2018 adjusted to use withing retrieveAllInformation()
const sayThePhoneNumber = phone => {
  const formatted = formatPhoneNumber(phone);
  const speech    = new AmazonSpeech();
  speech
    .sayAs({
      word: formatted,
      interpret: 'telephone',
    });
  return speech.ssml();
};
/* ======== END 8. sayThePhoneNumber(phone) ======= */


/**
 * 9. sayTheClientTitle(client) - If the client has a title, return the name and the title -- otherwise just name
 *
 * @param {string} client
 * @returns {string} output
 */
exports.sayTheClientTitle = client => {
  let output = '';
  if (client.title === null) {
    output = `${client.name} has a title of ${client.title}`;
  }
  output = `The Hubspot CRM does not have a title entry for ${client.name}.`;
  return output;
};
/* ======== END 9. sayTheClientTitle(client) ======= */

/**
 * 10. sayTheClientCompany(client)
 * If a client has a company attached to them in hubspot, output the company name
 * @param {string} client
 * @returns
 */
exports.sayTheClientCompany = client => {
  let output;
  if (client.companyname === null) {
    output = `${client.name} has no within Hubspot`;
  }
  output = `${client.name} works for ${client.companyname}`;
  return output;
};

/* ======= END 10. sayTheClientCompany(client) ======= */


/**
 * 11. getTheClientEmail(client)
 *
 * @param {*} client
 * @returns
 */
exports.getTheClientEmail = client => {
  // let output;
  const { email, name } = client;
  let output = '';
  if (email === null) {
    output = `${name} has no within Hubspot`;
  }
  return sayTheEmailAddress(output);
}; // sayTheClientEmail

/* ======= END 11. getTheClientEmail(client) ======= */


/**
 * 12. retrieveAllInformation(info, client)
 * Retrieves as much information as entered into Hubspot for a client
 *
 * @param {string} info -- type of info that we want to retrieve
 * @param {string} client -- individual we want client information on
 * @param object client all of a particular clients information as entered into Hubspot
 */

exports.retrieveAllInformation = (info, client) => {
  let speechOutput = '';
  if (info === 'all') {
    // let cardText; // to do
    let infoSummary = `Summary for ${client.name}:\n`;
    // is there an email entry, if not return
    if (client.email !== false) {
      infoSummary += `Email: ${client.email}\n`;
    }
    // check if there is a phone number attached to this client in hubspot if not return
    if (client.phone !== null) {
      infoSummary += `Phone: ${formatPhoneNumber(client.phone)}\n`;
    }
    // check if there is a company name entered into the contact details in Hubspot
    if (client.company !== null) {
      infoSummary += `Company: ${client.company}\n`;
    }
    // check whether this client has a job title within the Hubspot contact information
    if (client.jobtitle !== null) {
      infoSummary += `Title: ${client.jobtitle}`;
    }
    speechOutput += infoSummary;
  } // end if('all' === info)
  return speechOutput;
};
/* ======= END 12. retrieveAllInformation(info, client) ======= */


/**
 * 13. retrieveTheInformation(info, client, format)
 *
 * @param {*} info
 * @param {*} client
 * @param {*} format
 * @returns
 */
exports.retrieveTheInformation = (info, client, format) => {
  let speechOutput;
  const { name } = client;
  let { email, phone, company, title } = client;
  // if there is no email in hubspot, let the user know
  if (info === 'email') {
    if (email === null) {
      email = `No email entered into Hubspot for ${name}`;
    }
    if (format === 'spoken') {
      email = sayTheEmailAddress(email);
    }
    speechOutput = email;
  }
  // you will want to both format this phone number and use the SSML function to say
  if (info === 'phone') {
    if (phone === null) {
      phone = `no phone given for ${name}`;
    } else {
      phone = formatPhoneNumber(phone);
      if (format === 'spoken') {
        phone = sayThePhoneNumber(phone);
      }
    }
    speechOutput = phone;
  }

  if (info === 'company') {
    if (company === null) {
      company = `No company info in Hubspot for ${name}`;
    }
    speechOutput = company;
  }

  if (info === 'title') {
    if (title === null) {
      title = `No title available for ${name}`;
    }
    speechOutput = title;
  }

  return speechOutput;
};
/* ======= 13. retrieveTheInformation(info, client, format) ======= */

/**
 *  14. Get Client VID from  a NAME query
 *
 *  Pulls a client id by the first and last name, this is a useful function
 *  You can re-use this function to find the additional data that cannot be gathered from a client search by name
 * @param {string} query client name
 * @returns {string} client.vid  The ID of the Client
 */
exports.getTheId = async query => {
  let theId;
  // let theIds = [];
  try {
    theId = await hubspot.contacts.search(query).then(results => results.contacts[0].vid).catch(console.error);
  } catch (err) {
    console.log(err);
  }
  return theId;
  // console.log(theId);
};
/* this one will be reusable */

/* get all the data from a contact id source */

exports.getAllData = id => {
  hubspot.contacts.getById(id)
    .then(results => {
      console.log(JSON.stringify(results));
    }).catch(console.error);
};

/* function to take a full name and split it into an object called 'result' that has a firstname and lastname property */
exports.splitName = fullName => {
  const result = {};
  if (fullName) {
    const nameArr = fullName.split(/\s+/);
    result.lastname = nameArr.pop();
    result.firstname = nameArr.join(' ');
  }
  return result;
};


/* grab the vid from a name query */
exports.getClientId = async query => {
  let theId;
  try {
    theId = await hubspot.contacts.search(query).then(results => results.contacts[0].vid).catch(console.error);
  } catch (err) {
    console.log(err);
  }
  return theId;
  // console.log( theID );
};

// get the email address from a name query

exports.getClientEmail = async query => {
  let theEmail;
  try {
    await hubspot.contact.search(query)
      .then(results => {
        const { properties } = results.contacts[0];
        theEmail = Object.prototype.hasOwnProperty.call(properties, 'email') ? results.contacts[0].email.value : 'no email';
      }).catch(console.error);
  } catch (error) {
    console.log(error);
  }
  return theEmail;
};


function callDirectiveService(handlerInput) {
  // Call Alexa Directive Service.
  const { requestEnvelope }    = handlerInput;
  const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();
  const { requestId }          = requestEnvelope.request;
  const endpoint               = requestEnvelope.context.System.apiEndpoint;
  const token                  = requestEnvelope.context.System.apiAccessToken;
  const stallSpeech = "<speak><audio src='https://jonessign.com/wp-content/uploads/2018/11/jonesyBot.mp3' /></speak>";
  // build the progressive response directive
  const directive = {
    header: { requestId },
    directive: {
      type: 'VoicePlayer.Speak',
      speech: stallSpeech,
    },
  };
  // send directive
  return directiveServiceClient.enqueue(directive, endpoint, token);
}
module.exports.callDirectiveService = callDirectiveService;
exports.sleep = milliseconds => (new Promise(resolve => (setTimeout(resolve(), milliseconds))));


/**
 * 14. Format New Data to Create an Update Object
 * @param {object} data Object that contains the property to be updated or created and the name
 *
 */
// format the data object into an array of objects
exports.formatUpdateData = data => {
  const output   = Object.keys(data).map(key => ({ property: key, value: data[key] })); // parenthesis outside of brackets creates an object
  return output;
};
// ======= END 14. Format New Data to Create an Update Object

// 15. getReadableDate(time) - return the UNIX time as Month Day, Year
exports.getReadableDate = time => {
  // ensure the time given is of the type 'number'
  const timeAsNumber = (typeof time === 'number') ? time : parseInt(time, 8);
  const dateFormat = 'MMM Do, YYYY'; // resolves to example of June, 25th, 2018
  return moment(time).format(dateFormat);
};
// ======= END 15. getReadableDate(time)

// 16. serialFormatArray(array) - Oxford Commas on arrays longer than two and an ' or ' between items in an array of 2 exactly;
exports.serialFormatArray = array => {
  const find    = /, ([^,]*$)/;
  // oxford comma if there are more than 2 items, just ' or ' if there are exactly two
  const replace = array.length === 2 ? ' or $1' : ', and $1';
  return array.join(', ').replace(find, replace);
};


exports.getThisInfo = (results, contactInfo) => {
  const person = results.query;
  const { properties } = results.contacts[0];
  const information = properties.hasOwnProperty(contactInfo) ? properties[contactInfo].value : `No ${info} in Hubspot for ${toCapitalCase(person)}`;
  return information;
};
