/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	var curStoryPageModel = view.curStoryPage;
	var textItemDefaultText = "Your text goes here.";

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

	$(".draggable_item_text").draggable({
		helper: 'clone',
		containment: "document",
		opacity: 0.7
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
				if (!pageComponent) {
					return;
				}
				pageComponent.setPos(relPosInPercent.left, relPosInPercent.top);

				return;
			}


			// Clone element to the canvas for newly added item
			var newItemObj = $(draggableObj).clone();
			$(newItemObj).removeClass().addClass("dropped_item");

			// Set new element and save to model by component type
			var componentType = Number($(draggableObj).attr("pb-type"));
			var componentId;
			switch (componentType) {
				case PageComponent.TYPE_BACKGROUND:
				case PageComponent.TYPE_ITEM:
					$(newItemObj).css({
						"left": relPosInPercent.left + "%",
						"top": relPosInPercent.top + "%"
					});

					// Save new component to model
					componentId = curStoryPageModel.addComponent(componentType, $(draggableObj).find('img').attr('src'), relPosInPercent.left, relPosInPercent.top);
					break;
				case PageComponent.TYPE_TEXT:
					var width = newItemObj.attr("pb-width");
					var height = newItemObj.attr("pb-height");
					var left, top;

					//horzontal layout
					if (width == 100) {
						left = 0;
					} else if (relPosInPercent.left < 50) { //align left
						left = 0;
					} else { //alight right
						left = 100 - width;
					}

					//vertical layout
					if (height == 100) {
						top = 0;
					} else if (relPosInPercent.top < 50) { //align left
						top = 0;
					} else { //align bottom
						top = 100 - height;
					}


					newItemObj.empty();
					newItemObj.css({
						"width": width + "%",
						"height": height + "%",
						"left": left + "%",
						"top": top + "%",
						"padding": PageComponent.TEXT_PADDING + "%"
					});

					var itemTextarea = $("<textarea>").text(textItemDefaultText);
					newItemObj.append(itemTextarea);

					itemTextarea.on("change", function() {
						var componentId = $(this).parent().attr("pb-id");
						var pageComponent = curStoryPageModel.getComponentById(componentId);
						
						console.log("onchange: "+ $(this).val());
						pageComponent.setText($(this).val());
						
					});


					// Save new component to model
					componentId = curStoryPageModel.addComponent(componentType, textItemDefaultText, left, top, width, height);

					break;
			}

			//Set other attribute for new element
			// Keep component id in the element (for updating component later)
			newItemObj.attr("pb-id", componentId);

			// Also add delete button
			var itemDelBtn = $('<input type="button" class="btn btn-xs" name="delete" value="x" />');
			newItemObj.append(itemDelBtn);

			// and its handlers
			itemDelBtn.on("click", function() {
				var componentId = $(this).parent().attr("pb-id");
				curStoryPageModel.removeComponent(componentId);
				$(this).parent().remove();

			});


			// Add to canvas
			$(this).append(newItemObj);

			// also its new event hanlders
			newItemObj.draggable({
				containment: "#droppable_canvas"
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

