AngularJS-Toaster
=================

**AngularJS Toaster** is a customized version of **toastr** non-blocking notification javascript library. The original library works only with jQuery but in **AngularJS Toaster** is needed only AngularJS framework version 1.1.5 or higher
(contains CSS3 animation).

## Current Version
0.2

## Demo
- Simple demo is placed at http://plnkr.co/edit/iaC2NY
- Old version with Angular 1.1.5 is placed at http://plnkr.co/mVR4P4

## Getting started

1. Link scritps:

		<link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css" rel="stylesheet" />
    	<link href="toaster.css" rel="stylesheet" />
    	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0-rc.2/angular.min.js" ></script>
    	<script src="http://code.angularjs.org/1.2.0-rc.2/angular-animate.min.js" ></script>

2. Add toaster container directive: `<toaster-container> </toaster-container>`

3. Prepare the call of toaster method:

		// Display an info toast with no title
		angular.module('main', ['toaster'])
		.controller('myController', function($scope, toaster) {
		    $scope.pop = function(){
		        toaster.pop('success', "title", "text");
		    };
		});

4. Call controller method on button click:

		<div ng-controller="myController">
		    <button ng-click="pop()">Show a Toaster</button>
		</div>

## Author
**Jiri Kavulak**

## Credits
Inspired by http://codeseven.github.io/toastr/demo.html.

## Copyright
Copyright © 2013 [Jiri Kavulak](https://twitter.com/jirikavi).

## License 
AngularJS-Toaster is under MIT license - http://www.opensource.org/licenses/mit-license.php

