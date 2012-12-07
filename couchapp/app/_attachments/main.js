
$('#home').on('pageinit', function(){
	
});

$('#data-items').on('pageshow', function(e){
	console.log("data items fired");
	var type = urlVars();

	$("#dataButtons").controlgroup('refresh');
	//Remove events from buttons on pageshow so they do not duplicate between page changes
	$("#all" ).off();
	$("#closed").off();
	$("#open").off();
	
	//Click events to sort a category
	$("#all").on('click', function(e){
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
					$(
						'<li data-role="list-divider">' + 'Job #: ' + job + '<p class="ui-li-aside ui-li-desc">'+ "Status: " + status + '</p>' + '</li>' +
						'<li>' +
						'<p class="ui-li-aside ui-li-desc">'+ "Due: " + due + '</p>' +
						'<p class="ui-li-desc">' + '<strong>' + " Customer: " + customer + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
						'</li>'
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
					$(
						'<li data-role="list-divider">' + 'Job #: ' + job + '<p class="ui-li-aside ui-li-desc">'+ "Status: " + status + '</p>' + '</li>' +
						'<li>' +
						'<p class="ui-li-aside ui-li-desc">'+ "Due: " + due + '</p>' +
						'<p class="ui-li-desc">' + '<strong>' + " Customer: " + customer + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
						'</li>'
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
					$(
						'<li data-role="list-divider">' + 'Job #: ' + job + '<p class="ui-li-aside ui-li-desc">'+ "Status: " + status + '</p>' + '</li>' +
						'<li>' +
						'<p class="ui-li-aside ui-li-desc">'+ "Due: " + due + '</p>' +
						'<p class="ui-li-desc">' + '<strong>' + " Customer: " + customer + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
						'</li>'
						).appendTo('#dataDisplayList');
				});
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});
});

var urlVars = function(){
	var urlData = $.mobile.path.parseUrl(window.location.href);
	var type = urlData.hash.split("=");
	console.log(urlData);
	console.log(type);
	return type[1];
}
	
$('#addItem').on('pageshow', function(){
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
			errorsLink.click();
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
			// var data = myForm.serializeArray();
			// console.log(data);
			saveData($("#jobnum").val());
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
				$(
					'<li data-role="list-divider">' + 'Job #: ' + job + '<p class="ui-li-aside ui-li-desc">'+ "Status: " + status + '</p>' + '</li>' +
					'<li>' +
					'<p class="ui-li-aside ui-li-desc">'+ "Due: " + due + '</p>' +
					'<p class="ui-li-desc">' + '<strong>' + " Customer: " + customer + '</strong>' + '</p>' +
					'<p class="ui-li-desc">' + "Order Quantity: " + qty + '</p>' +
					'<p class="ui-li-desc">' + " Est. Production Time: " + prodt + "hrs" + '</p>' +
					'</li>'
					).appendTo('#dataDisplayList');
			});
			$('#dataDisplayList').listview('refresh');
		}
	});

	$('.delete').each(function(i){
		this.key = keyArray[i];
		$(this).on("click", deleteItem);
	});

	$('.edit').each(function(i){
		this.key = keyArray[i];
		$(this).on("click", editItem);
	});
	if(categoryName === "Jobs"){
		$("#all").hide();
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

var saveData = function(key){
	// Random key number for each job object
	// Check to see if we are editing an existing item or it is a new item.
	console.log("Start saveData");
	console.log("saveData key:");
	
	// Get all of the form data and create an object out of it
	var jobFormData	= {};
		jobFormData["Job Number"] 		= $("#jobnum").val();
		jobFormData["Company"]	  		= $("#company").val();
		jobFormData["Address"]			= $("#address").val();
		jobFormData["City"]				= $("#city").val();
		jobFormData["State"]			= $("#state").val();
		jobFormData["Zipcode"]			= $("#zipcode").val();
		jobFormData["Phone"]			= $("#phone").val();
		jobFormData["Email"]			= $("#email").val();
		jobFormData["Order Date"]		= $("#orderdate").val();
		jobFormData["Need Date"]		= $("#needbydate").val();
		jobFormData["Rush Order"]		= $('input:radio[name=rush]:checked').val();
		jobFormData["Job Type"]			= $("#jobTypeList").val();
		jobFormData["Custom Info"]		= $("#custom").val();
		jobFormData["Quantity"]			= $("#qty").val();
		jobFormData["Production Hours"]	= $("#production").val();
		jobFormData["Design Effort"]	= $("#slider-fill").val();

	console.log("End saveData");
};

var	deleteItem = function (){
	var ask = confirm("Are you sure you want to delete this job?");
	if(ask){
		console.log(this.key);
		localStorage.removeItem(this.key);
		alert("Job was deleted!");
		$(this).parents().filter('#jobUni').remove();
		$( "#jobs" ).collapsibleset( "refresh" );
	} else{
		alert("Job was NOT deleted.");
	}
};

var editItem = function (){
	// Grab the data from our item from local storage
	var value = localStorage.getItem(this.key);
	var jobFormData = JSON.parse(value);
	console.log(value);
	$.mobile.changePage( "#addItem");
	$("#jobnum").val(jobFormData.jobNum[1]);
	$("#company").val(jobFormData.company[1]);
	$("#address").val(jobFormData.address[1]);
	$("#city").val(jobFormData.city[1]);
	$("#state").val(jobFormData.state[1]);
	$("#zipcode").val(jobFormData.zipcode[1]);
	$("#phone").val(jobFormData.phone[1]);
	$("#email").val(jobFormData.email[1]);
	$("#orderdate").val(jobFormData.oDate[1]);
	$("#needbydate").val(jobFormData.needDate[1]);
	$('input:radio[name=rush]:checked').val(jobFormData.rushOrder[1]);
	$("#jobTypeList").val(jobFormData.jobType[1]);
	$("#custom").val(jobFormData.customInfo[1]);
	$("#qty").val(jobFormData.quantity[1]);
	$("#production").val(jobFormData.prodHours[1]);
	$("#slider-fill").val(jobFormData.designEff[1]);
	$('select').selectmenu('refresh', true);
	console.log("ran editItem");
	
	
};
					
var clearLocal = function(){
	localStorage.clear();
	alert("All jobs deleted from local storage.");
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
};