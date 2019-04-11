/** 
 * GET ALL THE OWNERS FROM HUBSPOT INTO AN ARRAY OF OBJECTS USED FOR THE CONFIG FILE
*/

const noLongerHere         = [31203639, 31203594, 33251080, 32643329, 32186441, 32675032, 33993669, 32660365, 31283436];
const Hubspot              = require('hubspot');
const config               = require('../config/config.json');
const sort                 = require('./sort');

const api                  = config.hubspot.api_key;
const hubspot              = new Hubspot({ apiKey: api });
exports.alphabetizedOwners = async() => {
  const ownerArray = [];
  await hubspot.owners.get()
    .then((results) => {
      results.map((result) => {
        let { ownerId, firstName, lastName, email } = result;
        switch(email) {
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
      });
      // return ownerArray;
    })
    .catch(console.error);

  console.log(JSON.stringify(sort.sortByAttribute(ownerArray, 'lastName'), null, '\t'));
};