/* 
 * @author Gigi Ho
 * 
 */

var PreviewView = function(container, model) {
	this.canvas = container.find('.canvas');
	this.curStoryPage; //current page being shown on big canvas
        this.title = container.find('.title');
        
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

			if (eachComponentData.type === PageComponent.TYPE_BACKGROUND || eachComponentData.type === PageComponent.TYPE_ITEM) {
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			}else if(eachComponentData.type === PageComponent.TYPE_TEXT){
				console.log(eachComponentData);
				componentDiv.css({
					"width": eachComponentData.size[0] + "%",
					"height": eachComponentData.size[1] + "%",
					"padding" : PageComponent.TEXT_PADDING + "%"
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

         this.updateTitle = function(){
             this.title.text(model.getTitle());
            // alert("update Title in preview! "+model.getTitle());
     };

	/**
	 * @description this function will update a specific thumbnail by pageIdx or all thumnails
	 */
	var updateThumbnail = function(pageIdx) {

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




	/*****************************************  
	 Observer implementation    
	 *****************************************/
	//Register an observer to the model
	 model.addObserver(this);

	//This function gets called when there is a change at the model
	this.update = function(data) {
		var classname = data.constructor.name;
//		alert(classname);
		if (classname == "Page") {
			//page object is updated
//			console.log(this.canvas);
//			if(data === curStoryPage){ 
			if (data.getPageIdx() === this.curStoryPage.getPageIdx()) {

				updateCanvas.call(this);
			} else {
				updateThumbnail.call(this, data.getPageIdx());
			}

		} else if (classname == "PageComponent") {

		}
             //update the title with model.   
            
            this.updateTitle();
           // alert("in preview, update from model!");
           

	};
};


