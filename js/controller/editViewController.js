/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	$(".draggable_item").draggable({
		helper: 'clone',
		containment: 'frame'
//		cursor: "move" 
	});


var droppableCount = 0;
	$("#droppable_canvas").droppable({
		drop: function(event, ui) {
			droppableCount++;
			$(this).html("Dropped!" + droppableCount);
		}
	});


};

