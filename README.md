AngularJS-Toaster
=================

**AngularJS Toaster** is a AngularJS port of the **toastr** non-blocking notification jQuery library. It requires AngularJS v1.2.6 or higher and angular-animate for the CSS3 transformations. 
(I would suggest to use /1.2.8/angular-animate.js, there is a weird blinking in newer versions.)

### Current Version 0.4.9

## Demo
- Simple demo is at http://plnkr.co/edit/1poa9A
- Older versions are http://plnkr.co/edit/4qpHwp or http://plnkr.co/edit/lzYaZt (with version 0.4.5)
- Older version with Angular 1.2.0 is placed at http://plnkr.co/edit/mejR4h
- Older version with Angular 1.2.0-rc.2 is placed at http://plnkr.co/edit/iaC2NY
- Older version with Angular 1.1.5 is placed at http://plnkr.co/mVR4P4

## Getting started

* Link scripts:

```html
<link href="http://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/0.4.4/toaster.css" rel="stylesheet" />
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js" ></script>
<script src="http://code.angularjs.org/1.2.0/angular-animate.min.js" ></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/0.4.4/toaster.js"></script>
```

* Add toaster container directive to your HTML (will not be visible): 
```html
<toaster-container></toaster-container>
```

* Prepare the call of toaster method:

```js
	// Display an info toast with no title
	angular.module('main', ['toaster'])
	.controller('myController', function($scope, toaster) {
	    $scope.pop = function(){
	        toaster.pop('success', "title", "text");
	    };
	});
```

* Call controller method on button click:

```html
<div ng-controller="myController">
    <button ng-click="pop()">Show a Toaster</button>
</div>
```

### Other Options

```html
// Change display position
<toaster-container toaster-options="{'position-class': 'toast-top-full-width'}"></toaster-container>
```

### Animations
Unlike toastr, this library relies on ngAnimate and CSS3 transformations for animations.
		
## Author
**Jiri Kavulak**

## Credits
Inspired by http://codeseven.github.io/toastr/demo.html.

## Copyright
Copyright © 2013 [Jiri Kavulak](https://twitter.com/jirikavi).

## License 
AngularJS-Toaster is under MIT license - http://www.opensource.org/licenses/mit-license.php

