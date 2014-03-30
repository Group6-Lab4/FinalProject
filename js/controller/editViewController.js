/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	var container = view.container;
//	var curStoryPageModel = view.curStoryPage; !! dont do this because curXX will change a lot
	var textItemDefaultText = "Your text goes here.";
	var curPageIdx = view.curStoryPage.getPageIdx();

	// @depercated.
	// Handling cloned draggable
	var updateCanvasComponentHandlers = function() {
		var componentObj = $(container).find(".dropped_item");
		console.log("updateCanvasComponentHandlers, componentObj:");
		console.log(componentObj);

		componentObj.draggable({
			containment: "#droppable_canvas"
		});

		//NOTE: can consier to chagne to delegate method -> DONE!
		//handler for textarea 
		componentObj.find("textarea").on("change", function() {
			var componentId = $(this).parent().attr("pb-id");
			var pageComponent = view.curStoryPage.getComponentById(componentId);

//						console.log("onchange: " + $(this).val());
			pageComponent.setText($(this).val());

		});

		//NOTE: can consier to chagne to delegate method -> DONE!
		// and its handlers
		componentObj.find("input[name=delete]").on("click", function() {
			var componentId = $(this).parent().attr("pb-id");
			view.curStoryPage.removeComponent(componentId);
			$(this).parent().remove();

		});
	};


	// --- Constructor ---//

	//detect change on title
	view.titleInput.change(function() {
		model.setTitle(view.titleInput.val());
		model.update("setTitle");

	});

	/*interaction of the navigation dots */
	view.pagingContainer.on("click", "li", function() {
		view.loadStoryPage($(this).attr("pb-idx"));
//		updateCanvasComponentHandlers();
	});


	/*go to prevPage or nextPage */
	$(container).find("#toPrevious").on("click", function() {
		curPageIdx = Number(view.curStoryPage.getPageIdx()); //!important to use Number(), otherwise  4+1 -> 41!
		if (curPageIdx <= 1)
			return;
		else {
//			console.log("EditViewController: toPrevious: from p." + curPageIdx + " to p." + (curPageIdx-1));
			view.loadStoryPage(curPageIdx - 1);
		}
	});

	$(container).find("#toNext").on("click", function() {
		curPageIdx = Number(view.curStoryPage.getPageIdx());
		if (view.curStoryPage.getPageIdx() >= model.getAllPages().length - 1)
			return;
		else {
//			console.log("EditViewController: toNext: from p." + curPageIdx + " to p." + (curPageIdx + 1));
			view.loadStoryPage(curPageIdx + 1);
		}
	});

	/*remove the defulte streched out style of left menu when click or mouse over*/
	$(".catgories").on("click mouseout", function() {
		$("#icon_bg div").attr("id", "cat_bgs");
		$("#icon_bg img").attr("id", "");
	});

	//	Buttons handlers
	$(container).find(".btn_addpage").on("click", function() {
		//Check if exceeding page limit
		if (model.getAllPages().length >= StoryModel.PAGE_LIMIT) {
			alert("Oops! you can create only up to " + Number(StoryModel.PAGE_LIMIT - 1) + " pages. :) "); //excl. cover
			return;
		}

		var newPageIdx = model.addPage(view.curStoryPage.getPageIdx() + 1);
		//load new page
		view.loadStoryPage(newPageIdx);

		//TODO: handling paging
	});

	$(container).find(".btn_deletepage").on("click", function() {
		//Check if removing last page 
		if (model.getAllPages().length <= 2) {
			alert("Oops! You cannot remove the last page. :(");
			return;
		}

		var pageIdx = view.curStoryPage.getPageIdx();
		model.removePage(pageIdx);

		if (pageIdx == 1) {
			view.loadStoryPage(pageIdx);
		} else {
			view.loadStoryPage(pageIdx - 1);
		}

		//TODO: handlle paging 

	});

	// Paging handlers

	// Other handlers for draggable items
	// delete btn handler
	$("#droppable_canvas").on("click", "input[name=delete]", function() {
		var componentId = $(this).parent().attr("pb-id");
		//update ui
		$(this).parent().remove();
		//update model
		view.curStoryPage.removeComponent(componentId);
		
	}).on("change", "textarea", function() {
		var componentId = $(this).parent().attr("pb-id");
		var pageComponent = view.curStoryPage.getComponentById(componentId);

		//update model
		pageComponent.setText($(this).val());

	});

	// Handling original draggable
	$(".draggable_item").draggable({
		helper: 'clone',
		containment: "document",
		revert: true
//		delay: 0,
//		grid: false
	});

	$(".draggable_item_text").draggable({
		helper: 'clone',
		containment: "document",
		opacity: 0.7,
		revert: true
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
				var pageComponent = view.curStoryPage.getComponentById(draggableObj.attr("pb-id"));
				if (!pageComponent) {
					return;
				}
				pageComponent.setPos(relPosInPercent.left, relPosInPercent.top);

				return;
			}


			// Clone element to the canvas for newly added item
			var newItemObj = $(draggableObj).clone();
			$(newItemObj).removeClass().addClass("dropped_item");

			// Prepare data to save to model , also value to be set to html element
			var componentType = Number($(draggableObj).attr("pb-type"));
			var componentId;
			var content, left, top;
			var width = newItemObj.attr("pb-width");
			var height = newItemObj.attr("pb-height");

			if (componentType === PageComponent.TYPE_BACKGROUND) {
				$(newItemObj).addClass("canvas_item_bg");
				content = $(draggableObj).find('img').attr('src');
				left = 0;
				top = 0;
			} else if (componentType === PageComponent.TYPE_ITEM) {
				$(newItemObj).addClass("canvas_item_props");
				content = $(draggableObj).find('img').attr('src');
				left = relPosInPercent.left;
				top = relPosInPercent.top;
			} else if (componentType === PageComponent.TYPE_TEXT) {
				$(newItemObj).addClass("canvas_item_text");
				content = textItemDefaultText;
				//horzontal layout
				if (width == 100 || relPosInPercent.left < 50) { //align left
					left = 0;
				} else { //alight right
					left = 100 - width;
				}

				//vertical layout
				if (height == 100 || relPosInPercent.top < 50) { //align left
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

				//Textarea for item_text
				var itemTextarea = $("<textarea>").text(textItemDefaultText);
				newItemObj.append(itemTextarea);

				//already handled by its delegate canvas
				//handler for textarea
//				itemTextarea.on("change", function() {
//					var componentId = $(this).parent().attr("pb-id");
//					var pageComponent = view.curStoryPage.getComponentById(componentId);
//
////						console.log("onchange: " + $(this).val());
//					pageComponent.setText($(this).val());
//
//				});
			}

			// Save new component to model
			componentId = view.curStoryPage.addComponent(componentType, content, left, top, width, height);

			//Set other attribute for new element
			$(newItemObj).css({
				"left": left + "%",
				"top": top + "%"
			});

			// Keep component id in the element (for updating component later)
			newItemObj.attr("pb-id", componentId);

			// Also add delete button
			var itemDelBtn = $('<input type="button" class="btn btn-xs" name="delete" value="x" />');
			newItemObj.append(itemDelBtn);

			//@note: already handled by its delegated parent canvas
			// and its handlers
//			itemDelBtn.on("click", function() {
//
//				var componentId = $(this).parent().attr("pb-id");
//				view.curStoryPage.removeComponent(componentId);
//				$(this).parent().remove();
//
//			});


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

