AngularJS-Toaster
=================

**AngularJS Toaster** is an AngularJS port of the **toastr** non-blocking notification jQuery library. It requires AngularJS v1.2.6 or higher and angular-animate for the CSS3 transformations.

[![Build Status](https://travis-ci.org/jirikavi/AngularJS-Toaster.svg)](https://travis-ci.org/jirikavi/AngularJS-Toaster)
[![Coverage Status](https://coveralls.io/repos/jirikavi/AngularJS-Toaster/badge.svg?branch=master&service=github&busted=1)](https://coveralls.io/github/jirikavi/AngularJS-Toaster?branch=master)

### Current Version 2.0.0

## Angular Compatibility
AngularJS-Toaster requires AngularJS v1.2.6 or higher and specifically targets AngularJS, not Angular 2, although it could be used via ngUpgrade.  
If you are looking for the Angular 2 port of AngularJS-Toaster, it is located [here](https://github.com/Stabzs/Angular2-Toaster).

## Demo
- Simple demo is at http://plnkr.co/edit/HKTC1a
- Older versions are http://plnkr.co/edit/1poa9A or http://plnkr.co/edit/4qpHwp or http://plnkr.co/edit/lzYaZt (with version 0.4.5)
- Older version with Angular 1.2.0 is placed at http://plnkr.co/edit/mejR4h
- Older version with Angular 1.2.0-rc.2 is placed at http://plnkr.co/edit/iaC2NY
- Older version with Angular 1.1.5 is placed at http://plnkr.co/mVR4P4

## Getting started

Optionally: to install with bower, use:
```
bower install --save angularjs-toaster
```
or with npm :
```
npm install --save angularjs-toaster
```
* Link scripts:

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.css" rel="stylesheet" />
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js" ></script>
<script src="https://code.angularjs.org/1.2.0/angular-animate.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.js"></script>
```

* Add toaster container directive: 

```html
<toaster-container></toaster-container>
```

* Prepare the call of toaster method:

```js
// Display an info toast with no title
angular.module('main', ['toaster', 'ngAnimate'])
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

### Timeout
By default, toasts have a timeout setting of 5000, meaning that they are removed after 5000 
milliseconds.  

If the timeout is set to anything other than a number greater than 0, the toast will be considered
 "sticky" and will not automatically dismiss.

The timeout can be configured at three different levels:

* Globally in the config for all toast types:
```html
<toaster-container toaster-options="{'time-out': 1000}"></toaster-container>
```

* Per info-class type:
By passing the time-out configuration as an object instead of a number, you can specify the global behavior an info-class type should have.
```html
<toaster-container toaster-options="
    {'time-out':{ 'toast-warning': 10, 'toast-error': 0 } }">
</toaster-container>
```
If a type is not defined and specified, a timeout will not be applied, making the toast "sticky".

* Per toast constructed via toaster.pop('success', "title", "text"):
```html
toaster.pop({
                type: 'error',
                title: 'Title text',
                body: 'Body text',
                timeout: 3000
            });
```

### Close Button

The Close Button's visibility can be configured at three different levels:

* Globally in the config for all toast types:
```html
<toaster-container toaster-options="{'close-button': true}"></toaster-container>
```

* Per info-class type:
By passing the close-button configuration as an object instead of a boolean, you can specify the global behavior an info-class type should have.
```html
<toaster-container toaster-options="
    {'close-button':{ 'toast-warning': true, 'toast-error': false } }">
</toaster-container>
```
If a type is not defined and specified, the default behavior for that type is false.

* Per toast constructed via toaster.pop('success', "title", "text"):
```html
toaster.pop({
                type: 'error',
                title: 'Title text',
                body: 'Body text',
                showCloseButton: true
            });
```
This option is given the most weight and will override the global configurations for that toast.  However, it will not persist to other toasts of that type and does not alter or pollute the global configuration.

### Close Html

The close button html can be overridden either globally or per toast call.

 - Globally:

    ```html
    <toaster-container toaster-options="{'close-html':'<button>Close</button>', 
        'showCloseButton':true}"></toaster-container>
    ```
 - Per toast:

    ```js
    toaster.pop({
            type: 'error',
            title: 'Title text',
            body: 'Body text',
            showCloseButton: true,
            closeHtml: '<button>Close</button>'
    });
    ```


### Body Output Type
The rendering of the body content is configurable at both the Global level, which applies to all toasts, and the individual toast level when passed as an argument to the toast.

There are four types of body renderings: trustedHtml', 'template', 'templateWithData', 'directive'.

 - trustedHtml:  When using this configuration, the toast will parse the body content using 
	`$sce.trustAsHtml(toast.body)`.
	If the html can be successfully parsed, it will be bound to the toast via `ng-bind-html`.  If it cannot be parsed as "trustable" html, an exception will be thrown.	

 - template:  Will use the `toast.body` if passed as an argument, else it will fallback to the template bound to the `'body-template': 'toasterBodyTmpl.html'` configuration option.
 
 - templateWithData: 
	 - Will use the `toast.body` if passed as an argument, else it will fallback to the template bound to the `'body-template': 'toasterBodyTmpl.html'` configuration option.
	 - Assigns any data associated with the template to the toast.

 - directive 
	 - Will use the `toast.body` argument to represent the name of a directive that you want to render as the toast's body, else it will fallback to the template bound to the `'body-template': 'toasterBodyTmpl.html'` configuration option.
    The directive name being passed to the `body` argument should appear as it exists in the markup, 
     not camelCased as it would appear in the directive declaration (`cool-directive-name` instead of `coolDirectiveName`). The directive must be usable as an attribute.
    
      ```js
    // The toast pop call, passing in a directive name to be rendered
    toaster.pop({
		    type: 'info',
		    body: 'bind-unsafe-html',
		    bodyOutputType: 'directive'
	});
      ```
    
      ```js
    // The directive that will be dynamically rendered
    .directive('bindUnsafeHtml', [function () {
            return {
                template: "<span style='color:orange'>Orange directive text!</span>"
            };
    }])
    ```
     - Will use the `toast.directiveData` argument to accept data that will be bound to the directive's scope. The directive cannot use isolateScope and will
     throw an exception if isolateScope is detected.  All data must be passed via the directiveData argument.
    
        ```js
      // The toast pop call, passing in a directive name to be rendered
      toaster.pop({
              type: 'info',
              body: 'bind-name',
              bodyOutputType: 'directive',
              directiveData: { name: 'Bob' }
      });
        ```
        
        ```js
      // The directive that will be dynamically rendered
      .directive('bindName', [function () {
            return {
                template: "<span style='color:orange'>Hi {{directiveData.name}}!</span>"
            };
      }])
        ```
        
    There are additional documented use cases in these [tests](test/directiveTemplateSpec.js).
    
All four options can be configured either globally for all toasts or individually per toast.pop() call.  If the `body-output-type` option is configured on the toast, it will take precedence over the global configuration for that toast instance.

 - Globally:
 
    ```html
    <toaster-container toaster-options="{'body-output-type': 'template'}"></toaster-container>
    ```
 
 - Per toast:
 
    ```js
    toaster.pop({
            type: 'error',
            title: 'Title text',
            body: 'Body text',
            bodyOutputType: 'trustedHtml'
    });
    ```

### On Show Callback
An onShow callback function can be attached to each toast instance.  The callback will be invoked upon toast add.

```js
toaster.pop({
            title: 'A toast',
		    body: 'with an onShow callback',
			onShowCallback: function () { 
			    toaster.pop({
			        title: 'A toast',
				    body: 'invoked as an onShow callback'
				});
			}
});
```

### On Hide Callback
An onHide callback function can be attached to each toast instance.  The callback will be invoked upon toast removal.  This can be used to chain toast calls.

```js
toaster.pop({
            title: 'A toast',
		    body: 'with an onHide callback',
			onHideCallback: function () { 
			    toaster.pop({
			        title: 'A toast',
				    body: 'invoked as an onHide callback'
				});
			}
});
```

### Multiple Toaster Containers
If desired, you can include multiple `<toaster-container></toaster-container>` 
elements in your DOM.  The library will register an event handler for every instance 
of the container that it identifies.  By default, when there are multiple registered 
containers, each container will receive a toast notification and display it when a toast 
is popped.  

To target a specific container, you need to register that container with a unique `toaster-id`.

```html
<toaster-container toaster-options="{'toaster-id': 1, 
    'animation-class': 'toast-top-left'}"></toaster-container>
<toaster-container toaster-options="{'toaster-id': 2}"></toaster-container>
```

This gives you the ability to specifically target a unique container rather than broadcasting 
new toast events to any containers that are currently registered.

```js
vm.popContainerOne = function () {
    toaster.pop({ type: 'info', body: 'One', toasterId: 1 });
}
      
vm.popContainerTwo = function () {
    toaster.pop({ type: 'info', body: 'Two', toasterId: 2 });
}
```

[This plnkr](http://plnkr.co/edit/4ICtcrpTSoAB9Vo5bRvN?p=preview) demonstrates this behavior 
and it is documented in these [tests](test/toasterContainerSpec.js#L430).


### Limit
Limit is defaulted to 0, meaning that there is no maximum number of toasts that are defined 
before the toast container begins removing toasts when a new toast is added.

To change this behavior, pass a "limit" option to the toast-container configuration:

```html
<toaster-container toaster-options="{'limit':5}"></toaster-container>
```

### Dismiss on tap
By default, the `tap-to-dismiss` option is set to true, meaning that if a toast is clicked anywhere 
on the toast body, the toast will be dismissed.  This behavior can be overriden in the toast-container 
configuration so that if set to false, the toast will only be dismissed if the close button is defined 
and clicked:

```html
<toaster-container toaster-options="{'tap-to-dismiss':false}"></toaster-container>
```

### Newest Toasts on Top
The `newest-on-top` option is defaulted to true, adding new toasts on top of other existing toasts. 
If changed to false via the toaster-container configuration, toasts will be added to the bottom of 
other existing toasts.

```html
<toaster-container toaster-options="{'newest-on-top':false}"></toaster-container>
```

### Other Options

```html
// Change display position
<toaster-container toaster-options="{'position-class': 'toast-top-full-width'}"></toaster-container>
```

### Animations
Unlike toastr, this library relies on ngAnimate and CSS3 transformations for optional animations.  To include and use animations, add a reference to angular-animate.min.js (as described in Getting started - Link scripts) and add ngAnimate as a dependency alongside toaster. 

```js
// Inject ngAnimate to enable animations
angular.module('main', ['toaster', 'ngAnimate']);
```
If you do not want to use animations, you can safely remove the angular-animate.min.js reference as well as the injection of ngAnimate.  Toasts will be displayed without animations.


### Common Issues
- Toaster always shows up as "info"
    - Your `<toaster-container></toaster-container` might be placed inside of your routing directive.
    - You have multiple `<toaster-container></toaster-container` elements without unique `toaster-id` configuration arguments.
- [$sce:itype] Attempted to trust a non-string value in a content requiring a string 
    - You have not specified: `bodyOutputType: 'trustedHtml'` when passing html as a body argument.
- My toasts do not show up when I pop them, but after I perform another action.
    - You are calling `toaster.pop()` outside of AngularJS scope and a digest cycle is not being triggered.
    Wrap your `toaster.pop()` call in `$timeout` to force a digest cycle.
    ```js
     $timeout(function () {
        toaster.pop();
     }, 0);
    ```
		
## Author
**Jiri Kavulak**

## Credits
Inspired by http://codeseven.github.io/toastr/demo.html.

## Copyright
Copyright © 2013-2016 [Jiri Kavulak](https://twitter.com/jirikavi).

## License 
AngularJS-Toaster is under MIT license - http://www.opensource.org/licenses/mit-license.php