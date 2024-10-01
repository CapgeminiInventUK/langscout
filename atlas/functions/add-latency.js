exports = async function(changeEvent) {
  const document = changeEvent.fullDocument

  const database = "langtrace";

  const mongodb = context.services.get("CapGPT");
  const collection = mongodb.db(database).collection(changeEvent.ns.coll);

  try {
    if (document.start_time && document.end_time && !document.latency) {
      const startTime = new Date(document.start_time);
      const endTime = new Date(document.end_time);

      const latency = (endTime - startTime);

      await collection.updateOne(
        { _id: changeEvent.documentKey._id },
        { $set: { latency: latency } }
      );
    }
  } catch(err) {
    console.log("error performing mongodb write: ", err.message);
  }
};
