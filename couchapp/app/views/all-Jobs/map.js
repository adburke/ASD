function(doc) {
	if ( doc._id.substr(0, 4) === "job:" ) {
		emit( doc["Job Number"],{
			"status": doc.Status,
			"due": doc["Due Date"]
		});
	}
};

  