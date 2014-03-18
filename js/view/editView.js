/* 
 * @author Gigi Ho
 * 
 */

var EditView = function(containerObj, model) {
	this.container = containerObj;
	this.titleInput = this.container.find(".title");
	this.canvas = containerObj.find("#droppable_canvas");
	

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



	// Load story pages
	var pages = model.getAllPages();
	this.curStoryPage = pages[1]; // default the current page is page 1, not cover

	// Load canvas content 
	var pageComponents = this.curStoryPage.getAllComponents();


	//--- Public functions ---
	this.loadStoryPage = function(pageIdx) {
		this.curStoryPage = model.getPageByIdx(pageIdx);
		
		updateCanvas.call(this);
		
		//TODO:update paging
		
	};

	//--- Private functions ---
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

			//Set this component attr
			componentDiv.addClass("dropped_item");
			componentDiv.css({
				"left": eachComponentData.pos[0] + "%",
				"top": eachComponentData.pos[1] + "%"
			});
			componentDiv.attr("pb-id", eachComponentData.getId());
			componentDiv.attr("pb-type", eachComponentData.type);

			// Add main content
			if (eachComponentData.type === PageComponent.TYPE_BACKGROUND || eachComponentData.type === PageComponent.TYPE_ITEM) {
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			} else if (eachComponentData.type === PageComponent.TYPE_TEXT) {
				console.log(eachComponentData);
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
           this.titleInput.val(model.getTitle()); 
	};
};


