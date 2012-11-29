
$('#home').on('pageinit', function(){
	
});

$('#data-items').on('pageinit', function(){
	$('#dataDisplayList').empty();
	$("#json").on('click', function(){
		console.log("Display json");
		$.ajax({
			url: 'xhr/data.json',
			type: 'GET',
			dataType: 'json',
			success: function(r){
				console.log(r);
				$('#dataDisplayList').empty();
				for(var n in r){
					var obj = r[n];
					$(
						'<li data-role="list-divider">' + '#: ' + n + '</li>' +
						'<li>' +
						'<p class="ui-li-aside ui-li-desc">'+ "Due: " + obj["Need Date"] + '</p>' +
						'<p class="ui-li-desc">' + '<strong>' + obj["Job Type"] + " Job for " + obj["Company"] + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + obj["Quantity"] + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + obj["Production Hours"] + "hrs" + '</p>' +
						'</li>'
					).appendTo('#dataDisplayList');
				}
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});

	$("#xml").on('click', function(){
		console.log("Display xml");
		$.ajax({
			url: 'xhr/data.xml',
			type: 'GET',
			dataType: 'xml',
			success: function(r){
				$('#dataDisplayList').empty();
				var jobs = $( r );
				jobs.find("job").each(function(){
					var job = $(this);
					console.log("Company: ", job.find("number").text());
					$(
						'<li data-role="list-divider">' + '#: ' + job.find("number").text() + '</li>' +
						'<li>' +
						'<p class="ui-li-aside ui-li-desc">'+ "Due: " + job.find("due").text() + '</p>' +
						'<p class="ui-li-desc">' + '<strong>' + job.find("type").text() + " Job for " + job.find("company").text() + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + job.find("qty").text() + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + job.find("prodhours").text() + "hrs" + '</p>' +
						'</li>'
					).appendTo('#dataDisplayList');
				});
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});

	$("#yaml").on('click', function(){
		console.log("Display yaml");
		$.ajax({
			url: 'xhr/data.yml',
			type: 'GET',
			dataType: 'text',
			success: function(r){
				// console.log(r);
				var yml = jsyaml.load(r);
				console.log(yml);
				$('#dataDisplayList').empty();
				for(var n in yml){
					var obj = yml[n];
					$(
						'<li data-role="list-divider">' + '#: ' + n + '</li>' +
						'<li>' +
						'<p class="ui-li-aside ui-li-desc">'+ "Due: " + obj["due"].getFullYear() + '-' + (obj["due"].getMonth()+1) + '-' + (obj["due"].getDate()+1) + '</p>' +
						'<p class="ui-li-desc">' + '<strong>' + obj["type"] + " Job for " + obj["company"] + '</strong>' + '</p>' +
						'<p class="ui-li-desc">' + "Order Quantity: " + obj["qty"] + '</p>' +
						'<p class="ui-li-desc">' + " Est. Production Time: " + obj["prodhours"] + "hrs" + '</p>' +
						'</li>'
					).appendTo('#dataDisplayList');
				}
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});

	$("#csv").on('click', function(){
		console.log("Display csv");
		$.ajax({
			url: 'xhr/data.csv',
			type: 'GET',
			dataType: 'json',
			success: function(r){
				console.log(r);
				$('#dataDisplayList').empty();
				$(
					
				).appendTo('#dataDisplayList');
				$('#dataDisplayList').listview('refresh');
			}
		});
		return false;
	});
});
$('#storage-items').on('pageinit', function(){
	
});
	
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


	var jobNumCount;
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
			storeData($("#jobnum").val());
			form.reset();
			jobCount();
		}
	});
	// Have reset button clear red validation messages from form created var validator
	// above to use for this
	$(".reset").on('click',function() {
		window.location.reload();
	});
	
	//any other code needed for addItem page goes here

	jobCount($("#jobnum").val());

	$("#clearData").on('click',function() {
		clearLocal();
		window.location.reload();
	});
});

// Listen for the page change events by the Browse By buttons on index.html
$(document).on( "pagebeforechange", function( e, data ) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl( data.toPage ),
			re = /^#storage-items/;
		if ( u.hash.search(re) !== -1 ) {
			// We're being asked to display the items for a specific category.
			// Call our internal method that builds the content for the category
			// on the fly based on our in-memory category data structure.
			getData( u, data.options );
			// Make sure to tell changePage() we've handled this call so it doesn't
			// have to do anything.
			e.preventDefault();
		}
	}
});

var autoFillData = function (){
	for(var n in json){
		var id = n;
		localStorage.setItem(id, JSON.stringify(json[n]));
	}
};

//The functions below can go inside or outside the pageinit function for the page in which it is needed.
// Function that populates the Browse By categories from localStorage
var getData = function( urlObj, options ){
	var categoryName = urlObj.hash.replace( /.*category=/, "" ),
		pageSelector = urlObj.hash.replace( /\?.*$/, "" ),
		// Get the page we are going to dump our content into
		$page = $( pageSelector ),

		// Get the header for the page.
		$header = $page.children( ":jqmData(role=header)" ),

		// Get the content area element for the page.
		$content = $page.children( ":jqmData(role=content)" );
		
		collapseSet = "<div id='jobs' data-role='collapsible-set' data-content-theme='b'>",
		markup = "";

		console.log("cat: " + categoryName);
		console.log("page: " + pageSelector);
	
	if (localStorage.length === 1 && localStorage.getItem("jobNumber")){
		alert("Local Storage does not contain any jobs. Adding job test data.");
		autoFillData();
	}
	
	var keyArray = [];
	for(var i = 0, j = localStorage.length; i < j; i++){
		if(Number(localStorage.key(i))/1 === Number(localStorage.key(i))){
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var localData = JSON.parse(value);
			//console.log(localData);
			var editLink = "<div class='ui-grid-a'><div class='ui-block-a'><a class='edit' data-role='button' data-theme='b' data-icon='plus' href='#'>Edit Job</a></div>";
			var deleteLink = "<div class='ui-block-b'><a class='delete' data-role='button' data-theme='b' data-icon='minus' href='#'>Delete Job</a></div></div>";
			
			if (categoryName === localData["jobType"][1] ){
				keyArray.push(key);
				markup += "<div id='jobUni' data-role='collapsible' data-inset='true'><h3>" + "#: " + localData["jobNum"][1] + "</h3><ul data-role='listview' data-inset='true'>";
				for(var n in localData){
					var object = localData[n];
					//console.log(localData);
					markup += "<li>" + object[0] + ": " +object[1] + "</li>";
				}
				markup += "</ul>" + editLink + deleteLink + "</div>";

			} else if ( categoryName === "displayAll"){
				keyArray.push(key);
				markup += "<div id='jobUni' data-role='collapsible' data-inset='true'><h3>" + "#: " + localData["jobNum"][1] + "</h3><ul data-role='listview' data-inset='true'>";
				for(var n in localData){
					var object = localData[n];
					//console.log(localData);
					markup += "<li>" + object[0] + ": " +object[1] + "</li>";
				}
				markup += "</ul>" + editLink + deleteLink + "</div>";
			}
		}
	}
	markup +="</div></ul>";
		// Find the h1 element in our header and inject the name of the category into it.
	if (categoryName != "displayAll"){
		$header.find( "h1" ).html(categoryName + " Jobs");
	} else {
		$header.find( "h1" ).html("All Jobs");
	}
	$content.html( collapseSet + markup);
	
	$('.delete').each(function(i){
		this.key = keyArray[i];
		$(this).on("click", deleteItem);
	});

	$('.edit').each(function(i){
		this.key = keyArray[i];
		$(this).on("click", editItem);
	});
	

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
	console.log("Start jobCount");
	console.log("jobCount value:");
	console.log(value);
	console.log(localStorage.getItem("jobNumber"));
	if (localStorage.getItem("jobNumber") !== value && value !== "" && value !== undefined ){
		console.log("First if jobCount");
	} else if (localStorage.getItem("jobNumber")) {
		jobNumCount = localStorage["jobNumber"];
		$("#jobnum").val(Number(jobNumCount));
		console.log("Second if jobCount");
	} else {
		jobNumCount = 1000;
		localStorage.setItem("jobNumber", jobNumCount.toString());
		$("#jobnum").val(jobNumCount);
		console.log("Third if jobCount");
	};
	console.log("End jobCount");
};

var storeData = function(key){
	// Random key number for each job object
	// Check to see if we are editing an existing item or it is a new item.
	console.log("Start storeData");
	console.log("storeData key:");
	console.log(key);
	if (!key || key === undefined){
		var id = jobNumCount;
		var num = Number($("#jobnum").val())+1;
		localStorage["jobNumber"] = num.toString();
	} else {
		var id = key;
		
	}
	// Get Radio button status
	// getSelectedRadio();
	// Get all of the form data and create an object out of it
	var jobFormData				= {};
		jobFormData.jobNum		= ["Job Num", $("#jobnum").val()];
		jobFormData.company		= ["Company", $("#company").val()];
		jobFormData.address		= ["Address", $("#address").val()];
		jobFormData.city		= ["City", $("#city").val()];
		jobFormData.state		= ["State", $("#state").val()];
		jobFormData.zipcode		= ["Zipcode", $("#zipcode").val()];
		jobFormData.phone		= ["Phone", $("#phone").val()];
		jobFormData.email		= ["Email", $("#email").val()];
		jobFormData.oDate		= ["Order Date", $("#orderdate").val()];
		jobFormData.needDate	= ["Need Date", $("#needbydate").val()];
		jobFormData.rushOrder	= ["Rush Order", $('input:radio[name=rush]:checked').val()];
		jobFormData.jobType		= ["Job Type", $("#jobTypeList").val()];
		jobFormData.customInfo	= ["Custom Info", $("#custom").val()];
		jobFormData.quantity	= ["Quantity", $("#qty").val()];
		jobFormData.prodHours	= ["Production Hours", $("#production").val()];
		jobFormData.designEff	= ["Design Effort", $("#slider-fill").val()];

	localStorage.setItem(id, JSON.stringify(jobFormData));
	if (!key || key === undefined){
		alert("Job #: " + jobNumCount + " Saved");
	} else {
		alert("Job #: " + key + " Saved");
	}
	jobCount();
	console.log("End storeData");
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

