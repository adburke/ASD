function(doc) {
	if ( doc._id.substr(0, 10) === "job:decal:" ) {
		emit( [doc["Due Date"],doc.Status,doc["Job Number"]],{
			"status": doc.Status,
			"customer": doc["Company"],
			"qty": doc["Quantity"],
			"prodt": doc["Production Hours"]
		});
	}
};
