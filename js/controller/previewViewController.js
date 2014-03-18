/* 
 * @author Gigi
 * @desc this is the controller for PreviewView
 */

var PreviewViewController = function(view, model) {
	
	
    
	$(view.thumbnailContainer).on("click", ".page_thumbnail", function(){
//		alert("click thumbnail"+$(this).attr("pb-idx"));
		
		
		view.loadStoryPage($(this).attr("pb-idx"));
		
	});
    
	
	
};

