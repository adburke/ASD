function(doc) {
  if ( doc._id.substr(0, 11) === "job:poster:" ) {
    emit( doc["Job Number"], doc._id);
  }
};