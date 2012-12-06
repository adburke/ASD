function(doc) {
  if ( doc._id.substr(0, 10) === "job:decal:" ) {
    emit( doc["Job Number"], doc._id);
  }
};