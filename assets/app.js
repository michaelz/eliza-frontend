var app = angular.module('visitor', ['luegg.directives']);

app.config(['$httpProvider', function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
  $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
  $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
  $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
  $httpProvider.defaults.useXDomain = true;
}]);


var restServer = 'http://localhost:8080';
var restPath = 'TuringREST/API/1.0';
var restUrl = restServer+'/'+restPath;
console.log(restUrl);
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
    $http({
        url: restUrl+'/conversations/',
        method: "POST",
        data: {"ai":false},
        headers: {
            'Content-Type': 'application/json'
        }
    }).success(function(data, status, headers, config) {
       console.log(data);
       console.log(status);
       console.log(headers);
    }).error(function(data, status, headers, config) {
      console.log(config);
    });
    $http({
      url: restUrl+'/conversations/2/messages',
      method: "GET"
    }).success(function(data,status,headers,config) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        messages.push(data[i]);
      };
      messages.push(data);
    }).error(function(data,status,headers,config) {
      console.log(status);
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
});




