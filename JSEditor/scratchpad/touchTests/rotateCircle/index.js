$(document).ready(function() {
	document.title = "ready"
	document.onselectstart = function(){ return false; }
});

var count = 0

function bodyTouchStart(ev){
	ev.preventDefault()
}

function touchStart(ev){
	$("#layer1").css("-webkit-transform-origin", "50% 50%")
	ev.preventDefault()
	document.title = "touchStart" + count++
	console.log("touchStart" + count)
	$("#output").text("touchStart" + count)
}

function touchMove(ev){
	//ev.preventDefault()
	document.title = "touchMove" + count++
	console.log("touchMove" + count)
	$("#output").text("touchMove" + count)	

	var touch = ev.touches[0];
	var x = touch.pageX - 175
	var y = (touch.pageY - 300) * -1
	var deg = Math.atan2(x,y ) * 180/Math.PI	
	
	$("#output").append("(" + deg + "," + x + "," + y + ")")	

	$("#layer1").css("-webkit-transform", "rotateZ(" + deg + "deg)")
}

function touchEnd(ev){
	//ev.preventDefault()
	document.title = "touchEnd" + count++
	console.log("touchEnd" + count)	
	$("#output").text("touchEnd" + count)
}

function touchEnter(ev){
	//ev.preventDefault()
	document.title = "touchEnter" + count++
	console.log("touchEnter" + count)
	$("#output").text("touchEnter" + count)	
}

function touchLeave(ev){
	//ev.preventDefault()
	document.title = "touchLeave" + count++
	console.log("touchLeave" + count)
	$("#output").text("touchLeave" + count)	
}

function touchCancel(ev){
	//ev.preventDefault()
	document.title = "touchCancel" + count++
	console.log("touchCancel" + count)	
	$("#output").text("touchCancel" + count)
}
