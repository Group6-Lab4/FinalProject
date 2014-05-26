/* 
 * @author Gigi Ho
 * 
 */

var EditView = function(containerObj, model) {
	this.container = containerObj;
	this.titleInput = this.container.find(".title");
	this.canvas = containerObj.find("#droppable_canvas");
	this.pagingContainer = containerObj.find(".dot_container");
	this.curStoryPage = model.getPageByIdx(1); //current page being shown on canvas, default is page 1, not cover

	this.createNavDot = function(pageIdx) {
		return $("<li>").attr("pb-idx", pageIdx).append("<a>");
	};


	// Load story title
	this.titleInput.val(model.getTitle());

	// Load story assets 

	// 1- Background assets
	var backgroundAssets = model.getAssetBackground();
	for (var i in backgroundAssets) {
		var eachAsset = backgroundAssets[i];
		var itemDiv = EditView.createAssetItem(PageComponent.TYPE_BACKGROUND, eachAsset);

		this.container.find("#cat_bgs").append(itemDiv);
	}

	// 2- items assets
	var itemAssets = model.getAssetItem(); //OR getAssetItemByCat()
	for (var i in itemAssets) {
		var eachAsset = itemAssets[i];
		var itemDiv = EditView.createAssetItem(PageComponent.TYPE_ITEM, eachAsset);

		this.container.find("#cat_items").append(itemDiv);
	}

	// Handle Paging
	this.container.find("#totalPageNum").text(model.getAllPages().length - 1);
	this.container.find("#currentPageIdx").text(this.curStoryPage.getPageIdx());


	/*--- Public functions ---*/
	this.loadStoryPage = function(pageIdx) {
		if (pageIdx >= model.getAllPages().length) {
			throw("EditView.loadStoryPage(): pageIdx is out of scope: " + pageIdx);
		}

		var totalPageNum = model.getAllPages().length - 1;
		this.curStoryPage = model.getPageByIdx(pageIdx);

		//update paging exclude cover page
		this.container.find("#currentPageIdx").text(pageIdx);
		this.container.find("#totalPageNum").text(model.getAllPages().length - 1);

		/*generate naviDots*/
		//clear dot container
		this.pagingContainer.empty();
		for (var i = 1; i <= totalPageNum; i++) {
			// Append dots
			var newNavDot = this.createNavDot(i);
			this.pagingContainer.append(newNavDot);
		}

		// Highlight current dot
		this.pagingContainer.find("li[pb-idx=" + pageIdx + "]").addClass("current");

		updateCanvas.call(this);

	};

	//--- Private functions ---
	/**
	 * @description this function will update the current story page being shown on canvas
	 * @note also needa call editViewController.updateCanvasComponentHandlers() after calling this
	 */
	var updateCanvas = function() {
		//first reset the canvas
		resetCanvas.call(this);

		var pageComponents = this.curStoryPage.getAllComponents();
		for (var key in pageComponents) {
			var eachComponentData = pageComponents[key];
			var componentDiv = $("<div>");
//			console.log(eachComponentData);

			//Set this component attr
			componentDiv.addClass("dropped_item");
			componentDiv.css({
				"left": eachComponentData.pos[0] + "%",
				"top": eachComponentData.pos[1] + "%"
			});
			componentDiv.attr("pb-id", eachComponentData.getId());
			componentDiv.attr("pb-type", eachComponentData.type);

			// Add main content
			if (eachComponentData.type === PageComponent.TYPE_BACKGROUND) {
				componentDiv.addClass("canvas_item_bg");
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			} else if (eachComponentData.type === PageComponent.TYPE_ITEM) {
				componentDiv.addClass("canvas_item_props");
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			} else if (eachComponentData.type === PageComponent.TYPE_TEXT) {
//				console.log(eachComponentData);
				componentDiv.addClass("canvas_item_text");
				componentDiv.css({
					"width": eachComponentData.size[0] + "%",
					"height": eachComponentData.size[1] + "%",
					"padding": PageComponent.TEXT_PADDING + "%"
				});
				componentDiv.append($("<textarea>").text(eachComponentData.text));
			}


			// Also add delete button
			var itemDelBtn = $('<input type="button" class="btn btn-xs" name="delete" value="x" />');
			componentDiv.append(itemDelBtn);

			this.canvas.append(componentDiv);

			//FIXME: move below to Controller
			componentDiv.draggable({
				containment: "#droppable_canvas"
			});
		}



	};

	var resetCanvas = function() {
		$(this.canvas).empty();
	};


	this.showView = function() {
		$(this.container).show();
	};
	this.hideView = function() {
		$(this.container).hide();
	};

	/*****************************************  
	 Observer implementation    
	 *****************************************/
	//Register an observer to the model
	model.addObserver(this);

	//This function gets called when there is a change at the model
	this.update = function(arg) {
//		alert(typeof arg);
//		this.updateSelectedDishes();
//		
//		editView is the only page that can update below info, therefore it doesnt need perform below on model update
//		updateCanvas.call(this); //need to call updateCanvasComponentHandlers() 
//		this.titleInput.val(model.getTitle());
	};
};

/**
 * 
 * @param {Number} assetType
 * @param {Object} assetData
 * @returns {Object} jquery object of created element
 */
EditView.createAssetItem = function(assetType, assetData) {
	var imageFolder = (assetType === PageComponent.TYPE_BACKGROUND) ? "backgrounds/" : "items/";
	var itemDiv;
	switch (assetType) {
		case PageComponent.TYPE_BACKGROUND:
		case PageComponent.TYPE_ITEM:
			itemDiv = $("<div>").addClass("draggable_item").attr("pb-type", assetType);
			itemDiv.append($("<img>").attr("src", "images/" + imageFolder + assetData.image));
			break;

		case PageComponent.TYPE_TEXT:

//			<div class="draggable_item_text" pb-type="3" pb-width="100" pb-height="30">
//									<div class="item_text_container"><div class="item_text" style="width:100%; height: 40%;"><p>Text</p></div></div>
//								</div>
			break;
		default:
			break;
	}
	return itemDiv;
};
