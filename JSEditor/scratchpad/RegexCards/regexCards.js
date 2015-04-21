var params
var mediaPath = "sampleData/"

$(document).ready(function() {
	params = getParams(window.location.href);

	loadFiles()
})

var jConfig
var jDecks = $("<decks></decks>")
var jCards = $("<cards></cards>")
var jMatches = $("<matches></matches>")
var currentMatch = 0

function loadFiles(){
	get(mediaPath + "config.xml", function(t_config){
		jConfig = $(t_config)

		//Load decks
		get(mediaPath + "decks/" , function(t_decksDir){
			var deckFileList = getFileLinksFromDirectoryListing(t_decksDir)

			$.each(deckFileList, function(i,v){
				get(mediaPath + "decks/" + v , function(t_deck){
					var jdeck = $(t_deck)
					jdeck.attr("name", removeFileExt(v))
					jDecks.append(jdeck)
				})
			})

			//Load cards
			get(mediaPath + "cards/" , function(t_cardsDir){
				var cardFileList = getFileLinksFromDirectoryListing(t_cardsDir)

				$.each(cardFileList, function(i,v){
					get(mediaPath + "cards/" + v , function(t_card){
						jCards.append($(t_card))
					})
				})

				//Load matches
				get(mediaPath + "matches/" , function(t_matchesDir){
					var matchFileList = getFileLinksFromDirectoryListing(t_matchesDir)

					$.each(matchFileList, function(i,v){
						get(mediaPath + "matches/" + v , function(t_match){
							jMatches.append($(t_match))
						})
					})

					startGame()
				})	

			})	
		})	
	})
}


var whoseTurn 

var turnNum = 0
var numPlayers = 2

function startGame(){
	if(params['numPlayers'] != undefined){
		numPlayers = params['numPlayers']
	}

	var phraseArr = $(jMatches.find("match")[currentMatch]).find("phrase").text()
	$.each(phraseArr, function(i,v){
		$("#phrase").append("<div class='letter'>" + v + "</div>")
	})

	for(var i=0; i < numPlayers; i++){
		var jPlayer = $($("#snippet_playerContainer").html())
		jPlayer.find(".playerName").text("Player " + i)
		$("#playersContainer").append(jPlayer)
	}

	whoseTurn = getRandomInt(0,numPlayers-1)

	handleTurn()
}

var potentialRollPercent = .5
var jCurrentDeck

function handleTurn(){
	jCurrentDeck = jDecks.find("deck[name='" 
			+ $(jConfig.find("player")[whoseTurn]).attr("deck") + "']")

	$(".playerContainer").removeAttr("turn")
	
	$($(".playerContainer")[whoseTurn]).attr("turn","")

	console.log("turnNum:" + turnNum + "; whoseTurn:" + whoseTurn)

	//Handle potential
	var potentalRoll = 0
	
	if(getRandomArbitrary(0,1) >= potentialRollPercent){
		potentalRoll = 1
	} 

	console.log("potentalRoll:" + potentalRoll)

	$($("#main .playerPotentials")[whoseTurn]).text(
			parseInt($($("#main .playerPotentials")[whoseTurn]).text()) + potentalRoll)
	
	//Handle cards
	var j_card = randomCard()

	var j_card_snip = $($("#snippet_card").html())
	j_card_snip.text(j_card.text())
	$($(".playerCards")[whoseTurn]).append(j_card_snip)
	j_card_snip.draggable({revert: "invalid",containment: "#main", scroll: false})
	
	//End turn
	turnNum++	
}

function nextTurn(){
	if(whoseTurn == numPlayers - 1){
		whoseTurn = 0
	}else{
		whoseTurn++
	}

	handleTurn()
}

function randomCard(){
	var numberCards = jCurrentDeck.find("card").length
	var cardIndex = getRandomInt(0, numberCards - 1)

	var j_card = jCards.find("card[id='" 
					+ $(jCurrentDeck.find("card")[cardIndex]).attr("id")
					+ "']")
	if( j_card.length == 0){
		throw "Card undefined"
	}else{
		return j_card
	}
}

var colors = ["red", "orange", "yellow", "green", "blue", "purple"]

var jCurrentRegex

