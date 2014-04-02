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
		$("#step1").addClass("active");
		$("#step2").removeClass("active");
		$("#step3").removeClass("active");
		/*show the bg menu by defult first*/
		//$("#icon_bg div").attr("id", "editDefultDiv");
		$("#icon_bg img").attr("id", "editDefultImg");

		App.editView.showView();
	},
	gotoPreviewPage: function() {
		App.resetPage();
		//$("#start").hide();
		$("#linkToLand").show(200);
		$("#step1").removeClass("active");
		$("#step2").addClass("active");
		$("#step3").removeClass("active");
		App.previewView.showView();
	},
	gotoOrderPage: function() {
		App.resetPage();
		//$("#start").hide();
		$("#linkToLand").show(200);
		$("#step1").removeClass("active");
		$("#step2").removeClass("active");
		$("#step3").addClass("active");
		App.orderView.showView();
	}

};



$(document).ready(function() {
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
		
			
			alert("Hello " + document.forms["orderForm"]["fullName"].value + ", thank you for ordering! I think you'd really enjoy your book  but sadly you wont get one just yet since we are still developing our service :)" 
			 );
	});

});


