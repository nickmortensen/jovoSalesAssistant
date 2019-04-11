/**
 * Parse a delimited string into an array of arrays.
 * The comma is the default delimiter, but that can be overridden with the second argument
 * @link https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
 *
 * @param {} data The name of the csv file (location??)
 * @param {string} delimiter Do we want to separate the fields with a comma
 */

const csvToArray = (data, delimiter) => {
  // is a delimiter defined? If not, set it to a comma (',')
  const delimitWith = (delimiter || ',');

  // Create Regular Expression to parse the CSV Values
  const objPattern = new RegExp((`(\\${delimitWith}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${delimitWith}\\r\\n]*))`), 'gi'); // end objPattern
  // Create array to hold data
  // Give the array a default empty first row
  const arrayData = [[]];
  // Create an array to hold our individual pattern matching groups
  const arrayMatches = null;

  // keep looping over the regular expression matches until we can't find ay more matches
  while (arrayMatches == objPattern.exec(data)) {

  }
}; // end csvToArray(data, delimiter)
