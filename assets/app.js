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


var restServer = 'http://10.10.0.20:8080';
var restPath = 'TuringREST/API/1.0';
var restUrl = restServer+'/'+restPath;
console.log(restUrl);
// default state
var state = "idle";
// To load with json !
var defaultmessage = "Bonjour ! Bienvenue dans cette conversation";
var messages = [];



/**
 * State controller
 */
app.controller('StateController', function($scope, $http) {
  $http.defaults.useXDomain = true;
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
          this.showVote = false;
          this.showResult = false;
        break;
        case "vote":
          this.showButton = false;
          this.showConversation = false;
          this.showVote = true;
          this.showResult = false;
        case "finished":
          this.showButton = false;
          this.showConversation = false;
          this.showVote = false;
          this.showResult = true;
        break;
        default:
          this.showButton = true;
          this.showConversation = false;
          this.showVote = false;
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

       $scope.cid = data.value.match("[0-9]+$")[0];


    }).error(function(data, status, headers, config) {
      console.log(config);
    });

  }

  this.launchVote = function() {
    this.updateState("vote");
    console.log("launched voting system");
  }
});

/**
 * Conversation controller
 */

app.controller('ConversationController', function($scope,$http){
  this.messages = messages;
  $scope.timer = 0;
  // mettre à jour les messages // à modifier !!
  this.updateMessages = function() {
    $http({
        url: restUrl+'/conversations/'+ $scope.cid +'/messages',
        method: "GET"
      }).success(function(data,status,headers,config) {
        for (var i = 0; i < data.length; i++) {
          messages.push(data[i]);
        };
      }).error(function(data,status,headers,config) {
        console.log("error"+status);
    });
  }
});


/**
 * Message controller
 */

app.controller('MsgController', function($scope, $http) {

  // envoi d'un message
	this.addMessage = function(message) {

    $http({
        url: restUrl+'/messages/'+ $scope.cid,
        method: "POST",
        data: {
          "is_participant": true,
          "messageContent": this.message.messageContent,
          },
        headers: {
            'Content-Type': 'application/json'
        }
    }).success(function(data, status, headers, config) {
      console.log("ok, message added");
    }).error(function(data, status, headers, config) {
        console.log("error occured");
    });
   	//messages.push(this.message);
   	this.message = {};
  }
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

app.directive("vote", function() {
  return {
    restrict: "E",
    templateUrl:"_vote.html"
  }
});



