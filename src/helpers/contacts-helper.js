/* eslint-disable yoda */
/**
 * FORMAT AN ENGAGEMENT
 */

/**
 * ============ 1. FORMAT AN ENGAGEMENT ============
 * @param {string} engagement Type of engagement among: CALL, EMAIL, MEETING, EMAIL, NOTE
*/
exports.formatEngagement = (engagement) => {
  // If what is provided is plural, make singular
  if ('s' === engagement[engagement.length - 1]) {
    engagement = engagement.slice(0, -1); // eslint-disable-line no-param-reassign
  }
  return engagement.toUpperCase(); // Capitalize to match output from Hubspot API.
};
