/* 
 * @author Gigi Ho
 * @desc app.js is act to be the main controller of this web app
 */

//App is a static class global vars and methods
var App = {
	homeView: undefined,
	editView: undefined,
	previewView: undefined,
	orderView: undefined,
	resetPage: function() {
		App.homeView.hideView();
		App.editView.hideView();
		App.previewView.hideView();
		App.orderView.hideView();
	},
	// Page flow functions
	gotoPage: function(targetPage) {
		switch (targetPage) {
			case "edit":
				App.gotoEditPage();
				break;
			case "preview":
				App.gotoPreviewPage();
				break;
			case "order":
				App.gotoOrderPage();
				break;
			default:
				App.gotoHomePage();
				break;
		}
	},
	gotoHomePage: function() {
		App.resetPage();
		$("#step1").hide(200);
		$("#step2").hide(200);
		$("#step3").hide(200);
		$("#linkToLand").hide(200);
	//	$("#start").show(200);

		App.homeView.showView();
	},
	gotoEditPage: function() {
		App.resetPage();
		//$("#start").hide();
		$("#step1").show(200);
		$("#step2").show(200);
		$("#step3").show(200);
		$("#linkToLand").show(200);
		$("#step1>a").addClass("active");
		$(".navbar-item-create:after").attr("content","create");
		$("#step2>a").removeClass("active");
		$("#step3>a").removeClass("active");
		/*show the bg menu by defult first*/
		//$("#icon_bg div").attr("id", "editDefultDiv");
		$("#icon_bg img").attr("id", "editDefultImg");

		App.editView.showView();
	},
	gotoPreviewPage: function() {
		App.resetPage();
		//$("#start").hide();
		$("#linkToLand").show(200);
		$("#step1>a").removeClass("active");
		$("#step2>a").addClass("active");
		$("#step3>a").removeClass("active");
		App.previewView.showView();
	},
	gotoOrderPage: function() {
		App.resetPage();
		//$("#start").hide();
		$("#linkToLand").show(200);
		$("#step1>a").removeClass("active");
		$("#step2>a").removeClass("active");
		$("#step3>a").addClass("active");
		App.orderView.showView();
	}

};

$(document).ready(function(){
	
	var model = new StoryModel();
	App.model = model; //just to expose it to the world

	// Init all views
	App.homeView = new HomeView($("#homeView"), model);
	App.editView = new EditView($("#editView"), model);
	App.previewView = new PreviewView($("#previewView"), model);
	App.orderView = new OrderView($("#orderView"), model);

	// Init all controllers
	var homeViewController = new HomeViewController(App.homeView, model);
	var editViewController = new EditViewController(App.editView, model);
	var previewViewController = new PreviewViewController(App.previewView, model);
	var orderViewController = new OrderViewController(App.orderView, model);


	// Go to the first page according the url hash
	var targetPage = Utils.getURLHash(); //Utils.getURLParam("p");
	App.gotoPage(targetPage);


	$(".loadPage").on("click", function() {
		var targetPage = $(this).attr("href").substring(1); //Utils.getURLHash();
		switch (targetPage) {
			case "edit":
				App.gotoEditPage();
				break;
			case "preview":
				App.gotoPreviewPage();
				break;
			case "order":
				App.gotoOrderPage();
				break;
			default:
				App.gotoHomePage();
				break;
		}
	});
	
	$("#orderForm").submit(function(ev){
			
		ev.preventDefault();
		$("#orderForm input[type=submit]").val("Submitting... Please wait");
		
		//alert($(this).find("input[name=tel]").val());
		var data2send = { 
			name: $(this).find("input[name=fullName]").val(), 
			exp_mail: $(this).find("input[name=email]").val(), 
			content: $(this).find("textarea[name=message]").val()
			//telephone: $(this).find("input[name=tel]").val(), 
			//street: $(this).find("input[name=street]").val(), 
			//co: $(this).find("input[name=co]").val(), 
			//postal_code: $(this).find("input[name=postalCode]").val(), 
			//city: $(this).find("input[name=city]").val(), 
			//country: $(this).find("input[name=country]").val() 
		};
		$.ajax({
			type: 'POST',
			url: 'http://poppibook.com:8080/NewsAppServer/rest/json/poppimail',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data : JSON.stringify(data2send),
			success: function(data) {
				var status = data.mail_info;
				if(status === "ERR_EMPTY"){
					$("#orderForm input[type=submit]").val("Not sent - Please check every field");
					$("#orderForm input[type=submit]").removeClass( "btn-success" ).addClass( "btn-warning" );
					setTimeout(function() 
							{
						$("#orderForm input[type=submit]").val("Submit");
						$("#orderForm input[type=submit]").removeClass( "btn-warning").addClass( "btn-success" );
							}, 3000);	
				}
				else if(status === "ERR_MAIL"){
					$("#orderForm input[type=submit]").val("Not sent - Incorrect email address");
					$("#orderForm input[type=submit]").removeClass( "btn-success" ).addClass( "btn-warning" );
					setTimeout(function() 
							{
						$("#orderForm input[type=submit]").val("Submit");
						$("#orderForm input[type=submit]").removeClass( "btn-warning").addClass( "btn-success" );
							}, 3000);	
				}
				else if(status === "ALL_OK"){
					$("#orderForm input[type=submit]").val("Message received, thank you!");
					$("#orderForm input[type=submit]").attr('disabled', 'disabled');
					$("#orderForm input[type=submit]").removeClass( "btn-warning").addClass( "btn-success" );
				}
			},
			error: function (header, status, error) {
				$("#orderForm input[type=submit]").val("Not sent - Connection error");
				$("#orderForm input[type=submit]").removeClass( "btn-success" ).addClass( "btn-warning" );
				setTimeout(function() 
						{
					$("#orderForm input[type=submit]").val("Submit");
					$("#orderForm input[type=submit]").removeClass( "btn-warning").addClass( "btn-success" );
						}, 7000);	
			},
			timeout: 20000});
			
			//alert("Hello " + document.forms["orderForm"]["fullName"].value + ", thank you for ordering! I think you'd really enjoy your book  but sadly you wont get one just yet since we are still developing our service :)" );
	});

});


