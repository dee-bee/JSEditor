

function initEditor(){
	loadDialog("sceneListDialog", 200, 300, [0,50])
}



function loadPageContent(){
	var remotePageUrl = $(xml).find("decisionvars > variable[name='remotePageContentURL']").attr("value") 
			+ "?title=" + sceneName +  ":" 
			+ pageId;


	//Load remote content
	$.ajax({
		type: "GET",
		url: remotePageUrl + "&action=raw",
		dataType: "text",
		success: remotePageContent,
		error: ajaxErrorFunc
	});	
}

var jElement
function loadDialog(id, height, width,position){
	var dialogSelector = ".ui-dialog #" + id
	if($(dialogSelector).length == 0){
		jElement = $($(window.frames[0].document).find("#" + id + "_snippet").clone().outerHTML())
		jElement.attr("id", id)
		$("#main").append(jElement)
		dialogSelector = "#main > #" + id
	}
	
	$(dialogSelector).dialog({ height: height, width: width, position:position })
			.dialog("widget").draggable("option","containment","none")	
}

var xml;

function handleXml(t_xml){
	xml = t_xml;
	
	//Load scenes
	$(xml).find("scenes > scene").each(function(){
		var sceneFolderHTML = "<li onclick='sceneClicked(this)' ><span class='scene'>"
									 + $(this).attr("name") 
									 + "</span>" 
									 //+ "<ul></ul>"
									 + "</li>";
		
		var scene = $(sceneFolderHTML).appendTo("#sceneList");
	});
	
	// first example
	//$("#browser").treeview();			
}

var currentScene = null;
var currentPage = null;

function ajaxErrorFunc(jqXHR, textStatus, errorThrown){
	alert("Error- Ajax load failed.");
}

var sceneName

function remotePageContent(text){
	$("#pageContents").text(text)
}

function sceneClicked(value){
	loadDialog("sceneDataDialog", 200, 300,[300,0])

	//loadDialog("sceneXMLEditorDialog", 200, 800,[0,200])
		
	sceneName = $(value).find("> span").html();
	currentScene = $(xml).find("scene[name='" + sceneName + "']");
	
	
	$("#sceneDataDialog").css("display", "block");
	
	$("#sceneName").html(sceneName);
	$("#pageList").empty();
	
	$(currentScene).find("> page").each(function(){
			$("#pageList").append("<li onclick='pageClicked(this)'><span class='page'>" 
								+ $(this).attr("id")
								+ "</span></li>");
	});
	
	$("#sceneXML").empty().append($("<textarea id='sceneXmlEditor'></textarea>"))
	$("#sceneXmlEditor").text(new XMLSerializer().serializeToString(currentScene[0]))
	
	//loadSceneEditor()
}

function saveSceneXML(){
	var currentSceneIndex = $(currentScene).index()
	$($(xml).find("config > scenes > scene")[currentSceneIndex]).remove()

	var re = new RegExp('xmlns="http://www.w3.org/1999/xhtml"',"g")

	var jSceneXml = $($("#sceneXmlEditor").val().replace(re, ""))

	var numberOfScenes = $(xml).find("config > scenes > scene").length

	if(currentSceneIndex == numberOfScenes){
		$(xml).find("config > scenes > scene").append(jSceneXml)
	}else{
		$($(xml).find("config > scenes > scene")[currentSceneIndex]).before(jSceneXml)
	}
	
	var config_xml_string = new XMLSerializer().serializeToString(xml)
	
	localStorage.decisionz = config_xml_string
	
	if(config_xml_string.length != localStorage.decisionz.length){
		alert("LocalStorage was not completeley stored")
	}
}

var pageId
var currentPage



function pageClicked(value){
	loadDialog("pageDataDialog", 200, 300,[600,0])
	
	//loadDialog("pageXMLEditorDialog", 200, 800,[0,200])
	
	pageId = $(value).find("> span").html();
	currentPage = $(currentScene).find("page[id='" + pageId + "']");
	
	$("#pageDataDialog").css("display", "block");
	
	$("#pageId").html(pageId);
	
	if($(currentPage).attr("checkpoint") != undefined){
		$("#pageCheckpoint").attr("value", $(currentPage).attr("checkpoint"))
	}else{
		$("#pageCheckpoint").attr("value", "")
	}
	
	if($(currentPage).attr("duration") != undefined){
		$("#pageDuration").attr("value", $(currentPage).attr("duration"))
	}else{
		$("#pageDuration").attr("value", "0000-00-00 00:00:00")
	}
	
	$("#pageContents").empty();
	
	var contentTags = $(currentPage).find("content *");
	
	var contentText = "";
	
	$(contentTags).each(function(){
			contentText += new XMLSerializer().serializeToString(this);
	});

	if(contentText.length != 0){
    	$("#pageContents").append(contentText);
	}else{
		loadPageContent()
	}
	
}

