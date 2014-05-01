var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

function addInfovisTab() {
    var containerId = "tabs";
    var value = $("#" + containerId).tabs("length");
    value = value + 1;
    
    var tabId = value;
    
    addTab("Bar Chart " + tabId, containerId, tabId, '<div id="infovis_' + tabId + '" class="infovis"></div>')
	
	return tabId;
}


function treeTab(){
	loadFileShortcut("treeViewUl", "text", function(tabText){
		var tabId = addTab("Tree Demo", "tabs", null, tabText);
		
		$("#tabs").tabs({selected: tabId - 1}); 
	});
}

function areaChartTab(json){
	var tabId = addInfovisTab();
	$("#tabs").tabs({selected: tabId - 1}); 
	
	if(json == null){
	    var json = {
        'label': ['label A', 'label B', 'label C', 'label D'],
        'values': [
        {
          'label': 'date A',
          'values': [20, 40, 15, 5]
        }, 
        {
          'label': 'date B',
          'values': [30, 10, 45, 10]
        }, 
        {
          'label': 'date E',
          'values': [38, 20, 35, 17]
        }, 
        {
          'label': 'date F',
          'values': [58, 10, 35, 32]
        }, 
        {
          'label': 'date D',
          'values': [55, 60, 34, 38]
        }, 
        {
          'label': 'date C',
          'values': [26, 40, 25, 40]
        }]
      }; 	
	}
	
	var areaChart = loadAreaChart(tabId);
	
	areaChart.loadJSON(json);
}

function loadAreaChart(tabId) {
	
    var areaChart = new $jit.AreaChart({
      //id of the visualization container
      injectInto: 'infovis_' + tabId,
      //add animations
      animate: true,
      //separation offsets
      Margin: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
      },
      labelOffset: 10,
      //whether to display sums
      showAggregates: true,
      //whether to display labels at all
      showLabels: true,
      //could also be 'stacked'
      type: useGradients? 'stacked:gradient' : 'stacked',
      //label styling
      Label: {
        type: labelType, //can be 'Native' or 'HTML'
        size: 13,
        family: 'Arial',
        color: 'white'
      },
      //enable tips
      Tips: {
        enable: true,
        onShow: function(tip, elem) {
          tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
        }
      },
      //add left and right click handlers
      filterOnClick: true,
      restoreOnRightClick:true
    });
    
    return areaChart;
}

function barChartTab(json){
	var tabId = addInfovisTab();
	$("#tabs").tabs({selected: tabId - 1}); 
	
	if(json == null){
	    json = {
		'values': [
		{
		'label': 'dan',
		'values': [105, 40, 15, 7]
		},
		{
		'label': 'date B',
		'values': [30, 40, 45, 9]
		},
		]
		}; 	
	}
	
	var barChart = loadBarChart(tabId);
	
	barChart.loadJSON(json);
}





function loadBarChart(tabId) {
    var barChart = new $jit.BarChart({

        //id of the visualization container
        injectInto: 'infovis_' + tabId,
        //whether to add animations
        animate: true,
        //horizontal or vertical barcharts
        orientation: 'vertical',
        //bars separation
        barsOffset: 20,
        //visualization offset
        Margin: {
            top: 5,
            left: 5,
            right: 5,
            bottom: 5
        },
        //labels offset position
        labelOffset: 5,
        //bars style
        type: useGradients ? 'stacked:gradient' : 'stacked',
        //whether to show the aggregation of the values
        showAggregates: true,
        //whether to show the labels for the bars
        showLabels: true,
        //labels style
        Label: {
            type: labelType, //Native or HTML
            size: 13,
            family: 'Arial',
            color: 'white'
        },
        //add tooltips
        Tips: {
            enable: true,
            onShow: function(tip, elem) {
                tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
            }
        }
    });
    
    return barChart;
}


function addTab(tabLabel, containerId, tabId, tabText) {
    if (tabId == '' || tabId == null) {
        var value = $("#" + containerId).tabs("length");
        value = value + 1;
        tabId = value;
    }
    
    if (tabLabel == '' || tabLabel == null) {
        tabLabel = tabId;
    }
    
    if (tabText == '' || tabText == null) {
        tabText = tabId;
    }
    
    $('#' + containerId).append("<div id='tab_" + tabId + "'>" + tabText + "</div>");
    $('#' + containerId).tabs("add", "#tab_" + tabId, tabLabel);

	return tabId;
}


function loadFile(filename, fileType, resultsFunc) {
    $.ajax({
        type: "GET",
        url: filename,
        dataType: fileType,
        success: resultsFunc
    });
}


var g_file;

var fileShortcuts = {"xmlConcept":"file:///home/owner/Desktop/daniel_backup/code/codeVisualization/xmlConcept.xml",
			"treeViewUl": "file:///home/owner/Desktop/daniel_backup/code/html_projects/JS_Editor/snippets/treeview_ul_list.txt",
		};

function loadFileShortcut(file, fileType, resultFunc) {
	filename = file;
	if(fileShortcuts[file] != null){
		filename = fileShortcuts[file];
	}
	
	if(fileType == null){
		fileType = "xml";
	}
	
	if(resultFunc == null){
		resultFunc = function(xml) {g_file = xml;};
	}
	
	loadFile(filename, fileType, resultFunc)
	
}

var secondState = false;
function shapeClick(e){
	if(!secondState){
		//secondState = true;
		$("X3D")[0].runtime.nextView();
	}
	
	d3.select("#trans2")
		.attr("translation","0 -50 0")
		.attr("scale","1 1 1")

	d3.select("#trans3")
		.attr("translation","0 -50 0")
		.attr("scale","1 1 1")

	d3.select("#trans4")
		.attr("translation","0 -50 0")
		.attr("scale","1 1 1")
	
	d3.select("#trans2")
		.transition()
		.delay("250")
		.duration(2000)
		.attr("translation","-10 0 0")

	d3.select("#trans3")
		.transition()
		.delay("750")
		.duration(2000)
		.attr("translation","-8.5 0 5")

	d3.select("#trans4")
		.transition()
		.delay("1250")
		.duration(2000)
		.attr("translation","-7 0 10")
		
	d3.select("Material")
	 	.transition()
	 	.duration(3000)
	 	.attr("diffuseColor", Math.random() + " " 
	 								+ Math.random() + " " 
	 								+ Math.random() + " ")
}
