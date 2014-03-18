/* 
 * @author Gigi Ho
 * 
 */

var PreviewView = function(container, model) {
	this.canvas = container.find('.canvas');
	this.curStoryPage; //current page being shown on big canvas
	this.title = container.find('.title');

	var thumbnailContainer = container.find(".thumbnails_container");

	if (model.getTitle() !== undefined) {
		this.title.text(model.getTitle());

	}
	// Public functions
	this.showView = function() {
		$(container).show();
	};
	this.hideView = function() {
		$(container).hide();
	};

	this.loadStoryPage = function(pageIdx) {
		this.curStoryPage = model.getPageByIdx(pageIdx);

		updateCanvas.call(this);

		//TODO:update paging

	};

	//--- Private functions ---
	this.updateTitle = function() {
		this.title.text(model.getTitle());
		// alert("update Title in preview! "+model.getTitle());
	};

	/**
	 * @description this function will update the current story page being shown on canvas
	 */
	var updateCanvas = function() {
		//first reset the canvas
		resetCanvas.call(this);

		var pageComponents = this.curStoryPage.getAllComponents();
		for (var key in pageComponents) {
			var eachComponentData = pageComponents[key];
			var componentDiv = $("<div>");
//			console.log(eachComponentData);

			if (eachComponentData.type === PageComponent.TYPE_BACKGROUND || eachComponentData.type === PageComponent.TYPE_ITEM) {
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			} else if (eachComponentData.type === PageComponent.TYPE_TEXT) {
//				console.log(eachComponentData);
				componentDiv.css({
					"width": eachComponentData.size[0] + "%",
					"height": eachComponentData.size[1] + "%",
					"padding": PageComponent.TEXT_PADDING + "%"
				});
				componentDiv.append($("<textarea>").attr("readonly", "readonly").text(eachComponentData.text));
			}

			componentDiv.css({
				"left": eachComponentData.pos[0] + "%",
				"top": eachComponentData.pos[1] + "%"
			});
			componentDiv.addClass("preview_item");

			this.canvas.append(componentDiv);
		}
	};

	var resetCanvas = function() {
		$(this.canvas).empty();
	};

	//TODO: can be moved to a static method
	var drawPageOn = function(element, storyPage) {
		element.empty(); //first clear this div

		var pageComponents = storyPage.getAllComponents();
		for (var key in pageComponents) {
			var eachComponentData = pageComponents[key];
			var componentDiv = $("<div>");
//			console.log(eachComponentData);

			if (eachComponentData.type === PageComponent.TYPE_BACKGROUND || eachComponentData.type === PageComponent.TYPE_ITEM) {
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			} else if (eachComponentData.type === PageComponent.TYPE_TEXT) {
//				console.log(eachComponentData);
				componentDiv.css({
					"width": eachComponentData.size[0] + "%",
					"height": eachComponentData.size[1] + "%",
					"padding": PageComponent.TEXT_PADDING + "%"
				});
				componentDiv.append($("<textarea>").attr("readonly", "readonly").text(eachComponentData.text));
			}

			componentDiv.css({
				"left": eachComponentData.pos[0] + "%",
				"top": eachComponentData.pos[1] + "%"
			});
			componentDiv.addClass("preview_item");

			$(element).append(componentDiv);
		}
	};


	var addThumbnail = function(pageIdx) {
		var thumbnailDiv = PreviewView.createThumbnailDiv();
		thumbnailContainer.find(".page_thumbnail").eq(pageIdx - 1).after(thumbnailDiv); //insert after 


	};

	/**
	 * @description this function will update a specific thumbnail by pageIdx or all thumnails
	 */
	var updateThumbnail = function(pageIdx) {
		if (!(pageIdx >= 0)) {
			throw("[PreviewView.updateThumnail] no specified pageIdx: " + pageIdx);
		}
		var page = model.getPageByIdx(pageIdx);
		var thumbnailDiv = thumbnailContainer.find(".page_thumbnail").eq(pageIdx); //get the child at pageIdx
		drawPageOn(thumbnailDiv, page);


	};

	var updateAllThumbnails = function() {
		resetThumbnailContainer();

		var pages = model.getAllPages();
		for (var i in pages) {
			var thumbnailDiv = PreviewView.createThumbnailDiv();
			var eachPageModel = pages[i];
			drawPageOn(thumbnailDiv, eachPageModel);

			thumbnailContainer.append(thumbnailDiv);
		}
	};

	var resetThumbnailContainer = function() {
		thumbnailContainer.empty();
	};



	//--- Constructor ---
	// Load story title
	/*if (model.getTitle() !== undefined) {
	 //		this.titleInput.val(model.getTitle());
	 }*/
	this.updateTitle();


	// Load story pages
	var pages = model.getAllPages();
	this.curStoryPage = pages[1]; // default the current page is page 0, i.e. cover page


	// Load canvas content 
	updateCanvas.call(this);
	updateAllThumbnails();




	/*****************************************  
	 Observer implementation    
	 *****************************************/
	//Register an observer to the model
	model.addObserver(this);

	//This function gets called when there is a change at the model
	this.update = function(arg) {
		var classname = arg.constructor.name;
//		alert("classname:" + classname);
		if (classname == "Page") {
			//page object is updated
//			console.log(this.canvas);
//			if(data === curStoryPage){ 
			if (arg.getPageIdx() === this.curStoryPage.getPageIdx()) {
				updateCanvas.call(this);
			}

			updateThumbnail.call(this, arg.getPageIdx());

		} else if (classname == "PageComponent") {

		} else if (arg.tag == "addPage") {
//			alert("newpage: " + arg.data.pageIdx);
			addThumbnail(arg.data.pageIdx);

		} else if (arg == "setTitle") {

			this.updateTitle();
		}

	};
};

PreviewView.createThumbnailDiv = function() {
	return $("<div>").addClass("thumbnail page_thumbnail");
};


