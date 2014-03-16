/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
    
    /*remove the defulte streched out style of left menu when click or mouse over*/
    $(".catgories").on("click mouseout", function(){
        $("#icon_bg div").attr("id","cat_bgs");
        $("#icon_bg img").attr("id","");
    });
	
	
};

