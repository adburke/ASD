function(doc) {
	if ( doc._id.substr(0, 4) === "job:" ) {
		emit( [doc["Due Date"],doc.Status,doc["Job Number"]],{
			"status": doc.Status,
			"customer": doc["Company"],
			"qty": doc["Quantity"],
			"prodt": doc["Production Hours"]
		});
	}
};

  