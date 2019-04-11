/* eslint-disable max-len */
const SKILLNAME = 'Sales Interactor';
// borrowed from https://github.com/alexa/alexa-cookbook/blob/master/feature-demos/skill-demo-plan-my-trip/lambda/custom/index.js
/**
 * ======= TOC
 * getSlotValues(filledSlots)
 */

/**
 *
 * processValidation(callback, event, slot_to_elicit, message)
 *
 * A wrapper for making a validation callback to Lambda.
 * callback {}
 * event usually equivalent to "handlerInput.requestEnvelope"
 * slot {}
 * message {}
 */

exports.processValidation = (callback, event, slotToElicit, message) => {
  let response = {};
  console.log(`*****\nSlot To Elicit: ${slotToElicit}`);
  console.log(`*****\nMessage: ${message}`);
  console.log(`*****\nValidation Event: ${JSON.stringify(event)}`);

  event.request.intent.slots[slotToElicit].confirmationStatus = 'NONE'; // eslint-disable-line no-param-reassign

  response = {
    version: '1.0',
    sessionAttributes: event.session.attributes,
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: message,
      },
      card: {
        type: 'Simple',
        title: SKILLNAME,
        content: message,
      },
      shouldEndSession: false,
      directives: [
        {
          type: 'Dialog.ElicitSlot',
          updatedIntent: {
            name: event.request.intent.name,
            confirmationStatus: 'NONE',
            slots: event.request.intent.slots,
          },
        },
      ],
    },
  };

  console.log(`Alexa Response: ${JSON.stringify(response)}`);
  callback(null, response);
}; /** END PROCESS VALIDATION */

/**
 *
 * getSlotValues(filledSlots)
 * allows me to choose what is given to alexa or what it resolves to as set up
 * Determine what data has been offered to fill the slots for a given intent
 * Returns an object known as slotValues
 */
exports.getSlotValues = filledSlots => {
  // Initialize a slotValues object
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);

  Object.keys(filledSlots).forEach(item => {
    const { name, resolutions, value } = filledSlots[item];

    if (filledSlots[item] && resolutions && resolutions.resolutionsPerAuthority[0] && resolutions.resolutionsPerAuthority[0].status && resolutions.resolutionsPerAuthority[0].status.code) {
      switch (resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: value,
            resolved: resolutions.resolutionsPerAuthority[0].values[0].value.name,
            identifier: resolutions.resolutionsPerAuthority[0].values[0].value.id,
            isValidated: true,
          };
          break;

        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: value,
            resolved: value,
            identifier: value,
            isValidated: false,
          };
          break;

        default:
          break;
      } // end switch
    } else {
      slotValues[name] = {
        synonym: value,
        resolved: value,
        identifier: value,
        isValidated: false,
      };
    } // end check condition if/else regarding resolutionsPerAuthority, etc.
  }, this);
  return slotValues;
};
/** END GET SLOT VALUES */
