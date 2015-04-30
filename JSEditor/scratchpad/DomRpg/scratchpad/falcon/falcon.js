var backX = -186
var backY = -65

var rotAng = 0
var rotAngPre = "rotate3d(1,0,0,84deg) rotate3d(0,0,1,"

$(document).ready(function() {	
	document.onkeyup = function(e){
	}
	
	document.onkeydown = function(e){
		var keynum = e.which;
		var keychar = String.fromCharCode(keynum);

		switch(keychar){
			case "W":
                //alert("hi")
				 
				 backX++
				 backY++
				break;
			case "D":
				backX++
				break; 
			case "A":
				backY++
				break;
			case "S":
				 backX--
				 backY--
		
				break;
			case "Z":
				rotAng++
				break;
			case "C":
				 rotAng--		
				break;  
		}   
		
		if(rotAng >= 360){
			rotAng = 1
		}else if(rotAng < 0){
			rotAng = 359
		}
		
		
		$("#airship").css("background-position"
				, backX + "px " + backY + "px" )
		
		$("#airship").css("transform"
				, rotAngPre + rotAng + "deg)" )
		 
	};
});