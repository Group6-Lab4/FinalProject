/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	/*remove the defulte streched out style of left menu when click or mouse over*/
	$(".catgories").on("click mouseout", function() {
		$("#icon_bg div").attr("id", "cat_bgs");
		$("#icon_bg img").attr("id", "");
	});

	$(".draggable_item").draggable({
		helper: 'clone',
		containment: 'document',
		delay: 0,
		grid: false,
//		opacity: 0.5,
//		refreshPositions: true
//		cursor: "move" 
	});


	$("#droppable_canvas").droppable({
		drop: function(event, ui) {
			var element = $(ui.draggable).clone();
			
			var draggablePos = $(ui.helper).offset();
			var canvasPos = $(this).offset();
			
			var relPosInPercent = {
				'left': (draggablePos.left - canvasPos.left)/$(this).width() * 100,
				'top' : (draggablePos.top - canvasPos.top)/$(this).height() * 100
			};
			
            $(element).css({
                "left": relPosInPercent.left + "%",
                "top": relPosInPercent.top + "%"
            });
			
			$(this).append(element);
			
			
		}
	});


};

