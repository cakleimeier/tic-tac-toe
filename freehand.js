// This program uses a minimax algorithm (like in this article: http://mostafa-samir.github.io/Tic-Tac-Toe-AI/ ) for the computer player.
// It determines what all the possible next game states could be, based on the current state, and computes a score for each of them.
// It does this with the aiTurn, mini, and max functions.
// The ** mini ** function finds the lowest score, assumes that the human will take that, and calls the ** max ** function.
// The ** max ** function find the highest score and takes that.
// This tradeoff continues until an end state is reached. That state's score is returned.
// The ** aiTurn ** function calls the ** mini ** function, finds the highest scoring move, and takes it.

// Game State variables
	
	// is the game beginning, running, or over?
	var status;

	// who won?
	var winner;

	// points for computer, human, and draw
	var computerPoints= 0;
	var humanPoints= 0;
	var drawPoints= 0;


	// the arrangement of the board
	var board= [
		"E","E","E",
		"E","E","E",
		"E","E","E"
	];

	// whose turn is it?
	var turn;

	// is computer X or O?
	var computer= "O";

	// is user X or O?
	var human= "X";

	// empty squares
	var empties=[];

// Game functions

	// switch whose turn it is:
		// if the game is over at this turn,
		// find out who won and run the ** whoWon ** function;
		// otherwise, find out whose turn it was, switch it, and initiate the next player's turn
	var switchTurn= function(){
		console.log("before: "+turn);
		turn = turn === human ? computer : human;
		console.log("after: "+turn);
		var testing= endTest(board);

		// if the game is over
		if (testing.status=="over") {

			console.log("GAME OVER");

			// figure out who won
			winner = testing.winner;
			// disable the board
			$("table").removeClass("enabled").addClass("disabled");
			setTimeout(whoWon, 500);
		} else {
			
			// if it's computer's turn
			if (turn=== computer) {
				// disable board for user
				$("table").removeClass("enabled").addClass("disabled");
				// notify computer to take its turn
				aiTurn();
			} else {
				// enable board for user
				// run user turn function
				$("table").removeClass("disabled").addClass("enabled");
				userTurn();
			}
		}
	};

	// get empty squares
	var findEmpties= function(state, blanks){
		empties=[];
		var blankSquares=[];
		if (!blanks){
			for (var i = 0; i < state.length; i++) {
				if(state[i]==="E"){
					empties.push(i);
				}
			}
			return empties;
		} else {
			for (var i = 0; i < state.length; i++) {
				if(state[i]==="E"){
					blankSquares.push(i);
				}
			}
			return blankSquares;
		}
	};

	// check if a given square is empty
	var isItEmpty= function(square, state, blanks){
		// get an array of the currently-empty squares
		var empties= findEmpties(state, blanks);
		// if the passed element IS in the array of empty squares,
		// then it's empty; return true
		if (empties.indexOf(square) != -1) {
			return true;
		}
	};

	// check if the game is over (win or draw)
	var endTest= function(state, blanks){

		// holds the info about the status of the game
		var game= {
			winner: '',
			status: '',
			bool: false,
		};

		// find empty spaces, to check for draw later
		findEmpties(state, blanks);
		var blankSquares= findEmpties(state, blanks);

		// check for horizontal matches
		function horizontal(){
			for(var i = 0; i <= 6; i = i + 3) {
				if(state[i] !== "E" && state[i] === state[i + 1] && state[i + 1] == state[i + 2]) {
					game.winner = state[i];
				    game.status= "over"; 
				    game.bool= true;
				    return true;			    
				}
			}
		}
			
		// check for vertical matches
		function vertical(){
			for(var i = 0; i <= 2 ; i++) {
				if(state[i] !== "E" && state[i] === state[i + 3] && state[i + 3] === state[i + 6]) {
				    game.winner = state[i]; //update the state result
				    game.status= "over";
				    game.bool= true;
				    return true;
				}
			}
		}

		// check for diagonal matches
		function diagonal(){
			for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
				if(state[i] !== "E" && state[i] == state[i + j] && state[i + j] === state[i + 2*j]) {
				    game.winner = state[i]; //update the state result
				    game.status= "over";
				    game.bool= true;
				    return true;
				}
			}
		}

		// run the checks to see if any are true
		function winCheck(state, blanks){
			if(horizontal()===true || vertical()===true || diagonal()===true){
				return true;
			} else {
				return false;
			}
		}

		// combine all of the above into an end test:
			// if somebody won, return that
			// if nobody won but there are no empty spaces, it's a draw
			// otherwise, the game is still running
			if (winCheck(state, blanks)===true) {
				return game;
			} else if (blankSquares.length==0 && winCheck(state)===false) {
				game.winner= "draw";
				game.status= "over";
				game.bool= true;
				return game;
			} else {
				game.winner= "";
				game.status= "running";
				game.bool= false;
				return game;
			}
	};

	// determines the winner, increments the score, and displays the modal
	var whoWon= function(){ 
		if (winner==computer) {

			computerPoints++;
			$("#computerPoints").html(computerPoints);
			console.log(computerPoints);
			// show Modal for "lose"
			$(".lose").show("bounce");
			$(".close").click(function() {
				$(".lose").hide("bounce");
				turn= human;
				setTimeout(start, 300);
			});
		} else if (winner==human) {

			humanPoints++;
			$("#humanPoints").html(humanPoints);
			console.log(humanPoints);
			// show Modal for "win"
			$(".win").show("bounce");
			$(".close").click(function() {
				$(".win").hide("bounce");
				turn= computer;
				setTimeout(start, 300);
			});
		} else{

			drawPoints++;
			$("#drawPoints").html(drawPoints);
			console.log(drawPoints);
			// show Modal for "draw"
			$(".draw").show("bounce");
			$(".close").click(function() {
				$(".draw").hide("bounce");
				turn = human;
				setTimeout(start, 300);
			});
		}
	};

	// disable occupied squares (to be used when it's the player's turn)
	var disable= function(state, blanks){

		// find empty squares
		findEmpties(state, blanks);
		// disabled occupied squares (if it's not in the empty array, add the "disabled" class)
		for(var i=0; i<board.length; i++){
			if (empties.indexOf(i)== -1) {
				$('#cell'+i).removeClass("enabled").addClass("disabled");
			}
		}
	};

	// start the game
	var start= function(){

		// set status to beginning
		status= "beginning";
		// make the board empty
		board= [
			"E","E","E",
			"E","E","E",
			"E","E","E"
		];
		// reset array of empty squares
		empties=[];

		// reset styling for board and empty squares
		for(var i=0; i<board.length; i++){
			$("#cell"+i).html("");
			$('#cell'+i).removeClass("disabled human computer").addClass("enabled");
		}
		$("table").removeClass("disabled").addClass("enabled");

		// determine whose turn it is and initiate that turn
		console.log("start: "+turn);
		if (turn == human) {
			userTurn();
		} else {
			setTimeout(aiTurn, 200);
		}
	};

