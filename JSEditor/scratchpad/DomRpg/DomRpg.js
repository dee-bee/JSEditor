var waitingForKeyUp = false;
var currentCharacter = "edgar"
var xml

$(document).ready(function() {
	//$("#edgar")[0].addEventListener( 'zwebkitAnimationIteration', 
    //	function( event ) { alert( "Finished transition!" ); }, false );

	document.onkeyup = function(e){
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
	};

	$.get( "animate.xml", function( t_xml ) {
		xml = t_xml
		
		playSceneChild(currentSceneChildIndex)
	});
		
});

var currentFrame = 0

function playFrame(index, name, keyframeNode, numberOfFrames){
	//Sprite
	$("#" + name).removeClass()
	$("#" + name).addClass($(keyframeNode).attr('sprite'))
	
	//Container
	if($(keyframeNode).attr('container') != undefined){
		$("#" + name + "Container").removeClass()
		$("#" + name + "Container").addClass($(keyframeNode).attr('container'))
	}
}

function playCharacterAnimation(characterNode){
	var time = 0
	var name = $(characterNode).attr("name")
	var numberOfFrames = $(characterNode).find("keyframe").length
	
	$(characterNode).find("keyframe").each(function(i,v){
		setTimeout(function(){playFrame(i,name,v, numberOfFrames)}, time);
		time += parseInt($(v).attr("time"))
	})
	
	setTimeout(function(){animationFinished()}, time);
}

var numAnimations = 0

function playAnimation(animationNode){
	numAnimations = 0
	
	$(animationNode).find("character").each(function(i,v){
		numAnimations++
		playCharacterAnimation(v)
	})
	
}

function okClicked(){
	$("#dialogBox").removeAttr("show")
	currentSceneChildIndex++
	playSceneChild(currentSceneChildIndex)
}

function animationFinished(){
	numAnimations--

	if(numAnimations == 0){
		animationsFinished()
	}
}

function animationsFinished(){
	currentSceneChildIndex++
	playSceneChild(currentSceneChildIndex)
}

var currentSceneChildIndex = 0

function playSceneChild(index){
	var v = $(xml).find("scene > *")[index]
	
	if(v == undefined){
		return
	}
	
	switch(v.tagName){
		case "animation":
			playAnimation(v)
			break;
		case "dialog":
			$("#dialogBox").attr("show", "true")
			$("#dialogBox > dialog").text($(v).text())
			break;
	}
}