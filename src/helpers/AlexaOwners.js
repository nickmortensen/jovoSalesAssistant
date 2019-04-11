const Hubspot = require('hubspot');
const  configuration  = require('../configuration/config.json');
const sort = require('./sort');

const hubspot = new Hubspot({ apiKey: configuration.hubspot.apiKey });

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
exports.alexaOwners = async () => {
  const alexaSalesArray = [];
  const dialogFlowArray = [];
  await hubspot.owners.get()
    .then(results => {
      results.map(result => {
        const { ownerId, email } = result;
        let { firstName, lastName } = result;
        switch (ownerId) {
          // must periodically get this information
          case 32437982:
            // email = 'amikula@jonessign.com';
            firstName = 'Al';
            lastName  = 'Mikula';
            break;
          case 31755832:
            // email = 'jmortensen@jonessign.com';
            firstName = 'John';
            lastName  = 'Mortensen';
            break;
          case 32439387:
            // email = 'molson@jonessign.com';
            firstName = 'Mimi';
            lastName  = 'Olson';
            break;
          case 32645290:
            // email = 'bogorman@jonessign.com';
            firstName = 'Bill';
            lastName  = 'O\'Gorman';
            break;
          case 32871452:
            // email = 'lwalker@jonessign.com';
            firstName = 'Laurel';
            lastName  = 'Walker';
            break;
          case 33339116:
            // email = 'cgodinez@jonessign.com'
            firstName = 'Charles';
            lastName  = 'Godinez';
            break;
          case 35675006:
            // email = 'jjasper@jonessign.com';
            firstName = 'Jon';
            lastName = 'Jasper';
            break;
          default:
            // email = `${email}`;
            firstName = `${firstName}`;
            lastName  = `${lastName}`;
        }
        let names = `${firstName} ${lastName}`;
        let name = { "value": names.toUpperCase(), "synonyms": []};


        alexaSalesArray.push({ id:ownerId, name});
        return alexaSalesArray;
      });
    })
    .catch(console.error);
  // return sort.sortByAttribute(alexaSalesArray, 'lastName');
  // console.log(JSON.stringify(sort.sortByAttribute(alexaSalesArray, 'id'), null, 2));
  // return JSON.stringify(sort.sortByAttribute(alexaSalesArray, 'lastName'), null, 2);
};


/**
 *
 * @param {array} salespeople An array of Salespeople
 */
function formatSalesPeople(salespeople) {
  const people = [];
  salespeople.map(person => {
    let first      = person.name.value.split(' ')[0].slice(0, 1).toUpperCase() + person.name.value.split(' ')[0].slice(1).toLowerCase();
    let last       = person.name.value.split(' ')[1].slice(0, 1).toUpperCase() + person.name.value.split(' ')[1].slice(1).toLowerCase();
    let name       = `${first} ${last}`;
    const staffer  = {};
    staffer.sort   = last.toLowerCase() + first.toLowerCase()
    staffer.id     = person.id;
    staffer.name   = person.name;
    people.push(staffer);
    // return staffer;
  });
  const sortedPeople = sort.sortByAttribute(people, 'sort');
  // return sortedPeople;
  return JSON.stringify(sortedPeople, null, 2);
}