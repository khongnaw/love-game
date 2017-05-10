
const kROOT_GAMEROOM_DB     = "gameroom";
const kDEFAULT_GAMEROOM_DB  = "default";

gGameroomObj = null
gPlayerObj    = null

// Initialize Firebase
var config = {
	apiKey: "AIzaSyACA0_Z-3QCTwZW9x2mbSeC_txKubmDr0w",
	authDomain: "love-game-22eb9.firebaseapp.com",
	databaseURL: "https://love-game-22eb9.firebaseio.com",
	projectId: "love-game-22eb9",
	storageBucket: "love-game-22eb9.appspot.com",
	messagingSenderId: "1031794070368"
};

var defaultApp = firebase.initializeApp(config);
initialization()


function initialization(){
	var gameroom = firebase.database().ref(kROOT_GAMEROOM_DB + "/" + kDEFAULT_GAMEROOM_DB);
	gameroom.transaction(
		function(currentData) {
		  if (currentData === null) {
		    return creategameroomObj(kDEFAULT_GAMEROOM_DB);
		  } else {
		    console.log('\'' + kDEFAULT_GAMEROOM_DB + '\' exists.');
		    return; // Abort the transaction.
		  }
		 }, 
		function(error, committed, snapshot) {
		  if (error) {
		    console.log('Transaction failed abnormally!', error);
		  } else if (!committed) {
		    console.log('We aborted the transaction (because \'' + kDEFAULT_GAMEROOM_DB + '\' already exists).');
		  } else {
		    console.log('gameroom \'' + kDEFAULT_GAMEROOM_DB + '\' added!');
		  }
		  console.log(" \''" + kDEFAULT_GAMEROOM_DB + "\''s data: ", snapshot.val());
		}
	);
}
function delete_gr_click(){


	var gameroom = firebase.database().ref(kROOT_GAMEROOM_DB + "/" + kDEFAULT_GAMEROOM_DB);

	gameroom.set(null);

}
function enter_click(/*slected gameroom*/){

	//document.getElementById

	var username = document.getElementById("username").value;

	if(username === "")
		document.getElementById("gameroom").innerHTML = "Please enter a user name.";
	else{
		gameroomRef = firebase.database().ref(kROOT_GAMEROOM_DB + "/" + kDEFAULT_GAMEROOM_DB);

		gameroomRef.once('value').then( function(snapshot){
			gGameroomObj = snapshot.val();
			gPlayerObj   = entergameRoom(username, gGameroomObj);
			document.getElementById("gameroom").innerHTML = "I'm in '" + gameroomRef.key + "' gameroom!";
			playersRef = firebase.database().ref(kROOT_GAMEROOM_DB + "/" + gameroomRef.key + "/players");
			playersRef.on('value', updateListOfPlayers);
		});
	}
}
function entergameRoom(username, gameroomObj){
	
	userObj = createPlayerObj(username);

	console.log("username: " + username);

	console.log(gameroomObj);

	addPlayerToGameroom(userObj, gameroomObj);

	return userObj;
}	
function exitgameRoom(userObj, gameroomObj){
}
function updateCurrentPlayerScore(userObj, gameroomObj, score){

	if( gameroomObj["players"][userObj.user] != undefined){

		userObj["currentScore"] = userObj["currentScore"] + 1;
		
		db = firebase.database().ref(kROOT_GAMEROOM_DB + "/" + gameroomObj.key + "/players/" + userObj.user);
		
		db.update(userObj);

		console.log("update user: " + userObj.user + " score: " + userObj.currentScore);
   }
}
function createPlayerObj(username){

	obj = {
				user        : username,
				currentScore: 0
		  }
	return obj;
}
function addPlayerToGameroom(userObj, gameroomObj){
	if(gameroomObj["num_player"] < gameroomObj["max_player"] && gameroomObj["players"][userObj.user] === undefined){
		gameroomObj["players"][userObj.user] = userObj;
	
		gameroomObj["num_player"] 			 = gameroomObj["num_player"]  + 1;

		gameroomRef = firebase.database().ref(kROOT_GAMEROOM_DB + "/" + gameroomObj.name);
	
		gameroomRef.update(gameroomObj);

		return true;
	}else{
		console.log("player not added to the room! \n number of player in gameroom: " + gameroomObj.num_player);
		
		return false;
	}
}
function creategameroomObj(gameroom){
  obj = {	
  			name		 : gameroom,
  			max_player	 : 2,
  			num_player	 : 0,
		    highest_score: 0,
		    players      : {"none": false},
		    highest_user :""
 	    }	
  return obj;
} 
//call back
function updateOtherPlayerScore(val){
}
function waitForOtherPlayer(val){
}
function updateListOfPlayers(players){

	htmlText = "<h3>Active Players</h3> <ul>";

	for(var key in players.val()){
		if(key != "none")
			htmlText = htmlText + "<li>" +  key + "</li>";
	}
	htmlText = htmlText + "</ul>"
	document.getElementById("players").innerHTML = htmlText;
}
function updateGameRoomObj(gameroomObj){

	gGameroomObj = gameroomObj.val();
	console.log("user in gameroom: " + gameroomObj.players);
	console.log("gameobj updated");

}
function updatePlayerObj(playerObj) {

	gPlayerObj = playerObj.val();
	console.log("playerobj updated");

}
