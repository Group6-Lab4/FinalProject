/* 
 * @author Gigi Ho
 * 
 */

var OrderView = function(container, model) {

	this.showView = function() {
		$(container).show();
	};
	this.hideView = function(){
		$(container).hide();
	};




	/*****************************************  
	 Observer implementation    
	 *****************************************/
	//Register an observer to the model
	model.addObserver(this);

	//This function gets called when there is a change at the model
	this.update = function(arg) {
	};
};


