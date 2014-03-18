/* 
 * @author Gigi Ho
 * 
 */

var EditView = function(container, model) {
	this.titleInput = container.find(".title");
	
	this.curStoryPage; //current page being shown on canvas

	this.showView = function() {
		$(container).show();
	};
	this.hideView = function() {
		$(container).hide();
	};

	// Load story title
        
	if (model.getTitle() !== undefined) {
		this.titleInput.val(model.getTitle());       
               }
         
	
	// Load story assets
	
	
	
	// Load story pages
	var pages = model.getAllPages();
	this.curStoryPage = pages[1]; // default the current page is page 1, not cover
	
	// Load canvas content 
	var pageComponents = this.curStoryPage.getAllComponents();
	


	/*****************************************  
	 Observer implementation    
	 *****************************************/
	//Register an observer to the model
	model.addObserver(this);

	//This function gets called when there is a change at the model
	this.update = function(arg) {
//		alert(typeof arg);
//		this.updateSelectedDishes();
            notifyobserver(this);
	};
};


