/* 
 * @author Gigi Ho
 * 
 */

var PreviewView = function(container, model) {
	this.canvas = container.find('.canvas');
	this.title = container.find('.title');
	this.thumbnailContainer = container.find(".thumbnails_container");


	this.curStoryPage = model.getPageByIdx(1); //current page being shown on big canvas. default is page 1.

	// Public functions
	this.showView = function() {
		$(container).show();
	};
	this.hideView = function() {
		$(container).hide();
	};

	this.loadStoryPage = function(pageIdx) {
		this.curStoryPage = model.getPageByIdx(pageIdx);

		this.updateCanvas();

		//TODO:update paging

	};

	this.updateTitle = function() {
		this.title.text(model.getTitle());
		// alert("update Title in preview! "+model.getTitle());
	};

	/**
	 * @description this function will update the current story page being shown on canvas
	 */
	this.updateCanvas = function() {
		PreviewView.drawPageOnCanvas(this.canvas, this.curStoryPage);

	};


	// Thumbnails related
	this.addThumbnail = function(pageIdx) {
		var thumbnailDiv = PreviewView.createThumbnailDiv(pageIdx);
		this.thumbnailContainer.find(".page_thumbnail").eq(pageIdx - 1).after(thumbnailDiv); //insert after 

		//Also update following thumbnails page num
		this.updateAllThumbnailPageIdx();
	};

	this.removeThumbnail = function(pageIdx) {
		this.thumbnailContainer.find(".page_thumbnail").eq(pageIdx).remove(); //insert after 

		//Also update following thumbnails page num
		this.updateAllThumbnailPageIdx();
	};

	this.updateAllThumbnailPageIdx = function() {
		this.thumbnailContainer.find(".page_thumbnail").each(function(idx, element) {
			if (idx === 0) {
				$(element).find("label").text("Cover");
				$(element).attr("pb-idx", idx);
			} else {
				$(element).find("label").text(idx);
				$(element).attr("pb-idx", idx);
			}
		});
	};

	/**
	 * @description this function will update a specific thumbnail by pageIdx or all thumnails
	 */
	this.updateThumbnail = function(pageIdx) {
		if (!(pageIdx >= 0)) {
			throw("[PreviewView.updateThumnail] no specified pageIdx: " + pageIdx);
		}
		var page = model.getPageByIdx(pageIdx);
		var thumbnailDiv = this.thumbnailContainer.find(".page_thumbnail").eq(pageIdx); //get the child at pageIdx
		PreviewView.drawPageOnCanvas(thumbnailDiv.find(".canvas"), page);
	};

	this.updateAllThumbnails = function() {
		this.resetThumbnailContainer();

		var pages = model.getAllPages();
		for (var i in pages) {
			var thumbnailDiv = PreviewView.createThumbnailDiv(i);
			var eachPageModel = pages[i];
			PreviewView.drawPageOnCanvas(thumbnailDiv.find(".canvas"), eachPageModel);

			this.thumbnailContainer.append(thumbnailDiv);
		}
	};


	this.resetThumbnailContainer = function() {
		this.thumbnailContainer.empty();
	};



	//--- Constructor ---
	// Load story title
	this.updateTitle();


	// Load canvas content 
	this.updateCanvas();
	this.updateAllThumbnails();




	/*****************************************  
	 Observer implementation    
	 *****************************************/
	//Register an observer to the model
	model.addObserver(this);

	//This function gets called when there is a change at the model
	this.update = function(arg) {
		var classname = arg.constructor.name;
//		alert(classname);
		if (classname == "Page") {
			//page object is updated
			if (arg.getPageIdx() === this.curStoryPage.getPageIdx()) {
				this.updateCanvas();
			}
			this.updateThumbnail(arg.getPageIdx());

		} else if (classname == "PageComponent") {

		} else if (arg.tag == "addPage") {
			this.addThumbnail(arg.data.pageIdx);
		} else if (arg.tag == "removePage") {
			if (arg.data.pageIdx === this.curStoryPage.getPageIdx()) {
				this.loadStoryPage(arg.data.pageIdx - 1);
			}
			this.removeThumbnail(arg.data.pageIdx);
		} else if (arg == "setTitle") {
			this.updateTitle();
			
			//Also update cover page
			
			this.updateThumbnail(0);
		}

	};
};

/*--- Static functions ---*/
PreviewView.createThumbnailDiv = function(pageIdx) {
	var thumbnailWrapper = $("<li>").addClass("thumbnail page_thumbnail").attr("pb-idx", pageIdx);
	var thumbnailCanvas = $("<div>").addClass("canvas");

        var setCoverBtn = $("<input>").addClass("btn btn-xs btn_set_cover").attr("type", "button").val("Set as Cover");
	pageIdx = (pageIdx == 0) ? "Cover" : pageIdx;
	var thumbnailCaption = $("<label>").text(pageIdx);
        
        

	return thumbnailWrapper.append(thumbnailCanvas).append(setCoverBtn).append(thumbnailCaption);
};

//TODO: can be moved to a static method
PreviewView.drawPageOnCanvas = function(canvasElement, storyPage) {
	if (!$(canvasElement).hasClass("canvas")) {
		throw("PreviewView.drawPageOnCanvas: this is not a canvas");
	}

	canvasElement.empty(); //first clear this div

	var pageComponents = storyPage.getAllComponents();
	for (var key in pageComponents) {
		var eachComponentData = pageComponents[key];
		var componentDiv = $("<div>");
//			console.log(eachComponentData);

		// Set common styles
		componentDiv.css({
			"left": eachComponentData.pos[0] + "%",
			"top": eachComponentData.pos[1] + "%"
		});
		componentDiv.addClass("preview_item");

		//Set type-specific style
		if (eachComponentData.type === PageComponent.TYPE_BACKGROUND) {
			componentDiv.append($("<img>").attr("src", eachComponentData.image));
			componentDiv.addClass("canvas_item_bg");
		} else if (eachComponentData.type === PageComponent.TYPE_ITEM) {
			componentDiv.append($("<img>").attr("src", eachComponentData.image));
			componentDiv.addClass("canvas_item_props");
		} else if (eachComponentData.type === PageComponent.TYPE_TEXT) {
//				console.log(eachComponentData);
			componentDiv.css({
				"width": eachComponentData.size[0] + "%",
				"height": eachComponentData.size[1] + "%",
				"padding": PageComponent.TEXT_PADDING + "%"
			});
			componentDiv.addClass("canvas_item_text");
			componentDiv.append($("<textarea>").attr("readonly", "readonly").text(eachComponentData.text));
		}


		$(canvasElement).append(componentDiv);
	}
};