function newRegex(btnNode){
	var jRegEx = $($("#snippet_regex").html())

	var playerIndex = $(btnNode).parent().index()
	var randIndex = getRandomInt(0, colors.length - 1)

	console.log(randIndex)

	jRegEx.css("background-color", colors[randIndex])

	$(".playerRegexs:eq(" + playerIndex + ")").append(jRegEx)

	jRegEx.droppable({
		//accept: "#main .playerContainer:eq(" + playerIndex + ") .card",
		accept: ".card",
		hoverClass: "cardDropHover",
		drop: function( event, ui ) {
			jCurrentRegex = $(event.target)
			showFeedback("cardDrop")
			$(ui.draggable[0]).remove()
		}
 	});
}

function showFeedback(value){
	$("#clickGuard").css("display", "block")
	$("#feedback").css("display", "block")

	$("#feedbackMain > *").css("display","none")

	switch(value){
		case "cardDrop":
			$("#feedbackSelectLetterContainer").css("display","block")
			break;
	}
}

function closeFeedback(){
	$("#clickGuard").css("display", "none")
	$("#feedback").css("display", "none")
}

function letterSelected(node){
	jCurrentRegex.find("> .regexStr").append($(node).text())
	closeFeedback()
}

function updatePhraseMatches(){
	$("#phrase .letter").css("background-color", "inherit")

	$(".regexs .regexEnabled[enabled='true']").each(function(i_r,v_r){
		var regexLetter = $($(v_r).parent()).find("> .regexStr").text()
		
		$("#phrase .letter").each(function(i_l,v_l){
			var phraseLetter = $(v_l).text()

			if(regexLetter.toLowerCase() 
					== phraseLetter.toLowerCase()){
				$(v_l).css("background-color", $($(v_r).parent()).css("background-color") )
			}
		})
	})

	$("#playerRegexs .regexEnabled[enabled='true']").each(function(i_r,v_r){
		var regexLetter = $($(v_r).parent()).find("> .regexStr").text()
		
		$("#phrase .letter").each(function(i_l,v_l){
			var phraseLetter = $(v_l).text()

			if(regexLetter.toLowerCase() 
					== phraseLetter.toLowerCase()){
				$(v_l).attr("color", $($(v_r).parent()).attr("color") )
			}
		})
	})
}

function enableRegex(node){
	if($(node).attr("enabled") == undefined){
		$(node).attr("enabled", 'true')
	}else{
		$(node).removeAttr("enabled")
	}

	updatePhraseMatches()
}

//Utils ------------------------------------------

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getParams(url, ignoreArray) {
	if(typeof ignoreArray === 'undefined' ){
		ignoreArray = [];
	}
	
    var regex = /([^=&?]+)=([^&#]*)/g, params = {}, parts, key, value;

    while((parts = regex.exec(url)) != null) {

        key = parts[1], value = parts[2];
		
		var ignoreElement = false;
		for(var i=0; i< ignoreArray.length; i++){
			if(key == ignoreArray[i]){
				ignoreElement = true;
			}
		}

		if(ignoreElement == true){
			continue;
		}

        var isArray = /\[\]$/.test(key);

        if(isArray) {
            params[key] = params[key] || [];
            params[key].push(value);
        }
        else {
            params[key] = value;
        }
    }

    return params;
}

function getFileLinksFromDirectoryListing(indexPageData){
	var outputArr = []
	$(indexPageData)
		.find("*[src='/icons/unknown.gif']")
		.parent().next()
		.find("> a").each(function(i,v){
			outputArr.push($(v).attr("href"))
		})

	return outputArr
}

function get(url, callback){
	$.ajax({
		    type: "GET",
		    url: url,
		    dataType: "text",
			async: false,
		    success: callback,
		    error: ajaxErrorFunc
		});
}

function ajaxErrorFunc(jqXHR, textStatus, errorThrown){
	alert("Error: " + errorThrown);
}

function removeFileExt(filename){
	//return /([\w]+)([.][\w]+$)/.exec(filename)[1];
	if(/(.*)([.].+$)/.exec(filename) != undefined){
		return /(.*)([.].+$)/.exec(filename)[1]
	}else{
		return filename;
	}
}
//End Utils------------------------------------------------------