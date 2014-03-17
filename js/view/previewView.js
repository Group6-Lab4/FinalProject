/* 
 * @author Gigi Ho
 * 
 */

var PreviewView = function(container, model) {
	this.canvas = container.find('.canvas');
	this.curStoryPage; //current page being shown on big canvas

	// Public functions
	this.showView = function() {
		$(container).show();
	};
	this.hideView = function() {
		$(container).hide();
	};
	
	// Private functions
	var updateCanvas = function() {
//		console.log(this.curStoryPage);
		
		var pageComponents = this.curStoryPage.getAllComponents();
		for (var key in pageComponents) {
			var eachComponentData = pageComponents[key];
			var componentDiv = $("<div>");
			console.log(eachComponentData);
			
			
			if(eachComponentData.type === PageComponent.TYPE_BACKGROUND || eachComponentData.type === PageComponent.TYPE_ITEM){
				componentDiv.append($("<img>").attr("src", eachComponentData.image));
			}
			
			componentDiv.css({
				"position": "absolute",
				"left": eachComponentData.pos[0] + "%",
				"top": eachComponentData.pos[1] + "%"
			});
			
			this.canvas.append(componentDiv);
		}
	};

	// Constructor
	// Load story title
	if (model.getTitle() !== undefined) {
//		this.titleInput.val(model.getTitle());
	}


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
		alert(classname);
		if (classname == "Page") {
			//page object is updated
//			console.log(this.canvas);
			updateCanvas.call(this);

		}


	};
};


