/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	var container = view.container;
//	var curStoryPageModel = view.curStoryPage; !! dont do this because curXX will change a lot
	var textItemDefaultText = "Your text goes here.";
	var curPageIdx = view.curStoryPage.getPageIdx();

// Handling cloned draggable
	var updateCanvasComponentHandlers = function() {
		var componentObj = $(container).find(".dropped_item");
		console.log("updateCanvasComponentHandlers, componentObj:");
		console.log(componentObj);

		componentObj.draggable({
			containment: "#droppable_canvas"
		});

		//handler for textarea
		componentObj.find("textarea").on("change", function() {
			var componentId = $(this).parent().attr("pb-id");
			var pageComponent = view.curStoryPage.getComponentById(componentId);

//						console.log("onchange: " + $(this).val());
			pageComponent.setText($(this).val());

		});

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
	/*go to prevPage or nextPage */
	$(container).find("#toPrevious").on("click", function() {
		curPageIdx = view.curStoryPage.getPageIdx();
		if (curPageIdx < 2)
			return;
		else {
			// var prevPage = model.getPageByIdx(curPageIdx-1);
			// view.curStoryPage = prevPage;
			//  alert("go to prev page!");
			view.loadStoryPage(curPageIdx - 1);

		}
		;
	});

	$(container).find("#toNext").on("click", function() {
		curPageIdx = view.curStoryPage.getPageIdx();
		if (curPageIdx === model.getAllPages().length - 1)
			return;
		else {
			//  var nextPage = model.getPageByIdx(curPageIdx+1);
			//   view.curStoryPage = nextPage;
			// alert("go to next page!")
			// console.log(view.curStoryPage);
			view.loadStoryPage(curPageIdx + 1);
		}
	});

	/*remove the defulte streched out style of left menu when click or mouse over*/
	//detect change on title
	view.titleInput.change(function() {
		model.setTitle(view.titleInput.val());
		model.update("setTitle");

	});

	$(".catgories").on("click mouseout", function() {
		$("#icon_bg div").attr("id", "cat_bgs");
		$("#icon_bg img").attr("id", "");
	});

	//	Buttons handlers
	$(container).find(".btn_addpage").on("click", function() {
		var newPageIdx = model.addPage(view.curStoryPage.getPageIdx() + 1);
		//load new page
		view.loadStoryPage(newPageIdx);

		//no need to do this because the canvas is new and empty.
//		updateCanvasComponentHandlers();
	});

	$(container).find(".btn_deletepage").on("click", function() {

	});

	// Paging handlers


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

			// Set new element and save to model by component type
			var componentType = Number($(draggableObj).attr("pb-type"));
			var componentId;
			switch (componentType) {
				case PageComponent.TYPE_BACKGROUND:
				case PageComponent.TYPE_ITEM:
					if(componentType == PageComponent.TYPE_ITEM){
						$(newItemObj).addClass("canvas_item_props");
					}else{
						$(newItemObj).addClass("canvas_item_bg");
					}
					$(newItemObj).css({
						"left": relPosInPercent.left + "%",
						"top": relPosInPercent.top + "%"
					});

					// Save new component to model
					componentId = view.curStoryPage.addComponent(componentType, $(draggableObj).find('img').attr('src'), relPosInPercent.left, relPosInPercent.top);
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

					//Textarea for item_text
					var itemTextarea = $("<textarea>").text(textItemDefaultText);
					newItemObj.append(itemTextarea);

					//handler for textarea
					itemTextarea.on("change", function() {
						var componentId = $(this).parent().attr("pb-id");
						var pageComponent = view.curStoryPage.getComponentById(componentId);

//						console.log("onchange: " + $(this).val());
						pageComponent.setText($(this).val());

					});


					// Save new component to model
					componentId = view.curStoryPage.addComponent(componentType, textItemDefaultText, left, top, width, height);

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
				view.curStoryPage.removeComponent(componentId);
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

