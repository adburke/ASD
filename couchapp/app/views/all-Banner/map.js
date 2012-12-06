function(doc) {
	if ( doc._id.substr(0, 11) === "job:banner:" ) {
		emit( [doc.Status,doc["Job Number"]],{
			"status": doc.Status,
			"due": doc["Due Date"]
		});
	}
};
