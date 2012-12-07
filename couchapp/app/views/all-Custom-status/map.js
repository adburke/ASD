function(doc) {
	if ( doc._id.substr(0, 11) === "job:custom:" ) {
		emit([doc.Status,doc["Job Number"]],{
			"status": doc.Status,
			"due": doc["Due Date"],
			"customer": doc["Company"],
			"qty": doc["Quantity"],
			"prodt": doc["Production Hours"]
		});
	}
};

    