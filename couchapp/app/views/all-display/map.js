function(doc) {
	if ( doc._id.substr(0, 12) === "job:display:" ) {
		emit( [doc["Due Date"],doc.Status,doc["Job Number"]],{
			"status": doc.Status,
			"customer": doc["Company"],
			"qty": doc["Quantity"],
			"prodt": doc["Production Hours"]
		});
	}
};
