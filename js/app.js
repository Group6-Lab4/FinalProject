/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var model;
$(document).ready(function(){
	model = new StoryModel();
	
	console.log("StoryModel.title:" + model.getTitle());
	
	console.log("StoryModel.pages:" + model.getAllPages());
	
	
});


