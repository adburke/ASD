
$('#home').on('pageinit', function(){
	
});

$('#data-item').on('pageshow', function(){
	var typeArr = urlVars("=");
	var type = typeArr[1];
	console.log(type);
	$('.delete').on('click', function(){
		console.log('delete clicked');
		deleteItem(type);
		return false;
	});
	$('.edit').on('click', function(){
		console.log('edit clicked');
		editItem(type);
		return false;
	});
});

$('#data-items').on('pageshow', function(){
	console.log("data items fired");
	var typeArr = urlVars("=");
	var type = typeArr[1];
	$("#dataButtons").controlgroup('refresh');
	//Remove events from buttons on pageshow so they do not duplicate between page changes
	$("#all" ).off();
	$("#closed").off();
	$("#open").off();
	
	//Click events to sort a category
	$("#all").on('click', function(){
		console.log("Display all");
		$.couch.db('jobapp').view('app/all-' + type, {
			success: function(data) {
				console.log(data);
				$('#dataDisplayList').empty();
				$.each(data.rows, function(index, data) {
					console.log(data);
					var status = (data.key[1] === 0) ? "OPEN" : "CLOSED";
					var due = (data.key[0]).join("/");
					var job = data.key[2];
					var customer = data.value.customer;
					var qty = data.value.qty;
					var prodt = data.value.prodt;
					var theme = (status === "OPEN" ) ? 'b' : 'a';
					$(
						'<li data-role="divider" data-theme=' + theme + ' id="jobDiv">' + 'Job #: ' + job  + '<span class="dividerMargin">'+ status + '</span>' + '<span class="dividerMargin">'+ "Due: " + due + '</span>' + '</li>' +
						'<li>' + '<a href=#data-item?item=' + data.id + '>' +
						'<p class="ui-li-desc">' + '<strong>' + customer + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
						'</a></li>'
						).appendTo('#dataDisplayList');
				});
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});
	$("#closed").on('click', function(){
		console.log("Display closed");
		$.couch.db('jobapp').view('app/all-' + type + '-status?startkey=[1,0]&endkey=[1,{}]' , {
			success: function(data) {
				console.log(data);
				$('#dataDisplayList').empty();
				$.each(data.rows, function(index, data) {
					console.log(data);
					var status = (data.key[0] === 0) ? "OPEN" : "CLOSED";
					var due = (data.value.due).join("/");
					var job = data.key[1];
					var customer = data.value.customer;
					var qty = data.value.qty;
					var prodt = data.value.prodt;
					var theme = (status === "OPEN" ) ? 'b' : 'a';
					$(
						'<li data-role="divider" data-theme=' + theme + ' id="jobDiv">' + 'Job #: ' + job  + '<span class="dividerMargin">'+ status + '</span>' + '<span class="dividerMargin">'+ "Due: " + due + '</span>' + '</li>' +
						'<li>' + '<a href=#data-item?item=' + data.id + '>' +
						'<p class="ui-li-desc">' + '<strong>' + customer + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
						'</a></li>'
						).appendTo('#dataDisplayList');
				});
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});
	$("#open").on('click', function(){
		console.log("Display open");
		$.couch.db('jobapp').view('app/all-' + type + '-status?startkey=[0,0]&endkey=[0,{}]', {
			success: function(data) {
				console.log(data);
				$('#dataDisplayList').empty();
				$.each(data.rows, function(index, data) {
					console.log(data);
					var status = (data.key[0] === 0) ? "OPEN" : "CLOSED";
					var due = (data.value.due).join("/");
					var job = data.key[1];
					var customer = data.value.customer;
					var qty = data.value.qty;
					var prodt = data.value.prodt;
					var theme = (status === "OPEN" ) ? 'b' : 'a';
					$(
						'<li data-role="divider" data-theme=' + theme + ' id="jobDiv">' + 'Job #: ' + job  + '<span class="dividerMargin">'+ status + '</span>' + '<span class="dividerMargin">'+ "Due: " + due + '</span>' + '</li>' +
						'<li>' + '<a href=#data-item?item=' + data.id + '>' +
						'<p class="ui-li-desc">' + '<strong>' + customer + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
						'</a></li>'
						).appendTo('#dataDisplayList');
				});
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});
});

var urlVars = function(splitVal){
	var urlData = $.mobile.path.parseUrl(window.location.href);
	var type = urlData.hash.split(splitVal);
	console.log(urlData);
	console.log(type);
	return type;
}
	
$('#addItem').on('pageinit', function(){
	// Enables validator debug messages. Used to test the rules: I created.
	// jQuery.validator.setDefaults({
	// 	debug: true,
	// 	success: "valid"
	// });;

	// Injects current date as default for order date on form
	var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var dateVal = myDate.getFullYear() + '-' + month + '-' + myDate.getDate();
    $("#orderdate").val(dateVal);
    // Hides or shows custom textarea on select
    if ($("#custom").val()){
    	$('#customContain').show();
    } else {
    	$('#customContain').hide();
    }
    $('#jobTypeList').change(function() {
		console.log("fired");
		if ($("#jobTypeList").val() === "Custom") {
			$('#customContain').show();

		} else {
			$('#customContain').hide();

		}
	});
    
	var myForm = $('#jobForm'),
		errorsLink = $("#errorsLink");
	var validator = myForm.validate({
		rules: {
			"jobTypeList" : {
				required: true
			},
			custom: {
				required: function(element) {
					return ($("#jobTypeList").val() === "Custom");
				}
			},
			qty: {
				required: true,
				min: 1
			},
			production: {
				required: true,
				min: 1
			}
		},
			messages: {
				qty: { min: jQuery.format("Value greater than or equal to {0}.") },
				production: { min: jQuery.format("Value greater than or equal to {0}.")}

			},

		invalidHandler: function(form, validator) {
//			errorsLink.click();
			var html = "";
			for(var key in validator.submitted){
				var label = $('label[for^="'+ key +'"]').not("[generated]");
					//console.log(label.text());
				var legend = label.closest("fieldset").find(".ui-controlgroup-label");
				var fieldName = legend.length ? legend.text() : label.text();
				html += "<li>" + fieldName + "</li>";
			};
			$("#formErrors ul").html(html);
		},
		submitHandler: function(form) {
			saveData();
			form.reset();
		}
	});
	// Have reset button clear red validation messages from form created var validator
	// above to use for this
	$(".reset").on('click',function() {
		window.location.reload();
	});
	
	//any other code needed for addItem page goes here


});

// Listen for the page change events
$(document).on( "pagebeforechange", function( e, data ) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl( data.toPage ),
			re1 = /^#data-items/,
			re2 = /^#data-item/;
		if ( u.hash.search(re1) !== -1 ) {
			getCategory( u, data.options );
			e.preventDefault();
		} else if ( u.hash.search(re2) !== -1 ) {
			getItem( u, data.options );
			e.preventDefault();
		}
	}
});

var getItem = function ( urlObj, options ){
	var jobID = urlObj.hash.replace( /.*item=/, "" ),
	pageSelector = urlObj.hash.replace( /\?.*$/, "" ),
	$page = $( pageSelector ),
	$header = $page.children( ":jqmData(role=header)" )
	$content = $page.children( ":jqmData(role=content)" );
	
	var editLink = "<div class='ui-grid-a'><div class='ui-block-a'><a class='edit' data-role='button' data-theme='b' data-icon='plus' href='#'>Edit</a></div>";
	var deleteLink = "<div class='ui-block-b'><a class='delete' data-role='button' data-theme='b' data-icon='minus' href='#'>Delete</a></div></div>";
	
	$('#jobDisplay').empty();
	$.couch.db('jobapp').openDoc(jobID, {
		success: function(data) {
			console.log(data);
			
			$(		'<div id=itemInfo>' +
					'<p class="ui-li-aside ui-li-desc">'+ "Due: " + data["Due Date"] + '</p>' +
					'<p class="ui-li-desc">' + '<strong>' + data["Company"] + '</strong>' + '</p>' +
					'<p class="ui-li-desc">' + "Order Quantity: " + data["Quantity"] + '</p>' +
					'<p class="ui-li-desc">' + " Est. Production Time: " + data["Production Hours"] + "hrs" + '</p>' +
					'</div>'
				).appendTo('#jobDisplay');
			$('#jobDisplay').find('#itemInfo');
			$('#itemInfo').append(editLink + deleteLink);
			$('#jobDisplay').find( ":jqmData(role=button)" ).button();
		}
		
	});
	
	$page.page();
	$('#jobDisplay').find( ":jqmData(role=button)" ).button();
	options.dataUrl = urlObj.href;
	$.mobile.changePage( $page, options );
};

var getCategory = function( urlObj, options ){
	var categoryName = urlObj.hash.replace( /.*category=/, "" ),
		pageSelector = urlObj.hash.replace( /\?.*$/, "" ),
		// Get the page we are going to dump our content into
		$page = $( pageSelector ),
		// Get the header for the page.
		$header = $page.children( ":jqmData(role=header)" )
		// Get the content area element for the page.
		$content = $page.children( ":jqmData(role=content)" );
		
		console.log("cat: " + categoryName);
		console.log("page: " + pageSelector);
		
	
	$.couch.db('jobapp').view('app/all-' + categoryName, {
		success: function(data) {
			console.log(data);
			$('#dataDisplayList').empty();
			$.each(data.rows, function(index, data) {
				console.log(data);
				var status = (data.key[1] === 0) ? "OPEN" : "CLOSED";
				var due = (data.key[0]).join("/");
				var job = data.key[2];
				var customer = data.value.customer;
				var qty = data.value.qty;
				var prodt = data.value.prodt;
				var theme = (status === "OPEN" ) ? 'b' : 'a';
				$(
					'<li data-role="divider" id="jobDiv">' + 'Job #: ' + job  + '<span class="dividerMargin">'+ status + '</span>' + '<span class="dividerMargin">'+ "Due: " + due + '</span>' + '</li>'
				).appendTo('#dataDisplayList').attr('data-theme', theme);
				$(
					'<li><a href=#data-item?item=' + data.id + '>' +
					'<p class="ui-li-desc">' + '<strong>' + customer + '</strong>' + '</p>' +
					'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
					'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
					'</a></li>'
				).appendTo('#dataDisplayList');
			});
			$('#dataDisplayList').listview('refresh');
		}
	});
	
	if(categoryName === "Jobs"){
//		$("#all").hide();
		$("#data-items").find("h1").html("All Jobs");
	}else {
		$("#all").show();
		$("#data-items").find("h1").html( categoryName + " Jobs");
	}
		// Pages are lazily enhanced. We call page() on the page
		// element to make sure it is always enhanced before we
		// attempt to enhance the listview markup we just injected.
		// Subsequent calls to page() are ignored since a page/widget
		// can only be enhanced once.
		$page.page();
		// Enhance what we just injected.
		$content.find( ":jqmData(role=collapsible-set)" ).collapsibleset();
		$content.find( ":jqmData(role=listview)" ).listview();
		$content.find( ":jqmData(role=button)" ).button();
		$content.find( ":jqmData(role=controlgroup)" ).controlgroup();
		
		// We don't want the data-url of the page we just modified
		// to be the url that shows up in the browser's location field,
		// so set the dataUrl option to the URL for the category
		// we just loaded.
		options.dataUrl = urlObj.href;

		// Now call changePage() and tell it to switch to
		// the page we just modified.
		$.mobile.changePage( $page, options );

};

var jobCount = function (value){
	
};

var saveData = function(){
	// Random key number for each job object
	// Check to see if we are editing an existing item or it is a new item.
	console.log("Start saveData");
	var docIdArr = urlVars("_");
	console.log(docIdArr);
	
	
	// Get all of the form data and create an object out of it
//	var jobFormData	= {};
//		jobFormData["Job Number"] 		= $("#jobnum").val();
//		jobFormData["Company"]	  		= $("#company").val();
//		jobFormData["Address"]			= $("#address").val();
//		jobFormData["City"]				= $("#city").val();
//		jobFormData["State"]			= $("#state").val();
//		jobFormData["Zipcode"]			= $("#zipcode").val();
//		jobFormData["Phone"]			= $("#phone").val();
//		jobFormData["Email"]			= $("#email").val();
//		jobFormData["Order Date"]		= $("#orderdate").val();
//		jobFormData["Need Date"]		= $("#needbydate").val();
//		jobFormData["Rush Order"]		= $('input:radio[name=rush]:checked').val();
//		jobFormData["Job Type"]			= $("#jobTypeList").val();
//		jobFormData["Custom Info"]		= $("#custom").val();
//		jobFormData["Quantity"]			= $("#qty").val();
//		jobFormData["Production Hours"]	= $("#production").val();
//		jobFormData["Design Effort"]	= $("#slider-fill").val();

	console.log("End saveData");
};

var	deleteItem = function (docId){
	$.couch.db("jobapp").openDoc(docId, {
		success: function(data) {
			var re = /.*:/
			rev = data._rev
			jobNum = (data._id).replace(re, "");
			var doc = {"_id": data._id, "_rev": data._rev};
			var ask = confirm("Are you sure you want to delete job #:" + jobNum + " ?");
			if(ask){
				$.couch.db("jobapp").removeDoc(doc, {
					success: function(data) {
						console.log(data);
						var begin = (data.id).indexOf(':') + 1;
						var end = (data.id).lastIndexOf(':');
						$.mobile.changePage("#data-items?category=" + (data.id).slice(begin,end));
					}
				});
			} else{
				alert("Job #:" + jobNum + " was NOT deleted.");
			}
		}
	});
};

var editItem = function (docId){
	console.log(docId);
	$.couch.db("jobapp").openDoc(docId , {
		success: function(data) {
			console.log(data);
			var rev = data._rev;
			console.log(docId + rev);
			var re = /.*:/
			var jobNum = (data._id).replace(re, "");
			var doc = {"_id": data._id, "_rev": data._rev}; 
			console.log(jobNum);
			$.mobile.changePage( "#addItem", {dataUrl: data._id + "_" + data._rev} );
			$("#jobnum").val(jobNum);
			$("#company").val(data.Company);
			$("#address").val(data.Address);
			$("#city").val(data.City);
			$("#state").val(data.State);
			$("#zipcode").val(data.Zipcode);
			$("#phone").val(data.Phone);
			$("#email").val(data.Email);
			$("#orderdate").val((data["Order Date"]).join("-"));
			$("#needbydate").val((data["Due Date"]).join("-"));
			$('input:radio[name=rush]:checked').val(data["Rush Order"]);
			$("#jobTypeList").val(data["Job Type"]);
			$("#custom").val(data["Custom Info"]);
			$("#qty").val(data.Quantity);
			$("#production").val(data["Production Hours"]);
			$("#slider-fill").val(data["Design Effort"]);
			$('select').selectmenu('refresh', true);
			console.log("ran editItem");
		}
	});
};

// Function I wrote to mimic my json data from a CSV file - returns an object of objects in this case
var csvToObject = function(data){
		var obj = {};
		var values = [];

		var rows = data.split('\r');
		// console.log(rows);

		var keys = rows[0].split(';');
		// console.log(keys);

		for(var l=1, m=rows.length; l<m;l++){
			values.push(rows[l].split(';'));
		}
		// console.log(values);

		re = /\,(\w|\w)/; // Test for , separator for sub array
		for(var i=0, j=values.length; i<j;i++){
			// console.log(values[i]);
			var newObj = {};
			for(var k=0, l=values[i].length; k<l; k++){
				// console.log(values[i][k]);
				if(re.test(values[i][k]) ){
					// console.log(values[i][k] + ' : ' + re.test(values[i][k]));
					var subArr = values[i][k].split(',');
					// console.log(subArr);
					values[i][k] = subArr;
					// console.log(values[i]);
				}
				newObj[keys[k]] = values[i][k];
			}
			var key = values[i][0];
			obj[key] = newObj;
		}
		// console.log(values);
		// console.log(obj);
		return obj;
};;