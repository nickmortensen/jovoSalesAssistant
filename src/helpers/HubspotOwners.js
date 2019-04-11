const Hubspot = require('hubspot');
const  configuration  = require('../configuration/config.json');
const sort = require('./sort');

const hubspot = new Hubspot({ apiKey: configuration.hubspot.apiKey });

// console.log(configuration.hubspot.apiKey);

/**
 * Sort an Array of Objects by the value of a given key
 * Sort an array of objects by a value inside fo the objects
 *
 * @link https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
 * @note a8m's answer
 * @param {array} array The array containing the many objects that I'd like to sort out.
 * @param {*} attrs property or properties in the order of which I'd like to sort them
 * @returns
 */

exports.alphabetizedOwners = async () => {
  const ownerArray = [];
  await hubspot.owners.get()
    .then(results => {
      results.map(result => {
        const { ownerId, email } = result;
        let { firstName, lastName } = result;
        switch (email) {
          // must periodically get this information
          case 'amikula@jonessign.com':
            firstName = 'Al';
            lastName  = 'Mikula';
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
          case 'jjasper@jonessign.com':
            firstName = 'Jon';
            lastName = 'Jasper';
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
  // console.log(JSON.stringify(sort.sortByAttribute(ownerArray, 'lastName'), null, 2));
// return JSON.stringify(sort.sortByAttribute(ownerArray, 'lastName'), null, 2);
};



