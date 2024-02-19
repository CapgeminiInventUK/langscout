exports = async function (changeEvent) {
  const start = new Date();
  console.log('Start time', start.toISOString());
  const docId = changeEvent.documentKey._id;
  const document = changeEvent.fullDocument;

  const MODEL_COST_PER_1K_TOKENS = {
    // GPT-3.5 input
    'gpt-3.5-turbo': 0.0015,
    'gpt-3.5-turbo-0301': 0.0015,
    'gpt-3.5-turbo-0613': 0.0015,
    'gpt-3.5-turbo-1106': 0.001,
    'gpt-3.5-turbo-instruct': 0.0015,
    'gpt-3.5-turbo-16k': 0.003,
    'gpt-3.5-turbo-16k-0613': 0.003, // GPT-3.5 output
    'gpt-3.5-turbo-completion': 0.002,
    'gpt-3.5-turbo-0301-completion': 0.002,
    'gpt-3.5-turbo-0613-completion': 0.002,
    'gpt-3.5-turbo-1106-completion': 0.002,
    'gpt-3.5-turbo-instruct-completion': 0.002,
    'gpt-3.5-turbo-16k-completion': 0.004,
    'gpt-3.5-turbo-16k-0613-completion': 0.004, // Azure GPT-35 input
    'gpt-35-turbo': 0.0015,
    'gpt-35-turbo-0301': 0.0015,
    'gpt-35-turbo-0613': 0.0015,
    'gpt-35-turbo-instruct': 0.0015,
    'gpt-35-turbo-16k': 0.003,
    'gpt-35-turbo-16k-0613': 0.003, // Azure GPT-35 output
    'gpt-35-turbo-completion': 0.002,
    'gpt-35-turbo-0301-completion': 0.002,
    'gpt-35-turbo-0613-completion': 0.002,
    'gpt-35-turbo-instruct-completion': 0.002,
    'gpt-35-turbo-16k-completion': 0.004,
    'gpt-35-turbo-16k-0613-completion': 0.004,
  };

  function getTokenLength(content, encoding) {
    const start = new Date();
    console.log('Get token Start time', start.toISOString());
    const tokens = encoding.encode(content);
    const end = new Date();
    console.log('Get token End time', end.toISOString());
    console.log('Get token Duration', end - start);
    return tokens.length;
  }

  function getTokenCost(content, model) {
    return (MODEL_COST_PER_1K_TOKENS[model] * content) / 1000;
  }

  if (document.run_type === 'llm') {
    if (document.end_time !== undefined) {
      const database = 'langtrace';

      const config = context.values.get('trigger_config');

      const mongodb = context.services.get(config.app_service_name);
      const collection = mongodb.db(database).collection(changeEvent.ns.coll);

      const encodingCollection = mongodb.db(database).collection('encoding');

      const { Tiktoken } = require('js-tiktoken-mongodb/lite');

      const model = document.extra.invocation_params.model;
      const modelCompletion = model + '-completion';
      const modelResponse = model;
      const encodingType = 'cl100k_base';

      const encodingJson = await encodingCollection.findOne({ encoding: encodingType }, {
        projection: {
          encoding: 0,
          _id: 0
        }
      });

      const startEncoding = new Date();
      console.log('Start encoding time', startEncoding.toISOString());
      const enc = new Tiktoken(encodingJson);
      const endEncoding = new Date();
      console.log('End encoding time', endEncoding.toISOString());
      console.log('Encoding duration', endEncoding - startEncoding);

      const outputs = document.outputs.generations;
      const inputs = document.inputs.messages;
      let inputTokenCount = 0;
      let outputTokenCount = 0;

      for (let i = 0; i < inputs.length; i++) {
        const next = inputs[i];
        for (let j = 0; j < next.length; j++) {
          const next2 = next[j];
          const content = next2.kwargs.content;
          inputTokenCount += getTokenLength(content, enc);
        }
      }

      for (let i = 0; i < outputs.length; i++) {
        const next = outputs[i];
        for (let j = 0; j < next.length; j++) {
          const next2 = next[j];
          const content = next2.text;
          outputTokenCount += getTokenLength(content, enc);
        }
      }

      const inputCost = getTokenCost(inputTokenCount, modelCompletion);
      const outputCost = getTokenCost(outputTokenCount, modelResponse);

      const usage = {
        inputTokenCount: inputTokenCount,
        inputTokenCostPer1k: MODEL_COST_PER_1K_TOKENS[modelCompletion],
        outputTokenCount: outputTokenCount,
        outputTokenCostPer1k: MODEL_COST_PER_1K_TOKENS[modelResponse],
        tokenInputCost: inputCost,
        tokenOutputCost: outputCost,
        tokenTotalCost: inputCost + outputCost
      };

      await collection.updateOne({ _id: docId }, { $set: { 'extra.tokens': usage } });

      const end = new Date();
      console.log('End time', end.toISOString());
      console.log('Duration', end - start);

    } else {
      console.error('Non end time for trace');
    }
  } else {
    console.warn(`Non llm run type ${document.run_type}`);
  }
};