// Playing functions

	// this is the human player's turn
		// finds the empty squares, disables the occupied ones,
		// insert's the user's symbol on click to open square,
		// and switches the turn
	var userTurn= function(){
		console.log("user");
		
		$(".cell").each(function(){
			// the id of the selected square
			var id= this.id;
			// the index of the selected square
			var cellNumber= $(this).index("td");

			$(this).click(function(){
				// if the square clicked on is empty, run this action
				if ($(this).hasClass("enabled")) {

					// find the board entry corresponding to the clicked square
					board[cellNumber]=human;

					// find the entry in "empties", remove it, disable the square
					disable(board);

					// put an X in the square
					$(this).html(human);
					$(this).addClass("human");
					console.log("clicked " + cellNumber);
					console.log(board);

					// switch the turn to progress the game
					switchTurn();
				}	
			});
		});
	}

	// this is the computer's turn
		// it uses the mini and max functions
		// to determine what the possible ending states could be
		// for a given board
		// and chooses the HIHGEST scoring state
	function aiTurn() {

		console.log("computer");

		// empty array to be filled, the potential move and its score
	    var potentialMoves = [];
	    // the chosen move  
	    var chosenMove = undefined;
	    // how the board could look for any game state
	    	// initially set to be the same as the current board,
	    	// since that's what you have to play from
	    var possibleGames=board;
	    // the score for the move the computer will choose
	    	// initially set low, higher scoring moves will be chosen 
	    var chooseThis = -100;

	    // the recursive function that finds and takes the best move:
	    	// for every space on the board:
	    for (var i = 0; i < possibleGames.length; i++) { 

	    	// see if that space in the possibleGames board is empty
	    	if (isItEmpty(i, possibleGames)) {

	    		// if so, construct a test board by copying the current board
	        	var testBoard = possibleGames.slice();
	        	// set the current space on the test board to the computer's symbol
	        	testBoard[i] = computer;

	        	// get the score for the current state
	        	// by running the ** mini ** function on it,
	        	// which checks if the computer wins at the resulting state 
	        	var thisScore = mini(testBoard, 1);


	        	// if the score for this board is better than the current chosen score,
	        	// which was initially set impossibly low,
	        	// set the score that you will choose to this score
	        		// This is recursive, so IF a better score than this one comes along, it will be the next chosen score.
	        		// Then, the computer's chosen move is set to be the current space on the real game board.
	        		// This way, at the END OF THE LOOP, the highest scoring move will be chosen
	        	if (thisScore > chooseThis) {
	        		chooseThis = thisScore;
	        		// set the chosen move to be the current empty space in the actual game board
	        		chosenMove = i;
	        	}

	        	// push the chosen move and its score into the array
	        	potentialMoves.push([chosenMove, chooseThis]);

	      	} // (closes "IF")
	    } // (closes "FOR")
	    
	    // fill the chosen space in array with symbol
	    console.log(chosenMove);
	    board[chosenMove]=computer;

	    // this is the id of the chosen cell
	    var cellNumber= "cell"+chosenMove;
	    // set the content of that id in the document to the computer's symbol
	    $("#"+cellNumber).html(computer);
	    $("#"+cellNumber).addClass("computer");

	    // disable the taken spaces so the human can't click the space the AI chose
	    disable(board);
	    // switch the turn
	    switchTurn();
  	} // (closes aiTurn)

	// this is the scoring function for the HUMAN
		// if the computer wins at this state, the score is HIGH
	  	// otherwise, it finds the LOWEST scoring move and returns for the HUMAN
  	function mini(state, turns) {

		// get the game object resulting from endTest call
		var game= endTest(state);
		
	    if (game.winner==="draw") { // if the game resulting from the previous move ends in a draw:
	    	
	    	// score is 0
	    	return 0; 
	    } else if (game.winner===computer) { // otherwise, if it results in a win for the computer:
	    	
	    	// score is 10 - number of turns so far
	    	// ***** HIGH SCORE *****
	    	return 10 - turns;
	    } else { // otherwise, the game is still running

	    	// increment the turns counter
	    	var newTurns = 1 + turns;

	    	// initialize the score for this state to be impossibly high
	    	// so that any lower one that comes along will be chosen
	    	var humanScore = 100;

	    	// for every square at this state:
	    	for (var i = 0; i < state.length; i++) {

	    		// if that space is empty:
	    		if (isItEmpty(i, state)) { 

	    			// copy the current state
	        		var testBoard = state.slice();
	        		// put the human's symbol in that square
	        		testBoard[i] = human;

	        		// set the current score to be the result of the ** max ** function for this state
	        			// which checks whether or not the human wins at the resulting state
	        			// and gets the score for the human
	          		var thisScore = max(testBoard, newTurns);

	          			// if the score for that state is lower than the current score
	          			if (thisScore < humanScore) {
	          				// humanScore is set equal to the current score
	            			humanScore = thisScore;
	          			}
	        	}
	      	}

	      	return humanScore;
	    }
  	}

	// this is the scoring function for the COMPUTER
	  	// if the human wins at this state, the score is LOW,
	 	// otherwise, it finds the HIGHEST scoring move and returns it for the COMPUTER
  	function max(state, turns, originalMove) {
		// get the game object resulting from endTest call
		var game= endTest(state);

		// if the game resulting from the previous move ends with a win for the human:
	    if (game.winner=== human) {
	    	
	    	// this is the score for this state
	    	// ***** LOW SCORE *****
	    	return turns - 10;
	    } else if (game.winner==="draw") { // otherwise, if the game resulting from the previous move ends in a draw:
	    	
	    	// the score is 0
	    	return 0; 
	    } else { // otherwise, the game is still running

	    	// increment the turns counter
	    	var newTurns = 1 + turns;

	    	// initialize the score the computer will choose to be impossibly low
	    	// so that any higher-scoring move will be chosen
	      	var chooseThis = -100;

	      	// for every square at this state
	      	for (var i = 0; i < state.length; i++) {

	      		// if the square is empty:
	        	if (isItEmpty(i, state)) {
	        		
	        		// copy this state current state
	          		var testBoard = state.slice();
	          		// put the computer's symbol in that square
	          		testBoard[i] = computer;

	          		// set the current score for this state to the result of the ** mini ** function
	          		var thisScore = mini(testBoard, newTurns);

	          		// if the score resulting from this state is higher,
	          		// set the score the computer wants to choose to be this score
	          			// it's called in a recursive function, so at the end of the loop, the highest score will be chosen
	          		if (thisScore > chooseThis) { 
	            		chooseThis = thisScore;
	          			}
	        		}
	      		}
	      		return chooseThis;
	    	}
  	}
	
$(document).ready(function(){

	// on page load, show the "Choose your Symbol" window
	$(".choose").show("bounce");

	// if the User chooses X, they're X and they go first
	$("#X").click(function(){
		human= "X";
		computer="O";
		turn=human;
		$("#humanSymbol").html("X");
		$("#computerSymbol").html("O");
		$(".choose").hide("bounce");
		setTimeout(start, 500);
	});
	// if the User chooses O, they're O and the computer goes first
	$("#O").click(function(){
		human= "O";
		computer="X";
		turn=computer;
		$("#humanSymbol").html("O");
		$("#computerSymbol").html("X");
		$(".choose").hide("bounce");
		setTimeout(start, 500);
	});
	
});