function pageCheckpointChanged(){
	if($("#pageCheckpoint").attr("value").length == 0){
		$(currentPage).removeAttr("checkpoint")
	}else{
		$(currentPage).attr("checkpoint",$("#pageCheckpoint").attr("value"))
	}
}

function pageDurationChanged(){
	if($("#pageDuration").attr("value") == "0000-00-00 00:00:00"){
		$(currentPage).removeAttr("duration")
	}else{
		$(currentPage).attr("duration",$("#pageDuration").attr("value"))
	}
}

var states = new Array();
var uml = Joint.dia.uml;

function diagramScenePages(){
	loadDialog("jointDialog", 400, 900,[0,300])
	
	states = new Array(); 
	pageDiagramNodes = new Array();
	parentList = new Array();
	
	$("#jointContents").empty();
	Joint.paper("jointContents", 800, 1000);
	
	//loop through pages creating elements
	thePages = $(currentScene).find("page");
	
	$(thePages).each(function(index, value){
		//Get the diagram
		var pageDiagramNode = $(xml).find("pageDiagram[sceneName='" + $(currentScene).attr("name")
									 + "'][pageName='" + $(value).attr("id")
									 + "']")
		
		if(pageDiagramNode.length == 0){
			$(xml).find("diagrams").append("<pageDiagram sceneName='" + $(currentScene).attr("name")
							+ "' pageName='" + $(value).attr("id")
							+ "' dx='0' dy='0' />");
		
			pageDiagramNode = $(xml).find("pageDiagram[sceneName='" + $(currentScene).attr("name")
									 + "'][pageName='" + $(value).attr("id")
									 + "']")
		}
				

		var dx = 0, dy = 0;
		
		if($(pageDiagramNode).attr("dx") != undefined){
			dx = $(pageDiagramNode).attr("dx") ;
		}
		
		if($(pageDiagramNode).attr("dy") != undefined){
			dy = $(pageDiagramNode).attr("dy") ;
		}
		var colorName = "green";
		
		if($(value).attr("type") != undefined &&
			$(value).attr("type").toLowerCase() == "pageforward"){
			colorName = "blue";		
		}
		
		var stateObj = uml.State.create({
		  rect: {x: dx, y: dy, width: 100, height: 60},
		  label: $(value).attr("id"),
		  attrs: {
		    fill: "90-#000-" + colorName + ":1-#fff"
		  },
		  shadow: true,
		  actions: {
		  }
		}).toggleGhosting();

		states.push(stateObj);
		
		pageDiagramNodes.push(pageDiagramNode);
	});

	
	//s2.scale(2);
	//s2.addInner(s4);
	
	//s1.joint(s3, uml.arrow).register(states);
	
	////Create the joints
	recursiveLinkPages("pageStart");

	
}


var thePages;

function recursiveLinkPages(thePageName){
	parentList.push(thePageName);
	
	//var thePage = $(currentScene).find("page[id='" + thePageName + "']");
	//var thePageIndex = $(thePage).index();
	var thePage;
	var thePageIndex = 0;
	
	var tally = 0;
	$(thePages).each(function(i,v){
		if($(v).attr("id") == thePageName){
			//found it so break
			thePage = v;
			thePageIndex = tally;
			return false;
		}
		
		tally++;
	});
	

	//Find the nextPage indexes
	var nextPageNames = new Array();
	
	var nextPageName = $(thePage).attr("nextpage");
	if(nextPageName != undefined){
		nextPageNames.push(nextPageName);
	}
	
	//Find the decision and pageCondition nextPages
	$(thePage).find("[nextpage]").each(function(index, value){
		nextPageNames.push($(value).attr("nextpage"));
	});
	
	
	$.each(nextPageNames, function(i,v){
		var nextPageIndex;
		tally = 0;

		$(thePages).each(function(i,v2){
			if($(v2).attr("id") == v){
				//found it so break
				nextPageIndex = tally;
				return false;
			}
			
			tally++;
		});
		
		//Create joint
		states[thePageIndex].joint(states[nextPageIndex], uml.arrow).register(states);
		
		
		if(jQuery.inArray(v, parentList) == -1){//Check for looped pages
			recursiveLinkPages(v);
		}
	});
}



var pageDiagramNodes = new Array();
function saveDiagram(){
	//loop through all states and transcribe the dx,dy values to the xml
	$.each(states, function(i,state){
		var pageNode = pageDiagramNodes[i];
		
		$(pageNode).attr("dx", state.wrapper.attrs.x);
		$(pageNode).attr("dy", state.wrapper.attrs.y);
	});
}

function loadSceneEditor() {
	//var extractor = new Xsd2Json("ATOM.xsd", {"schemaURI":"js/jquery.xmleditor-master/demo/examples/atom/"});
	//var extractor = new Xsd2Json("decisionz.xsd", {"schemaURI":"assets/configs/"});
	var extractor = new Xsd2Json("decisionzScene.xsd", {
		"schemaURI" : "assets/"
	});
	$("#sceneXmlEditor").xmlEditor({
		schema : extractor.getSchema()
	//,enableDocumentStatusPanel : false
	});
}
