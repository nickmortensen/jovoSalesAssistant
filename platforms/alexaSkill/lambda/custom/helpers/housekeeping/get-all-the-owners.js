/**
 * GET ALL THE OWNERS FROM HUBSPOT INTO AN ARRAY OF OBJECTS USED FOR THE CONFIG FILE
*/

// const noLongerHere         = [31203639, 31203594, 33251080, 32643329, 32186441, 32675032, 33993669, 32660365, 31283436];
const Hubspot              = require('hubspot');
const config               = require('../../config/config.json');
const sort                 = require('.././sort');

const api                  = config.hubspot.api_key;
const hubspot              = new Hubspot({ apiKey: api });
exports.alphabetizedOwners = async () => {
  const ownerArray = [];
  await hubspot.owners.get()
    .then(results => {
      results.map(result => {
        const { ownerId, email } = result;
        let { firstName, lastName } = result;
        switch (email) {
          case 'amikula@jonessign.com':
            firstName = 'Al';
            lastName  = 'Mikula';
            break;
          case 'mphelps@jonessign.com':
            firstName = 'Michael';
            lastName  = 'Phelps';
            break;
          case 'jmortensen@jonessign.com':
            firstName = 'John';
            lastName  = 'Mortensen';
            break;
          case 'molson@jonessign.com':
            firstName = 'Mimi';
            lastName  = 'Olson';
            break;
          case 'bogorman@jonessign.com':
            firstName = 'Bill';
            lastName  = 'O\'Gorman';
            break;
          case 'lwalker@jonessign.com':
            firstName = 'Laurel';
            lastName  = 'Walker';
            break;
          case 'cgodinez@jonessign.com':
            firstName = 'Charles';
            lastName  = 'Godinez';
            break;
          default:
            firstName = `${firstName}`;
            lastName  = `${lastName}`;
        }

        ownerArray.push({ fullName: `${firstName} ${lastName}`, ownerId, email, firstName, lastName });
        return ownerArray;
      });
    })
    .catch(console.error);
  // return sort.sortByAttribute(ownerArray, 'lastName');
  console.log(JSON.stringify(sort.sortByAttribute(ownerArray, 'lastName'), null, '\t'));
  // return JSON.stringify(sort.sortByAttribute(ownerArray, 'lastName'), null, '\t');
};

/**
 * is array of employees from the skill.json folder
 * LOCAL FUNCTION -- NOT EXPORTED
 * TODO: GET THE OWNERS FROM HUBSPOT & ID THE ONES THAT NO LONGER NEED TO BE IN
 */
const information = require('../../../../../hubspot_interactor/jonesyBot/models/en-US.json');

const slots       = information.interactionModel.languageModel.types[1];
const salespeople = slots.values;
const salesfolks  = []; // array to push into
salespeople.map(person => {
  const { id }          = person;
  const name            = person.name.value;
  const firstname       = name.substring(0, name.lastIndexOf(' '));
  const lastname        = name.substring(name.lastIndexOf(' ') + 1);
  const nicknames       = person.name.synonyms.reduce((acc, currValue) => acc.concat(currValue), []);
  const output          = {};
  output.id             = id;
  output.firstName      = firstname;
  output.lastName       = lastname;
  output.name           = {};
  output.name.value     = name;
  output.name.synonyms  = nicknames;
  return salesfolks.push(output);
});
// console.log(JSON.stringify(sort.sortByAttribute(salesfolks, 'lastName'), null, 2));
