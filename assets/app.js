var app = angular.module('turing', []);

app.controller('ConversationController', function() {
    this.messages = messages;
});

app.controller('MsgController', function() {
  // envoi d'un message
	this.addMessage = function(message) {
		this.message.timestamp = new Date();
		this.message.cid = "2";
		this.message.is_participant = true;
   	messages.push(this.message);
   	this.message = {};
    console.log(messages);
  }

});

app.directive("conversation", function(){
  return {
    restrict: "E",
    templateUrl:"_conversation.html"
  };
});






// To load with json !
var messages = [
{
    "mid": 0,
    "timestamp": "2015-02-27T15:01:12.322",
    "cid": 2,
    "is_participant": true,
    "messageContent": "Bonjour a tout le monde",
    "CID": 2
},
{
    "mid": 1,
    "timestamp": "2015-02-27T15:26:30.322",
    "cid": 2,
    "is_participant": false,
    "messageContent": "Salut a toi",
    "CID": 2
}
];

