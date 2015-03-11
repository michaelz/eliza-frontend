var app = angular.module('visitor', []);

// default state
var state = "idle";
// To load with json !
var defaultmessage = "Bonjour ! Bienvenue dans cette conversation";
var messages = [];

app.controller('StateController', function($http) {
  this.state = state;
  this.showButton = true;

  this.updateState = function(newState) {
      this.state = newState;
      this.oldState = state;
      state = this.state;

      /* display stuff */
      switch (state) {
        case "running":
          this.showButton = false;
          this.showConversation = true;
          this.showResult = false;
        break;
        case "finished":
          this.showButton = false;
          this.showConversation = false;
          this.showResult = true;
        break;
        default:
          this.showButton = true;
          this.showConversation = false;
          this.showResult = false;
        break;
      }

      /* Create a conversation */
      if (this.oldState == "idle" && this.state == "running") {
        this.startConversation();
      }
  }


  this.startConversation = function() {
    console.log("started conversation");
    $http.post('http://10.10.0.20:8080/TuringREST/API/1.0/conversations', {"ai":false} )
      .success(function(data, status, headers, config) {
       console.log(data);
       console.log(status);
       console.log(headers);
     }).error(function(data, status, headers, config) {
      console.log("error");
     });
  }

});

app.controller('ConversationController', function(){
    this.messages = messages;
});




app.controller('MsgController', function($http) {
  // envoi d'un message
	this.addMessage = function(message) {
		this.message.timestamp = new Date();
		this.message.cid = "2";
		this.message.is_participant = true;
   	messages.push(this.message); // ici: faire le http post
   	this.message = {};
  }
  // TODO: Chopper tous les messages avec un tick
  // Comment faire ?? mettre à jour la variable $messages avec la liste des messages d'une conversation, toutes les secondes.



});

/**
 * DIRECTIVES
 */

app.directive("intro", function(){
  return {
    restrict: "E",
    templateUrl:"_intro.html"
  };
})

app.directive("conversation", function(){
  return {
    restrict: "E",
    templateUrl:"_conversation.html"
  };
});

app.directive("result", function(){
  return {
    restrict: "E",
    templateUrl:"_result.html"
  };
})




