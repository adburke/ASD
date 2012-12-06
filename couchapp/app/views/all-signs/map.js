function(doc) {
  if ( doc._id.substr(0, 9) === "job:sign:" ) {
    emit( doc["Job Number"], doc._id);
  }
};