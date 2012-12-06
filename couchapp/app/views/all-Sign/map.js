function(doc) {
	if ( doc._id.substr(0, 9) === "job:sign:" ) {
		emit( doc["Job Number"],{
			"status": doc.Status,
			"due": doc["Due Date"]
		});
	}
};
