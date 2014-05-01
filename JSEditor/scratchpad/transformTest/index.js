$(document).ready(function () {	
	$("svg text").click(function(v){
	    var i = $("text").index(v.currentTarget) + 1
	    //alert(i)
	    spin(i)
	})

	$("#spinner")[0].addEventListener( 'webkitTransitionEnd', 
		    function( event ) {
				//lockJump = true
				//$("#spinner").removeClass("up") 
			}, false );
})
function keyUp(event){
	var keycode;
    
	lockJump = false
	
	if (window.event)
        keycode = window.event.keyCode;
    else if (e)
        keycode = e.which;
    
	switch(keycode){
		case 32: //Space
	    	$("#spinner").removeClass("up")
	    	break
	    case 68: //Right
	    	$("#spinner > #rightLeft").removeClass("right")
	    	break
	
	}
}


var lockJump = false
function keyDown(event){
    var keycode;
    if (window.event)
        keycode = window.event.keyCode;
    else if (e)
        keycode = e.which;

    console.log("key down")
    
    switch(keycode){
	    case 32: //Space
	    	if(lockJump){
	    		return
	    	}
	    	
	    	$("#spinner").addClass("up")
	    	break
	    case 68: //Right
	    	$("#spinner > #rightLeft").addClass("right")
	    	break
	    case 65: //Left
	    	break
    }
}

function spin(value){
	$("#spinner").removeClass()
	
	switch(value){
		case 1:
			$("#spinner").addClass("spinIt1")
			break;
		case 2:
			$("#spinner").addClass("spinIt2")
			break;
		case 3:
			$("#spinner").addClass("spinIt3")
			break;
	}
}
