var waitingForKeyUp = false;
var currentCharacter = "edgar"
var xml

$(document).ready(function() {
	audioInit();
	
	//$("#edgar")[0].addEventListener( 'zwebkitAnimationIteration', 
    //	function( event ) { alert( "Finished transition!" ); }, false );

	/*document.onkeyup = function(e){
		waitingForKeyUp = false

		var parseLine = /walking(.*)/.exec($("#" + currentCharacter).attr("class"));

		$("#" + currentCharacter).removeClass("walking" + parseLine[1] )
		$("#" + currentCharacter).addClass("standing" + parseLine[1] )
	}
	
	document.onkeydown = function(e){
		if(waitingForKeyUp){
			return
		}

		$("#" + currentCharacter).removeClass()

		waitingForKeyUp = true

		var keynum = e.which;
		var keychar = String.fromCharCode(keynum);

		switch(keychar){
			case "W":
				$("#" + currentCharacter).addClass("walkingUp")
				break;
			case "D":
				$("#" + currentCharacter).addClass("walkingRight")
				break; 
			case "A":
				$("#" + currentCharacter).addClass("walkingLeft")
				break;
			case "S":
				$("#" + currentCharacter).addClass("walkingDown")
				break;  
		}   
	};*/

	//loadAnimation("animations/falconTerraEdgarDecideToRescueLocke.xml", false)
});

var currentFrame = 0

function loadAnimation(filename, play){
	$("#dialogBox").removeAttr("show")
	
	//Load xml
	$.get(filename, function( t_xml ) {
		xml = t_xml
		
		currentSceneChildIndex = 0
		
		playNextPlayableChild(play)
	});
}

function playNextPlayableChild(play){
	while(1){	
		var result = playSceneChild(currentSceneChildIndex, play)
		switch(result){
			case "not_playable":
			case "undefined":
				break
			default:
				return
		}
		
		currentSceneChildIndex++
	}
}

function playFrame(index, selector, keyframeNode){
	//Sprite
	$(selector).removeClass()
	$(selector).addClass($(keyframeNode).attr('class'))
	
	if($(keyframeNode).attr("audio") != undefined){
		var loop = false
		
		if($(keyframeNode).attr("loop") != undefined){
			loop = true
		}
		
		loadHTMLAudio($(keyframeNode).attr("audio"), "", "htmlAudioPlayerDiv",loop)
		//$("audio")[0].play()
	}
}

function playAnimationGroup(groupNode){
	var time = 0
	var selector = $(groupNode).attr("selector")
	//var numberOfFrames = $(groupNode).find("keyframe").length
	
	$(groupNode).find("keyframe").each(function(i,v){
		setTimeout(function(){playFrame(i,selector,v)}, parseInt($(v).attr("starttime")));
		//time =  parseInt($(v).attr("endtime"))
	})
}

//var numAnimations = 0

function playAnimation(animationNode){
	//numAnimations = 0
	
	$(animationNode).find("group").each(function(i,v){
		//numAnimations++
		playAnimationGroup(v)
	})
	
	//Set callback that animation is finished
	if($(animationNode).attr("endtime") == undefined){
		alert("no endtime for animation found")
	}else{
		setTimeout(function(){animationFinished()}, 
						$(animationNode).attr("endtime"));
	}
}

function okClicked(){
	$("#dialogBox").removeAttr("show")
	currentSceneChildIndex++
	playSceneChild(currentSceneChildIndex)
}

function animationFinished(){
	//numAnimations--

	//if(numAnimations == 0){
		animationsFinished()
	//}
}

function animationsFinished(){
	currentSceneChildIndex++
	playSceneChild(currentSceneChildIndex)
}

var currentSceneChildIndex = 0

function playSceneChild(index, play){
	if(play == undefined){
		play = true;
	}
	
	var v = $(xml).find("scene > *")[index]
	
	if(v == undefined){
		return "undefined"
	}
	
	switch(v.tagName){
		case "animation":
			if($(v).attr("loadhtml") != undefined){
				//Load html
				var selector = "#main"
				
				if($(v).attr("selector") != undefined){
					selector = $(v).attr("selector")
				}
					
				$(selector).load($(v).attr("loadhtml"),function(){
					if(play){
						playAnimation(v)
					}
				})
			}else{
				if(play){
					playAnimation(v)
				}
			}
			
			break;
		case "page":
			$("#dialogBox").attr("show", "true")
			$("#dialogBox > #dialog").text($(v).text())
			break;
		default:
			return "not_playable";
	}
}