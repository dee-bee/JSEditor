var ctx
var ctxb
var jPlayer
var jPlayer_collisionBox
var jCanvas

var jPlayer_collisionBox_height
var playerCollisionRect = {}
var backgroundImgData
var backgroundWidth
var backgroundHeight

$(document).ready(function () {	
	var tally = 0
	var start = null;
	var cannonball = document.getElementById("cannonball");
	
	jPlayer = $("#main #player")
	jPlayer_collisionBox = $("#main #player .collisionBox")
	jCanvas = $("#theCanvas")

	jPlayer_collisionBox_height = parseInt(trimPX(jPlayer_collisionBox.css("height")))

	ctxb = $("#theCanvasBackground")[0].getContext("2d");
	backgroundWidth = parseInt(trimPX($("#theCanvasBackground").css("width")))
	backgroundHeight = parseInt(trimPX($("#theCanvasBackground").css("height")))
	
	var c=document.getElementById("theCanvas");
	ctx=c.getContext("2d");
	ctx.fillStyle="#00FF00";
	//ctx.translate( 75, 75);

	ctxb.drawImage($("#backgroundImg")[0],0,0)
	backgroundImgData = ctxb.getImageData(0, 0,backgroundWidth ,backgroundHeight).data
	

	function step(timestamp) {
	  /*if (!start) start = timestamp;

	  var left = cannonball.style.left 

	  if(left == ""){
	  	left = "0px"
	  }

	  cannonball.style.left = parseInt(trimPX(left)) + 1 + "px"
		

		rotateAndFill(2)*/


		//handlePlayerCollisions()

		//If player is below the floor then adjust player to floor
		//Just use bounding box corners for testing
		var boundingRect = jPlayer_collisionBox[0].getBoundingClientRect() 

		ctx.clearRect(0,0,jCanvas[0].width, jCanvas[0].height);

		//Adjust playerCollisionRect
		playerCollisionRect.left = boundingRect.left 
		playerCollisionRect.right = boundingRect.right 
		playerCollisionRect.top = boundingRect.top 
		playerCollisionRect.bottom = boundingRect.bottom 

		if(gravityEnabled){
			playerCollisionRect.top += 10
			playerCollisionRect.bottom += 10	
		}
		


		handlePointCheck(playerCollisionRect.left
							, playerCollisionRect.bottom
							, "bottomLeft")

		handlePointCheck(playerCollisionRect.right
							, playerCollisionRect.bottom
							, "bottomRight")
		
		
		//Mark the point checks
		ctx.fillRect(playerCollisionRect.left , playerCollisionRect.top ,5,5);
		ctx.fillRect(playerCollisionRect.right - 5, playerCollisionRect.top,5,5);
		ctx.fillRect(playerCollisionRect.left, playerCollisionRect.bottom - 5,5,5);
		ctx.fillRect(playerCollisionRect.right - 5, playerCollisionRect.bottom - 5,5,5);

		//Now set the player location	
		jPlayer.css("top", playerCollisionRect.top + "px")	
		
		window.requestAnimationFrame(step);
		//console.log(tally++)
	}

	window.requestAnimationFrame(step);
})


function handlePointCheck(x,y,type){
	switch(type){
		case "bottomLeft":
		case "bottomRight":
			while(1){
				var color = getPixelValue(x, y)

				if(color == "255:0:0:255"){
					//We are below the floor so keep moving up until it isn't below
					y--
				}else{
					break;
				}
			}

			playerCollisionRect.top = (y - jPlayer_collisionBox_height)
			playerCollisionRect.bottom = y

			break
		case "topLeft":
			break
		case "topRight":
			break
	}
}

var gravityEnabled = false
function interval(){
	rotateAndFill(4)
}

function handlePlayerCollisions(){
	//Grab the location of the player collision box
	var playerCollisionRect = jPlayer_collisionBox[0].getBoundingClientRect() 
	
	//Fill the box on the canvas
	
	ctx.clearRect(0,0,jCanvas[0].width, jCanvas[0].height);
	ctx.fillRect(playerCollisionRect.left
				, playerCollisionRect.top
				,playerCollisionRect.right 
					- playerCollisionRect.left 
				,playerCollisionRect.bottom - 
					playerCollisionRect.top );
}

function rotateAndFill(degAngle){
	ctx.clearRect(-79,-79,157,157);
	ctx.rotate(degAngle * Math.PI / 180);
	ctx.fillRect(-75,-75,150,150);
}

/*	//load 100 smoke clouds
	for(var i=0;i<100;i++){
		var jSnippet_smokeCloud = $($("#snippet_smokeCloud").html())
		jSnippet_smokeCloud.addClass("smokeCloud" +i)
		//console.log(".smokeCloud" +i + "{}")
		$("#main").append(jSnippet_smokeCloud)
	}
})*/

var tally = 0
function getPixelValue(x,y){
	var backgroundWidthXY = (x + (backgroundWidth * y)) * 4
	var out = backgroundImgData[backgroundWidthXY ] + ":" +
				backgroundImgData[backgroundWidthXY + 1] + ":" +
				backgroundImgData[backgroundWidthXY + 2] + ":" +
				backgroundImgData[backgroundWidthXY  + 3]

	if(out != "0:0:0:0"){
		//console.log(tally++ + "diff val:" + out)
	}


	//console.log(backgroundWidthXY)
	 //$("#pixelValue").text(out)

	 return out
}

function outputAllSmokeCloudCSS(){
	var output = ""
		
	//Loop through all smoke clouds
	$("#main .smokeCloud").each(function(i,v){
		var className = "smokeCloud" + i          

        output += "\n." + className 
                        + "{ left:" + $(v).css("left") + ";" 
                        + "opacity:0;"
                        + " transition-delay:." + (800 - trimPX($(v).css("left"))) + "s;"
                        + "top:" + $(v).css("top") + ";}\n"

        output += "\n" + "#main[fired='true'] " + "." + className 
                        + "{ opacity:1;}\n"
		//get the left and top values
    	
	})

	//output the values
	console.log(output)
}

function trimPX(value){
	return value.substring(0,value.length - 2)
}

window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      moveLeft();
    break;

    case 38: // Up
      moveUp();
    break;

    case 39: // Right
      moveRight();
    break;

    case 40: // Down
      moveDown();
    break;
   
    case 32: // Space
      moveJump();
    break;
  }
}, false);

function moveJump(){
	moveUp()
}

function moveLeft(){
	var left = parseInt(trimPX(jPlayer.css("left")))
	
	jPlayer.css("left", (left - 10) + "px")
}

function moveUp(){
	var top = parseInt(trimPX(jPlayer.css("top")))
	
	jPlayer.css("top", (top - 10) + "px")	
}

function moveRight(){
	var left = parseInt(trimPX(jPlayer.css("left")))
	
	jPlayer.css("left", (left + 10) + "px")
}

function moveDown(){
	var top = parseInt(trimPX(jPlayer.css("top")))
	
	jPlayer.css("top", (top + 10) + "px")	
}

function enableGravity(){

}

