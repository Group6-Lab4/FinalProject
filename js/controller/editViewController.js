/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	var curStoryPageModel = view.curStoryPage;
	
	/*remove the defulte streched out style of left menu when click or mouse over*/
	$(".catgories").on("click mouseout", function() {
		$("#icon_bg div").attr("id", "cat_bgs");
		$("#icon_bg img").attr("id", "");
	});

	// Handling original draggable
	$(".draggable_item").draggable({
		helper: 'clone',
		containment: "document"
//		revert: true,
//		delay: 0,
//		grid: false
	});

	// Handling cloned draggable
	$(".dropped_item").draggable({
		containment: "#droppable_canvas"
	});

	// Handling droppable
	$("#droppable_canvas").droppable({
		hoverClass: "canvas-hover",
		drop: function(event, ui) {
			var draggableObj = $(ui.draggable);
			var draggablePos = $(ui.helper).offset();
			var canvasPos = $(this).offset();

			// Convert draggable offset pos to canvas-relative pos
			var relPosInPercent = {
				'left': (draggablePos.left - canvasPos.left) / $(this).width() * 100,
				'top': (draggablePos.top - canvasPos.top) / $(this).height() * 100
			};

			// item is dropped outside the canvas, break.
			//TOFIX: handled components dropped on the right edge of the canvas
			if ((relPosInPercent >= 0 && relPosInPercent <= 100)) {
				return;
			}

			// Update position of component in model
			if ($(draggableObj).hasClass("dropped_item")) {
				var pageComponent = curStoryPageModel.getComponentById(draggableObj.attr("pb-id"));
				if(!pageComponent){
					return;
				}
				pageComponent.setPos(relPosInPercent.left, relPosInPercent.top);
				
				return;
			}

			// Save new component to model
			var componentType = Number($(draggableObj).attr("pb-type"));
			var componentId;
			switch (componentType) {
				case PageComponent.TYPE_BACKGROUND:
				case PageComponent.TYPE_ITEM:
					componentId = curStoryPageModel.addComponent(componentType, $(draggableObj).find('img').attr('src'), relPosInPercent.left, relPosInPercent.top);
					break;
				case PageComponent.TYPE_TEXT:
					break;
			}

			// Clone element to the canvas for newly added item
			var newItemObj = $(draggableObj).clone();
			$(newItemObj).removeClass().addClass("dropped_item");
			$(newItemObj).css({
				"left": relPosInPercent.left + "%",
				"top": relPosInPercent.top + "%"
			});
			// Keep component id in the element (for updating component later)
			newItemObj.attr("pb-id", componentId);
			// Also add delete button
			var itemDelBtn = $('<input type="button" class="btn btn-xs" name="delete" value="x" />');
			newItemObj.append(itemDelBtn);


			// Add to canvas
			$(this).append(newItemObj);

			// Add other event hanlders to this new element
			newItemObj.draggable({
				containment: "#droppable_canvas"
			});
			itemDelBtn.on("click", function(){
				var componentId = $(this).parent().attr("pb-id");
				curStoryPageModel.removeComponent(componentId);
				$(this).parent().remove();
				
			});
			
		},
		// Below is to hanle "draggable clone was covered by canvas when first dragged"
		activate: function(event, ui) {
			$(this).css("zIndex", -10);
		},
		deactivate: function(event, ui) {
			$(this).css("zIndex", "");
		}
	});


};

