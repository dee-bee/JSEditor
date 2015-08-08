var params
var mediaPath = "sampleData/"

// Init  -----------------------------------------------------

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


var currentPlayerIndex 

var turnNum = 0
var numPlayers = 2

function startGame(){
	if(params['numPlayers'] != undefined){
		numPlayers = params['numPlayers']
	}
	
	var phraseArr = $(jMatches.find("match")[currentMatch]).find("phrase").text()
	$.each(phraseArr, function(i,v){
		var jLetter = $($("#snippet_letter").html())
		jLetter.find(".letter").text(v)
		$("#phrase").append(jLetter)

		//Also update the letter select dialog
		var jLetterSelect = $($("#snippet_letterSelect").html())
		jLetterSelect.text(v)
		$("#feedbackSelectLetterContainer").append(jLetterSelect)
	})

	if(numPlayers == 2){
		var jPlayer = $($("#snippet_playerContainer").html())
		jPlayer.find(".playerName").text("Player " + 1)
		jPlayer.insertBefore("#phrase")

		var jPlayer = $($("#snippet_playerContainer").html())
		jPlayer.find(".playerName").text("Player " + 2)
		$("#main").append(jPlayer)

	}else{
		for(var i=0; i < numPlayers; i++){
			var jPlayer = $($("#snippet_playerContainer").html())
			jPlayer.find(".playerName").text("Player " + i)
			$("#main").append(jPlayer)
		}
	}

	currentPlayerIndex = getRandomInt(0,numPlayers-1)

	handleTurn()
}


// End Init -----------------------------------------------------

var potentialRollPercent = .5
var jCurrentDeck

function handleTurn(){
	jCurrentDeck = jDecks.find("deck[name='" 
			+ $(jConfig.find("player")[currentPlayerIndex]).attr("deck") + "']")

	$(".playerContainer").removeAttr("turn")
	
	$($(".playerContainer")[currentPlayerIndex]).attr("turn","")

	console.log("turnNum:" + turnNum + "; currentPlayerIndex:" + currentPlayerIndex)

	//Handle potential
	var potentalRoll = 0
	
	if(getRandomArbitrary(0,1) >= potentialRollPercent){
		potentalRoll = 1
	} 

	console.log("potentalRoll:" + potentalRoll)

	$($("#main .playerPotentials")[currentPlayerIndex]).text(
			parseInt($($("#main .playerPotentials")[currentPlayerIndex]).text()) + potentalRoll)
	
	//Handle cards
	var j_card = randomCard(jCurrentDeck)

	var j_card_snip = $($("#snippet_card").html())
	j_card_snip.text(j_card.text())
	$($(".playerCards")[currentPlayerIndex]).append(j_card_snip)
	j_card_snip.draggable({revert: "invalid",containment: "#main", scroll: false})
	
	//End turn
	turnNum++	
}

function nextTurn(){
	if(currentPlayerIndex == numPlayers - 1){
		currentPlayerIndex = 0
	}else{
		currentPlayerIndex++
	}

	handleTurn()
}

function updatePhraseMatches(jRegexNode){
	if(jRegexNode.attr("enabled") == "true"){
		//Regex enabled
		//Loop through each letter in the phrase
		$("#phrase .letter").each(function(i_l,v_l){
			//Is this a match?
			var phraseLetter = $(v_l).text()

			var jLetterContainer = $($(v_l).parent())

			if(jRegexNode.find("> .regexStr").text() == phraseLetter){
				jLetterContainer.on("transitionend", function(){
					jLetterContainer.off("transitionend")
					$(v_l).css("background-color","yellow")
				})

				$(v_l)
					.attr("playerIndex", currentPlayerIndex)
					.attr("regexIndex", jRegexNode.index())
					.css("background-color",
							$(jConfig.find("player")[currentPlayerIndex]).attr("color")
					)
			}

			//Is this owned by another player?
				//Yes
					//Do battle
				//No
					//Grab it

		})

	}else{
		//Regex disabled
		//Remove all regex matches for this regex node
		$("#phrase .letter[playerIndex='" + currentPlayerIndex + "']" 
					+ "[regexIndex='" + jRegexNode.index() + "']")
												.removeAttr("playerIndex")
												.removeAttr("regexIndex")
												.css("background-color", "")
	}
}


// Regex UI functions -------------------------------------------------------

var jCurrentRegex

function newRegex(btnNode, dropFunc){
	var jRegEx = $($("#snippet_regex").html())

	var playerIndex = $(btnNode).parent().index(".playerContainer")
	var randIndex = getRandomInt(0, colors.length - 1)

	console.log(randIndex)

	jRegEx.css("background-color", colors[randIndex])

	$(".playerRegexs:eq(" + playerIndex + ")").append(jRegEx)

	jRegEx.droppable({
		//accept: "#main .playerContainer .card",
		accept: function(draggable){
				if($(this).hasClass("regex")
						&& $(this).parent().index(".playerRegexs") ==
							currentPlayerIndex){
					return true
				}

				return false
			},
		hoverClass: "cardDropHover",
		drop: dropFunc
 	});
}

function regexDropFunc( event, ui ) {
	jCurrentRegex = $(event.target)
	showFeedback("cardDrop")
	$(ui.draggable[0]).remove()
}

function toggleRegex(){
	closeFeedback()

	if(jCurrentRegex.attr("enabled") == undefined){
		jCurrentRegex.attr("enabled", 'true')
	}else{
		jCurrentRegex.removeAttr("enabled")
	}

	updatePhraseMatches(jCurrentRegex)
}

// End Regex UI functions -------------------------------------------------------
// Dialog Functions --------------------------------------------------------
function showFeedback(value, param1){
	$("#clickGuard").css("display", "block")
	$(".feedback").css("display", "none")

	switch(value){
		case "cardDrop":
			$("#feedbackLetterSelect").css("display","block")
			break;
		case "toggleRegex":
			//Setup the warning dialog
			jCurrentRegex = $(param1).parent()

			if(jCurrentRegex.attr("enabled") == undefined){
				$("#feedbackToggleRegex").attr("state", "enable")
			}else{
				$("#feedbackToggleRegex").attr("state", "disable")
			}

			$("#feedbackToggleRegex").css("display","block")
			break;
	}
}

function closeFeedback(){
	$("#clickGuard").css("display", "none")
	$(".feedback").css("display", "none")
}

function letterSelected(node){
	jCurrentRegex.find("> .regexStr").append($(node).text())
	closeFeedback()
}


// End Dialog Functions --------------------------------------------------------

// RegexCards Utils (functions that are utility only for this app)----------

function randomCard(jDeck){
	var numberCards = jDeck.find("card").length
	var cardIndex = getRandomInt(0, numberCards - 1)

	var j_card = jCards.find("card[id='" 
					+ $(jDeck.find("card")[cardIndex]).attr("id")
					+ "']")
	if( j_card.length == 0){
		throw "Card undefined"
	}else{
		return j_card
	}
}

var colors = ["red", "orange", "yellow", "green", "blue", "purple"]


// End RegexCards Utils (functions that are utility only for this app)----------

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