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

	// Handling draggable
	$(".draggable_item").draggable({
		helper: 'clone',
		containment: 'document',
		delay: 0,
		grid: false
	});

	// Handling droppable
	$("#droppable_canvas").droppable({
		drop: function(event, ui) {
			var element = $(ui.draggable).clone();

			var draggablePos = $(ui.helper).offset();
			var canvasPos = $(this).offset();

			// Convert draggable offset pos to canvas-relative pos
			var relPosInPercent = {
				'left': (draggablePos.left - canvasPos.left) / $(this).width() * 100,
				'top': (draggablePos.top - canvasPos.top) / $(this).height() * 100
			};

			// item is dropped outside the canvas, break.
			//TOFIX: handled components dropped on the right edge of the canvas
			if((relPosInPercent >= 0 && relPosInPercent <= 100)){
				return;
			}
			
			$(element).css({
				"left": relPosInPercent.left + "%",
				"top": relPosInPercent.top + "%"
			});


			// Save new component to model
			var componentType = Number($(element).attr("pb-type"));
			var componentId;
			switch (componentType) {
				case PageComponent.TYPE_BACKGROUND:
				case PageComponent.TYPE_ITEM:
					componentId = view.curStoryPage.addComponent(componentType, $(element).find('img').attr('src'), relPosInPercent.left, relPosInPercent.top);
					break;
				case PageComponent.TYPE_TEXT:
					break;
			}
//			console.log(view.curPage.getAllComponents());

			// Keep component id in the element (for later use)
			element.attr("pb-id", componentId);


			// Add to canvas
			$(this).append(element);

		}
	});


};

