exports = async function (changeEvent) {
  const start = new Date();
  console.log('Start time', start.toISOString());
  const docId = changeEvent.documentKey._id;
  const document = changeEvent.fullDocument;

  const MODEL_COST_PER_1K_TOKENS= {
    // OpenAI o1-preview input
    "o1-preview": 0.015,
    "o1-preview-2024-09-12": 0.015,
    // OpenAI o1-preview output
    "o1-preview-completion": 0.06,
    "o1-preview-2024-09-12-completion": 0.06,
    // OpenAI o1-mini input
    "o1-mini": 0.003,
    "o1-mini-2024-09-12": 0.003,
    // OpenAI o1-mini output
    "o1-mini-completion": 0.012,
    "o1-mini-2024-09-12-completion": 0.012,
    // GPT-4o-mini input
    "gpt-4o-mini": 0.00015,
    "gpt-4o-mini-2024-07-18": 0.00015,
    // GPT-4o-mini output
    "gpt-4o-mini-completion": 0.0006,
    "gpt-4o-mini-2024-07-18-completion": 0.0006,
    // GPT-4o input
    "gpt-4o": 0.005,
    "gpt-4o-2024-05-13": 0.005,
    "gpt-4o-2024-08-06": 0.0025,
    // GPT-4o output
    "gpt-4o-completion": 0.015,
    "gpt-4o-2024-05-13-completion": 0.015,
    "gpt-4o-2024-08-06-completion": 0.01,
    // GPT-4 input
    "gpt-4": 0.03,
    "gpt-4-0314": 0.03,
    "gpt-4-0613": 0.03,
    "gpt-4-32k": 0.06,
    "gpt-4-32k-0314": 0.06,
    "gpt-4-32k-0613": 0.06,
    "gpt-4-vision-preview": 0.01,
    "gpt-4-1106-preview": 0.01,
    "gpt-4-0125-preview": 0.01,
    "gpt-4-turbo-preview": 0.01,
    "gpt-4-turbo": 0.01,
    "gpt-4-turbo-2024-04-09": 0.01,
    // GPT-4 output
    "gpt-4-completion": 0.06,
    "gpt-4-0314-completion": 0.06,
    "gpt-4-0613-completion": 0.06,
    "gpt-4-32k-completion": 0.12,
    "gpt-4-32k-0314-completion": 0.12,
    "gpt-4-32k-0613-completion": 0.12,
    "gpt-4-vision-preview-completion": 0.03,
    "gpt-4-1106-preview-completion": 0.03,
    "gpt-4-0125-preview-completion": 0.03,
    "gpt-4-turbo-preview-completion": 0.03,
    "gpt-4-turbo-completion": 0.03,
    "gpt-4-turbo-2024-04-09-completion": 0.03,
    // GPT-3.5 input
    "gpt-3.5-turbo": 0.0015,
    "gpt-3.5-turbo-0125": 0.0005,
    "gpt-3.5-turbo-0301": 0.0015,
    "gpt-3.5-turbo-0613": 0.0015,
    "gpt-3.5-turbo-1106": 0.001,
    "gpt-3.5-turbo-instruct": 0.0015,
    "gpt-3.5-turbo-16k": 0.003,
    "gpt-3.5-turbo-16k-0613": 0.003,
    // GPT-3.5 output
    "gpt-3.5-turbo-completion": 0.002,
    "gpt-3.5-turbo-0125-completion": 0.0015,
    "gpt-3.5-turbo-0301-completion": 0.002,
    "gpt-3.5-turbo-0613-completion": 0.002,
    "gpt-3.5-turbo-1106-completion": 0.002,
    "gpt-3.5-turbo-instruct-completion": 0.002,
    "gpt-3.5-turbo-16k-completion": 0.004,
    "gpt-3.5-turbo-16k-0613-completion": 0.004,
    // Azure GPT-35 input
    "gpt-35-turbo": 0.0015,  // Azure OpenAI version of ChatGPT
    "gpt-35-turbo-0125": 0.0005,
    "gpt-35-turbo-0301": 0.002,  // Azure OpenAI version of ChatGPT
    "gpt-35-turbo-0613": 0.0015,
    "gpt-35-turbo-instruct": 0.0015,
    "gpt-35-turbo-16k": 0.003,
    "gpt-35-turbo-16k-0613": 0.003,
    // Azure GPT-35 output
    "gpt-35-turbo-completion": 0.002,  // Azure OpenAI version of ChatGPT
    "gpt-35-turbo-0125-completion": 0.0015,
    "gpt-35-turbo-0301-completion": 0.002,  // Azure OpenAI version of ChatGPT
    "gpt-35-turbo-0613-completion": 0.002,
    "gpt-35-turbo-instruct-completion": 0.002,
    "gpt-35-turbo-16k-completion": 0.004,
    // Others
    "text-ada-001": 0.0004,
    "ada": 0.0004,
    "text-babbage-001": 0.0005,
    "babbage": 0.0005,
    "text-curie-001": 0.002,
    "curie": 0.002,
    "text-davinci-003": 0.02,
    "text-davinci-002": 0.02,
    "code-davinci-002": 0.02,
    // Fine Tuned input
    "babbage-002-finetuned": 0.0016,
    "davinci-002-finetuned": 0.012,
    "gpt-3.5-turbo-0613-finetuned": 0.003,
    "gpt-3.5-turbo-1106-finetuned": 0.003,
    "gpt-3.5-turbo-0125-finetuned": 0.003,
    "gpt-4o-mini-2024-07-18-finetuned": 0.0003,
    // Fine Tuned output
    "babbage-002-finetuned-completion": 0.0016,
    "davinci-002-finetuned-completion": 0.012,
    "gpt-3.5-turbo-0613-finetuned-completion": 0.006,
    "gpt-3.5-turbo-1106-finetuned-completion": 0.006,
    "gpt-3.5-turbo-0125-finetuned-completion": 0.006,
    "gpt-4o-mini-2024-07-18-finetuned-completion": 0.0012,
    // Azure Fine Tuned input
    "babbage-002-azure-finetuned": 0.0004,
    "davinci-002-azure-finetuned": 0.002,
    "gpt-35-turbo-0613-azure-finetuned": 0.0015,
    // Azure Fine Tuned output
    "babbage-002-azure-finetuned-completion": 0.0004,
    "davinci-002-azure-finetuned-completion": 0.002,
    "gpt-35-turbo-0613-azure-finetuned-completion": 0.002,
    // Legacy fine-tuned models
    "ada-finetuned-legacy": 0.0016,
    "babbage-finetuned-legacy": 0.0024,
    "curie-finetuned-legacy": 0.012,
    "davinci-finetuned-legacy": 0.12,
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
      const database = 'langscout';

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
