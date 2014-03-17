/* 
 * @author Gigi
 */

// StoryModel constructor
var StoryModel = function StoryModel() {

	var title; // = "My first story";
	var pages = []; //consist of Page objects
	pages[0] = new Page(Page.TYPE_COVER, 0); //cover page
	pages[1] = new Page(Page.TYPE_NORMAL, 1); //first page

	//Register this as observer to the page observable
	pages[0].addObserver(this);
	pages[1].addObserver(this);

	//Return the title of the story
	this.getTitle = function() {
		return title;
	};
	//Set the title of the story as input
	this.setTitle = function(newTitle) {
		title = newTitle;

		notifyObservers("setTtitle");
	};

	//Return all story pages
	this.getAllPages = function() {
		return pages;
	};

	//Return a story page by idx (idx is the array index, returned by addPage())
	this.getPageByIdx = function(idx) {
		return pages[idx];
	};

	//Add new page at the end by default, or at pageIdx, return newly-added page idx
	this.addPage = function(pageIdx) {
		var returnIdx;
		if (pageIdx > 0 && pageIdx < pages.length) { //only allow adding after cover page
			splice(pageIdx, 0, new Page(Page.TYPE_NORMAL, pageIdx));
			returnIdx = pageIdx;
		} else {
			returnIdx = pages.push(new Page(Page.TYPE_NORMAL));
			pages[returnIdx].initIdx(returnIdx);
		}

		notifyObservers("addPage");
		return returnIdx;
	};

	//Remove page at pageIdx
	this.removePage = function(pageIdx) {
		splice(pageIdx, 1);

		notifyObservers("removePage");
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

	/*****************************************  
	 Observer implementation    
	 - StoryModel is observing its pages; 
	 - Pages are also observing their PagesComponents;
	 - when there is changes in PagesComponents, the notification will bubble up to here.
	 *****************************************/
	//This function gets called when there is a change at the observables (Page)
	this.update = function(arg) {
		//pass the changes to its oberserver
		notifyObservers(arg);

	};
};

// Page consturctor, each page object represents 1 page (1 spread page, i.e. left and right)
var Page = function Page(pageType, pageIdx) {
	var pageIdx; //page num of this page
	var type = Page.TYPE_NORMAL; //0 - cover; 1 - normal; 2 - bottom
	var components = []; // PageComponents sorted by zorder asc
	var maxComponentId = 0;

	//Check init vars
	if (pageType === Page.TYPE_BOTTOM || pageType === Page.TYPE_COVER || pageType === Page.TYPE_NORMAL) {
		type = pageType;
	}

	//Can only be called once
	this.initIdx = function(idx) {
		if (pageIdx !== undefined) {
			throw("PageComponent.id already initialised.");
		}
		pageIdx = idx;
	};

	this.getPageIdx = function() {
		return pageIdx;
	};

	//Return all components according to zorder (from low to high)
	this.getAllComponents = function() {
		return components;
	};

	this.getComponentById = function(componentId) {
//		return components[componentId];
		for (var i in components) {
			if (components[i].getId() === Number(componentId)) {
				return components[i];
			}
		}
	};

	/*
	 * @desc Add a new page component to the Page, return the component Id
	 * @param {Number} componentType
	 * @param {String} content, image src or text string
	 * @param {Number} posX, relative position in percentage
	 * @param {Number} posY, relative position in persontage
	 * 
	 */
	this.addComponent = function(componentType, content, posX, posY) {
		var pageComponent = new PageComponent(componentType, content, posX, posY);
		return this.addComponentObj(pageComponent);
	};

	/*
	 * @desc Add a new page component to the Page, return the component Id
	 * @param {PageComponent} newComponent
	 * @param {Number} zorder
	 * @returns {Number} componentId
	 */
	this.addComponentObj = function(newComponent, zorder) {
		maxComponentId++;
		newComponent.initId(maxComponentId);

		if (typeof zorder !== undefined) {
			newComponent.setZorder(zorder, true); //do not notify observer
		}

		components.push(newComponent);
		sortComponents();

		// Register the newly-created pageComponent owner as observer
		newComponent.addObserver(this);

		// Notify page's observers about newly added component
		notifyObservers(this);
		return maxComponentId;
	};

	this.removeComponent = function(componentId) {
		for (var idx in components) {
			if (components[idx].getId() === componentId) {
				delete components[idx]; //use delete instead components[idx] = undefined; so for each loop wont loop
				notifyObservers(this);
				break;
			}
		}
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


	/*****************************************  
	 Observer implementation    
		- Page is observing its PageComponents
	 *****************************************/
	//This function gets called when there is a change at the observables (PageComponents)
	this.update = function(arg) {
		//pass the changes to its oberserver
		
		//even though the change data is a PageComponent, this changes will be seen as by page, i.e. whole page will be updated by view
		notifyObservers(this);

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
var PageComponent = function PageComponent(componentType, content, posX, posY) {
	var id; //unique id with a page
	this.type; //0 - background; 1- item; 2- text
	var zorder;
	this.image;
	var text;
	this.pos; //[x,y] , where x, y  [0:100], relative position within the canvas (page)

	//advanced vars: implement if time allows
//	var size;
//	var rotation;
//	var isMirror;

	//Check init vars
	if (componentType != PageComponent.TYPE_BACKGROUND && componentType != PageComponent.TYPE_ITEM && componentType != PageComponent.TYPE_TEXT) {
		throw ("PageComponent: unknown componentType : " + componentType);
	}
	if (!content) {
		throw ("PageComponent: unknown componentContent : " + content);
	}
	if (!(posX >= 0 && posX <= 100) || !(posY >= 0 && posY <= 100)) {
//		throw ("PageComponent: incorrect posX/ poxY");
		console.log("[PageComponent]new component dropped outside desired zone, posX:" + posX + "poxY:" + posY)
	}

	this.type = componentType;
	zorder = componentType;
	if (componentType === PageComponent.TYPE_TEXT) {
		text = content;
	} else {
		this.image = content;
	}
	this.pos = [posX, posY];


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
	this.setZorder = function(componentZorder, isSilent) {
		zorder = componentZorder;

		if (!isSilent) {
			notifyObservers(this);
		}
	};

	this.setText = function(contentText) {
		text = contentText;

		notifyObservers(this);
	};

	this.setPos = function(x, y) {
		if (!(x >= 0 && x <= 100) || !(y >= 0 && y <= 100)) {
			throw ("PageComponent: incorrect posX/ poxY");
		}
		this.pos = [x, y];

		notifyObservers(this);
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

// PageComponent constants:
PageComponent.TYPE_BACKGROUND = 0;
PageComponent.TYPE_ITEM = 1;
PageComponent.TYPE_TEXT = 2;
