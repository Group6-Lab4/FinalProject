/* 
 * @author Gigi
 */

// StoryModel constructor
var StoryModel = function() {

	var title = "My first story";
	var pages = []; //consist of Page objects
	pages[0] = new Page(Page.TYPE_COVER); //cover page
	pages[1] = new Page(Page.TYPE_NORMAL); //first page

	//Return the title of the story
	this.getTitle = function() {
		return title;
	};
	//Set the title of the story as input
	this.setTitle = function(newTitle) {
		title = newTitle;

		notifyObservers("title");
	};

	//Return all story pages
	this.getAllPages = function(){
		return pages;
	};
	
	//Return a story page by idx (idx is the array index, returned by addPage())
	this.getPageByIdx = function(idx){
		return pages[idx];
	};
	
	//Add new page at the end by default, or at pageIdx, return newly-added page idx
	this.addPage = function(pageIdx) {
		var returnIdx;
		if (pageIdx > 0 && pageIdx < pages.length) { //only allow adding after cover page
			splice(pageIdx, 0, new Page(Page.TYPE_NORMAL));
			returnIdx = pageIdx;
		} else {
			returnIdx = pages.push(new Page(Page.TYPE_NORMAL));
		}

		notifyObservers("page");
		return returnIdx;
	};

	//Remove page at pageIdx
	this.removePage = function(pageIdx) {
		splice(pageIdx, 1);

		notifyObservers("page");
	};

	//Return all avaiable backgrounds in the story assets list
	this.getAssetBackground = function() {
		return assets.background;
	};
	//Return all available items (including character and props) in the story assets list
	this.getAssetItem = function() {
		return assets.item.character.concat(assets.item.props);
	};
	//Return available items in the story assets list, by cat "character" / "props"
	this.getAssetItemByCat = function(catName) {
		return assets.item[catName];
	};


	var assets = {
		'background': [{
				'id': 1,
				'image': "temp_bg.png"
			}, {
				'id': 2,
				'image': "xxx.png"
			}
		],
		'item': {
			//Sub-cat under items
			'character': [{
					'id': 1,
					'image': "temp_item.png"
				}, {
					'id': 2,
					'image': "xxx.png"
				}
			],
			//Sub-cat under items	
			'props': [
			]}
	};

	/*****************************************  
	 Observable implementation    
	 *****************************************/
	var observers = [];
	this.addObserver = function(observer)
	{
		observers.push(observer);
	};

	var notifyObservers = function(arg)
	{
		for (var i = 0; i < observers.length; i++)
		{
			observers[i].update(arg);
		}
	};
};

// Page consturctor, each page object represents 1 page (1 spread page, i.e. left and right)
var Page = function(pageType) {
	var type = Page.TYPE_NORMAL; //0 - cover; 1 - normal; 2 - bottom
	var components = []; // PageComponents sorted by zorder asc
	var maxComponentId = 0;

	//Check init vars
	if (pageType === Page.TYPE_BOTTOM || pageType === Page.TYPE_COVER || pageType === Page.TYPE_NORMAL) {
		type = pageType;
	}

	//Return all components according to zorder (from low to high)
	this.getAllComponents = function() {
		return components;
	};

	this.getComponentById = function(componentId) {
//		return components[componentId];
		for (var i in components) {
			if (components[i].getId() === componentId) {
				return components[i];
			}
		}
	};

	//Add a new page component to the Page, return the component Id
	this.addComponent = function(newComponent, zorder) {
		maxComponentId++;
		newComponent.initId(maxComponentId);

		if (typeof zorder !== undefined) {
			newComponent.setZorder(zorder);
		}

		components.push(newComponent);
		sortComponents();

		notifyObservers();
		return maxComponentId;
	};

	this.removeComponent = function(componentId) {
		for (var idx in components) {
			if (components[idx].getId() === componentId) {
				delete components[idx]; //use delete instead components[idx] = undefined; so for each loop wont loop
				notifyObservers();
				break;
			}
		}
	};

	//TODO:
	this.draw = function() {

	};

	var sortComponents = function() {

		components.sort(function(a, b) {
			return a.getZorder() - b.getZorder();
		});
	};

	/*****************************************  
	 Observable implementation    
	 *****************************************/
	var observers = [];
	this.addObserver = function(observer)
	{
		observers.push(observer);
	};

	var notifyObservers = function(arg)
	{
		for (var i = 0; i < observers.length; i++)
		{
			observers[i].update(arg);
		}
	};
};

//Page constants
Page.TYPE_COVER = 0;
Page.TYPE_NORMAL = 1;
Page.TYPE_BOTTOM = 2;

// PageComponent Constructor
/*
 * @param number componentType: TYPE_BACKGROUND, TYPE_ITEM, TYPE_TEXT
 * @param string content: if type = TEXT, text content; else image filename
 * 
 */
var PageComponent = function(componentType, content, posX, posY) {
	var id; //unique id with a page
	var type; //0 - background; 1- item; 2- text
	var zorder;
	var image;
	var text;
	var pos; //[x,y] , where x, y  [0:100], relative position within the canvas (page)

	//advanced vars: implement if time allows
//	var size;
//	var rotation;
//	var isMirror;

	//Check init vars
	if (componentType !== PageComponent.TYPE_BACKGROUND && componentType !== PageComponent.TYPE_ITEM && componentType !== PageComponent.TYPE_TEXT) {
		throw ("PageComponent: unknown componentType");
	}
	if (!content) {
		throw ("PageComponent: unknown componentContent");
	}
	if (!(posX >= 0 && posX <= 100) || !(posY >= 0 && posY <= 100)) {
		throw ("PageComponent: incorrect posX/ poxY");
	}

	type = componentType;
	zorder = componentType;
	if (componentType === PageComponent.TYPE_TEXT) {
		text = content;
	} else {
		image = content;
	}
	pos = [posX, posY];


	//Can only be called once
	this.initId = function(componentId) {
		if (id !== undefined) {
			throw("PageComponent.id already initialised.");
		}
		id = componentId;
	};

	this.getId = function() {
		return id;
	};

	this.getZorder = function() {
		return zorder;
	};
	this.setZorder = function(componentZorder) {
		zorder = componentZorder;

		//TODO:also notify Page to sortComponents
	};

	this.setText = function(contentText) {
		text = contentText;

		//TODOL notify
	};

	this.setPos = function(x, y) {
		if (!(x >= 0 && x <= 100) || !(y >= 0 && y <= 100)) {
			throw ("PageComponent: incorrect posX/ poxY");
		}
		pos = [x, y];
	};

};

// PageComponent constants:
PageComponent.TYPE_BACKGROUND = 0;
PageComponent.TYPE_ITEM = 1;
PageComponent.TYPE_TEXT = 2;
