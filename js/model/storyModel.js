/* 
 * @author Gigi
 */

// StoryModel constructor
var StoryModel = function StoryModel() {

	var title; // = "My first story";
	var coverPage = 1;
	var authorName = "";
	var pages = []; //consist of Page objects
	pages[0] = new Page(Page.TYPE_COVER, 0); //cover page
	pages[1] = new Page(Page.TYPE_NORMAL, 1); //first page

	//Register this as observer to the page observable
	pages[0].addObserver(this);
	pages[1].addObserver(this);

	var changedData = {"tag": "", "data": {}};

	//Return the title of the story
	this.getTitle = function() {
		//alert("getTitle")
		return title;
	};
	//Set the title of the story as input
	this.setTitle = function(newTitle) {
		title = newTitle;

		//also set in cover page
		var pageComponents = pages[0].getAllComponents();
		var isFound = false;
		for (var i in pageComponents) {
			var eachComponent = pageComponents[i];
			if (eachComponent.type == PageComponent.TYPE_TEXT) {
				//this is the cover title
				eachComponent.text = title;
				isFound = true;
				break;
			}
		}
		if (!isFound) {
			pages[0].addComponent(PageComponent.TYPE_TEXT, title, 60, 40, 40, 30);
		}

		notifyObservers("setTitle");
	};
	
	this.getAuthorName = function(){
		return authorName;
	};
	
	this.setAuthorName = function(newName){
		authorName = newName;
		
		notifyObservers("setAuthorName");
	};

	this.setCoverPage = function(pageIdx) {
		if (!(pageIdx > 0 && pageIdx < pages.length)) {
			throw("[StoryModel] Set cover page, idx is out of range. " + pageIdx);
		}
		var pageComponents = pages[pageIdx].getAllComponents();
		for (var i in pageComponents) {
			var eachComponent = pageComponents[i];
			if (eachComponent.type == PageComponent.TYPE_BACKGROUND || eachComponent.type == PageComponent.TYPE_ITEM) {
				pages[0].addComponentObj(eachComponent, true);
			}
		}

		//Set to model
		coverPage = pageIdx;
	};



	//Return all story pages
	this.getAllPages = function() {
		return pages;
	};

	//Return a story page by idx (idx is the array index, returned by addPage())
	this.getPageByIdx = function(idx) {
		if (!(idx >= 0 && idx < pages.length)) {
			throw("[StoryModel.getPageByIdx] pageIdx is out of scope(0:" + pages.length + "): " + idx);
		}
		return pages[idx];
	};

	//Add new page at the end by default, or at pageIdx, return newly-added page idx
	this.addPage = function(newPageIdx) {
		// Check if exceed page limit
		if (pages.length >= StoryModel.PAGE_LIMIT) {
			throw("StoryModel.addPage: exceeding page limit. Current page count: " + pages.length);
		}

		var returnIdx;
		var newPage;
		if (newPageIdx > 0 && newPageIdx < pages.length) { //only allow adding after cover page
			newPage = new Page(Page.TYPE_NORMAL, newPageIdx);
			pages.splice(newPageIdx, 0, newPage);
			returnIdx = newPageIdx;

		} else {
			newPage = new Page(Page.TYPE_NORMAL);
			returnIdx = pages.push(newPage) - 1; //new length - 1 
			pages[returnIdx].setPageIdx(returnIdx);
		}

		//update other following pageIdx
		this.updateAllPageIdx();

		//!important register new page to be observed
		newPage.addObserver(this);

		var changedData = {};
		changedData.tag = "addPage";
		changedData.data = {"pageIdx": returnIdx};
		notifyObservers(changedData);
		return returnIdx;
	};

	//Remove page at pageIdx
	this.removePage = function(pageIdx) {
		// Check if removing the last single page
		if (pages.length <= 2) {
			throw("StoryModel.removePage: you can remove the only page. current page count (incl. cover): " + pages.length);
		}

		pages.splice(pageIdx, 1);

		this.updateAllPageIdx();

		var changedData = {};
		changedData.tag = "removePage";
		changedData.data = {"pageIdx": pageIdx};
		notifyObservers(changedData);
	};

	this.updateAllPageIdx = function() {
		for (var i in pages) {
			pages[i].setPageIdx(i);
		}
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
				'id': 2,
				'image': "bg1.png"
			}, {
				'id': 3,
				'image': "bg2.png"
			}, {
				'id': 4,
				'image': "bg3.png"
			}, {
				'id': 5,
				'image': "bg4.png"
			}, {
				'id': 6,
				'image': "bg5.png"
			}, {
				'id': 7,
				'image': "bg6.png"
			}, {
				'id': 8,
				'image': "bg7.png"
			}, {
				'id': 9,
				'image': "bg8.png"
			}
		],
		'item': {
			//Sub-cat under items
			'character': [{
					'id': 2,
					'image': "image1.png"
				}, {
					'id': 3,
					'image': "image2.png"
				}, {
					'id': 4,
					'image': "image3.png"
				}, {
					'id': 5,
					'image': "image4.png"
				}, {
					'id': 6,
					'image': "image5.png"
				}, {
					'id': 7,
					'image': "image6.png"
				}, {
					'id': 8,
					'image': "image7.png"
				}, {
					'id': 9,
					'image': "image8.png"
				}, {
					'id': 10,
					'image': "image9.png"
				}, {
					'id': 11,
					'image': "image10.png"
				}, {
					'id': 12,
					'image': "image11.png"
				}, {
					'id': 13,
					'image': "image12.png"
				}, {
					'id': 14,
					'image': "image13.png"
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
		//  alert("model update!");
		notifyObservers(arg);

	};
};

StoryModel.PAGE_LIMIT = 11; //incl. cover page

// Page consturctor, each page object represents 1 page (1 spread page, i.e. left and right)
var Page = function Page(pageType, idx) {
	this.pageIdx = idx; //page num of this page , always changing
	var type = Page.TYPE_NORMAL; //0 - cover; 1 - normal; 2 - bottom
	var components = []; // PageComponents sorted by zorder asc
	var maxComponentId = 0;

	//Check init vars
	if (pageType === Page.TYPE_BOTTOM || pageType === Page.TYPE_COVER || pageType === Page.TYPE_NORMAL) {
		type = pageType;
	}

	//Can only be called once
	this.setPageIdx = function(idx) {
		this.pageIdx = idx;
	};

	this.getPageIdx = function() {
		return Number(this.pageIdx);
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
	this.addComponent = function(componentType, content, posX, posY, width, height) {
		var pageComponent = new PageComponent(componentType, content, posX, posY, width, height);
		return this.addComponentObj(pageComponent);
	};

	/*
	 * @desc Add a new page component to the Page, return the component Id
	 * @param {PageComponent} newComponent
	 * @param {Number} zorder
	 * @returns {Number} componentId
	 */
	this.addComponentObj = function(newComponent, isSilent, zorder) {
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
		if (!isSilent) {
			notifyObservers(this);
		}
		return maxComponentId;
	};

	this.removeComponent = function(componentId) {
		for (var idx in components) {
			if (components[idx].getId() === Number(componentId)) {
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
/**
 * 
 * @param {Number} componentType, TYPE_BACKGROUND | TYPE_ITEM | TYPE_TEXT
 * @param {String} content, text string for TYPE_TEXT, otherwise image url 
 * @param {Number} posX, left position in %
 * @param {Number} posY, top position in %
 * @param {Number} width, width in %
 * @param {Number} height, height in %
 * @returns {PageComponent} 
 */
var PageComponent = function PageComponent(componentType, content, posX, posY, width, height) {
	var id; //unique id with a page
	this.type; //0 - background; 1- item; 2- text
	var zorder;
	this.image;
	this.text;
	this.pos; //[x,y] , where x, y  [0:100], relative position within the canvas (page)

	//advanced vars: implement if time allows
	this.size; //[width,height] , where width, height  [0:100], relative size of the canvas (page)
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
		this.text = content;
	} else {
		this.image = content;
	}
	this.pos = [posX, posY];
	this.size = [width, height];


	//Can only be called once
	this.initId = function(componentId) {
		if (id !== undefined) {
			//FIXIT: temporarily disabled for Set as cover function
//			throw("PageComponent.id already initialised.");
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
		this.text = contentText;

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
PageComponent.TYPE_BACKGROUND = 1;
PageComponent.TYPE_ITEM = 2;
PageComponent.TYPE_TEXT = 3;

PageComponent.TEXT_PADDING = 2; //2%
