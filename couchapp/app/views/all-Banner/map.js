function(doc) {
	if ( doc._id.substr(0, 11) === "job:banner:" ) {
		emit( [doc["Job Number"],doc["Due Date"],doc.Status],{
			"status": doc.Status,
			"customer": doc["Company"],
			"qty": doc["Quantity"],
			"prodt": doc["Production Hours"]
		});
	}
};
