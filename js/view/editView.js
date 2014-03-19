/* 
 * @author Gigi Ho
 * 
 */

var EditView = function(containerObj, model) {
	this.container = containerObj;
	this.titleInput = this.container.find(".title");
	this.canvas = containerObj.find("#droppable_canvas");
	// create an array to store the status of the dots;
	this.navDots = [];



	// clear all the class of the dots;
	/*
	 navDotsFunc.prototype.clearClass = function(){
	 for(var i=0;i<this.navDots.length;i++){
	 this.navDots[i].attr("class","");
	 }
	 };
	 */

	this.curStoryPage; //current page being shown on canvas

	this.showView = function() {
		$(this.container).show();
	};
	this.hideView = function() {
		$(this.container).hide();
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


	// Load story pages
	var pages = model.getAllPages();


	this.curStoryPage = pages[1]; // default the current page is page 1, not cover
	this.container.find("#totalPageNum").text(pages.length - 1);
	this.container.find("#currentPageIdx").text(this.curStoryPage.getPageIdx());

	// Load canvas content 
	// console.log(pages);
	var pageComponents = this.curStoryPage.getAllComponents();
	// pages[1].getAllComponents();
	//  console.log(this.curStoryPage);

	/*--- Public functions ---*/
	this.loadStoryPage = function(pageIdx) {

		var totalPageNum = model.getAllPages().length - 1;
		this.curStoryPage = model.getPageByIdx(pageIdx);

		//update paging exclude cover page
		this.container.find("#currentPageIdx").text(pageIdx);
		this.container.find("#totalPageNum").text(model.getAllPages().length - 1);
		/*generate naviDots*/

		//if num of dots is less than total page, add dots
		/*
		 if(this.navDots.length<totalPageNum){
		 for(var i=this.navDots.length+1;i<=totalPageNum;i++){
		 var dot = $("<li>");
		 var a = $("<a>");
		 dot.append(a);
		 dot.attr("class","");
		 this.navDots.push(dot);
		 }
		 }
		 // if num of dos is more than total page, delete dots
		 else if(this.navDots.length>totalPageNum){
		 for(var i = totalPageNum; i>this.navDots.length; i--){
		 this.navDots.pop();
		 }
		 }   
		 //update the state of all dots   
		 this.navDots.clearClass();
		 this.navDots[pageIdx-1].attr("class","current");
		 
		 //populate the dots into the canvas
		 
		 var dotHolder = this.container.find(".dotsyle>ul");
		 
		 for(var i=0; i<this.navDots.length; i++){
		 dotHolder.append(this.navDots[i]);
		 }
		 //alert("loadstoryPage!");*/
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
		}



	};

	var resetCanvas = function() {
		$(this.canvas).empty();
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