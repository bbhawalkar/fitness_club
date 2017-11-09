var app = angular.module("club",["ngRoute"]);
					app.config(function ($routeProvider, $locationProvider){
						 		$routeProvider
										 .when("/",{
											templateUrl:"../templates/main.html",
											controller:"mainController"
										 })
										//  .when("/sample",{
										// 	templateUrl:"../templates/sample.html",
										// 	controller:"fitnessController"
										//  })
										 .when("/signup",{
											templateUrl:"../templates/signup.html",
											controller:"signupController"
										 })
										 .when("/login",{
											templateUrl:"../templates/login.html",
											controller:"loginController"
										 })
										 .when("/forgotpassword",{
											templateUrl:"../templates/forgotpass.html",
											controller:"forgotpassController"
										 })
										 .when("/bmi",{
											templateUrl:"../templates/bmi.html",
											controller:"bmiController"
										 })
								$locationProvider.html5Mode(true);
			 	 });
				 app.controller("loginController", function($scope){
				 });
				 app.controller("signupController", function($scope){
				 });
				 app.controller("forgotpassController", function($scope){
				 });
				 app.controller("bmiController", function($scope){
					 $scope.Math = window.Math;
					 $scope.parseFloat = parseFloat;
				 });
				 app.controller("mainController", function($scope){
				 });
				 app.controller('fitnessController', function($scope, $http) {
				    $http.get("http://127.0.0.1:3000/fitness/data")
				    .then(function(response) {
				        $scope.ages = response.data.age;
								$scope.height = response.data.height;
								$scope.weight = response.data.weight;
								$scope.gender = response.data.gender;
	  						console.log(response.data);
				    });
				 });
