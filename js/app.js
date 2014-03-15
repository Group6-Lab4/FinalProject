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
	gotoHomePage: function() {
		App.resetPage();
		App.homeView.showView();
	},
	gotoEditPage: function() {
		App.resetPage();
                $("#step1").addClass("active");
                $("#step2").removeClass("active");
                $("#step3").removeClass("active");
                
		App.editView.showView();
	},
	gotoPreviewPage: function() {
		App.resetPage();
                $("#step1").removeClass("active");
                $("#step2").addClass("active");
                $("#step3").removeClass("active");
		App.previewView.showView();
	},
	gotoOrderPage: function() {
		App.resetPage();
                $("#step1").removeClass("active");
                $("#step2").removeClass("active");
                $("#step3").addClass("active");
		App.orderView.showView();
	}

};


$(document).ready(function() {
	var model = new StoryModel();

	//model method calls example
	console.log("StoryModel.title:" + model.getTitle());
	console.log("StoryModel.pages:" + model.getAllPages());

	// Init all views
	App.homeView = new HomeView($("#homeView"), model);
	App.editView = new EditView($("#editView"), model);
	App.previewView = new PreviewView($("#previewView"), model);
	App.orderView = new OrderView($("#orderView"), model);

	// Init all controllers
	
	

	// Go to the first page according the url param 'p'
	var targetPage = Utils.getURLParam("p");
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


