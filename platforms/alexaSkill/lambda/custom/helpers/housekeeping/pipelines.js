const Hubspot       = require('hubspot');
const config        = require('.././config/config.json');
const api           = config.hubspot.api_key;
const hubspot       = new Hubspot({ apiKey: api });


/**
 * ==========================================================
 * SALES PIPELINES AS WELL AS THE STAGES WITHIN EACH PIPELINE
 * ==========================================================
*/
// via hubspot
hubspot.pipelines.get()
  .then( (results) => {
    const arrayBegin = '[';
    // results is a complex array
    for (let i = 0; i < results.length; i++) {
      console.log(`${results[i].pipelineId}: ${results[i].label}`);
      const arrayOfObjects = [];
      for (let a = 0; a < results[i].stages.length; a++) {
        const { stageId, label, probability, active, displayOrder, closedWon } = results[i].stages[a];
        const  objectWithinArray  = ` ${stageId} ${label} ${probability} `;
        arrayOfObjects.push(objectWithinArray);
      } // end internal for statement
      const thingIWant = {...arrayOfObjects};
      console.log(thingIWant);
    }
  })
  .catch(console.error);

// end sales pipelines SALES PIPELINES AS WELL AS THE STAGES WITHIN EACH PIPELINE
