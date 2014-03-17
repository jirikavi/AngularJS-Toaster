AngularJS-Toaster
=================

**AngularJS Toaster** is a AngularJS port of the **toastr** non-blocking notification jQuery library. It requires AngularJS v1.2 and angular-animate for the CSS3 transformations.  
(I would suggest to use /1.2.8/angular-animate.js, there is a weird blinking in newer versions.)

### Current Version 0.4.5

## Demo
- Simple demo is at http://plnkr.co/edit/lzYaZt (latest version)
- Older version with Angular 1.2.0 is placed at http://plnkr.co/edit/mejR4h
- Older version with Angular 1.2.0-rc.2 is placed at http://plnkr.co/edit/iaC2NY
- Older version with Angular 1.1.5 is placed at http://plnkr.co/mVR4P4

## Getting started

1. Link scripts:
```html
<link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css" rel="stylesheet" />
<link href="http://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/0.4.4/toaster.css" rel="stylesheet" />
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js" ></script>
<script src="http://code.angularjs.org/1.2.0/angular-animate.min.js" ></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/0.4.4/toaster.js"></script>
```

2. Add toaster container directive: `<toaster-container></toaster-container>`

3. Prepare the call of toaster method:
```js
	// Display an info toast with no title
	angular.module('main', ['toaster'])
	.controller('myController', function($scope, toaster) {
	    $scope.pop = function(){
	        toaster.pop('success', "title", "text");
	    };
	});
```
4. Call controller method on button click:
```html
<div ng-controller="myController">
    <button ng-click="pop()">Show a Toaster</button>
</div>
```

### API

#### Javascript

Use the `toaster` angular service to show notification boxes and manipulate them.

##### Function toaster.pop
Opens a notification box.

*Parameters (all optional)*

* `type` {string} Notification type. Examples: `info`, `success`, `error`, `warning`
* `title` {string} Title of the notification box.
* `body` {string} Text of the notification box.
* `timeout` {number} Delay to wait until the notification is hidden automatically.  Set it to `0` to have a sticky box.
* `bodyOutputType` {string} Specify how to render the body contents.  
  Accepted values: 
  * `''`:  Renders `body` as plain text which is HTML safe. **(Default value)**
  * `trustedHtml`: Renders `body` as trusted HTML. For example, the string `<br/>` will create a new line.
  * `template`: the box contents will be rendered from an angular template URL referenced by `body`. Example: `body = '/partials/notification.html'`
* `id` {string} The notification box identifier.

*Returns*  
A *toast* definition object as following example:

```js
{
	type: 'info',
	title: 'some title',
	body: 'some body',
	timeout: 5000,
	bodyOutputType: '',
	id: '__toast-0' // automatically generated if no 'id' provided
};
```

*Examples:*

```js
toaster.pop('success', 'Hello', 'World');

toaster.pop({
	type: 'info',
	title: 'Big news',
	body: 'You are awesome'
});

toaster.pop({
	type: 'info',
	title: 'Big news',
	body: 'You are awesome'
});

toaster.pop({
	type: 'info',
	id: 'infoId',
	title: 'Big news',
	body: 'You are <strong>awesome</strong>',
	timeout: 5000,
    bodyOutputType: 'trustedHtml'
});

```

##### Function toaster.get
Get a toast object by id.

*Parameters*

* `id` {string} The notification box identifier.

*Returns*  
Toast object or null if not found.

##### Function toaster.edit
Edit a toast object by id with a given object map to override its properties.

*Parameters*

* `id` {string} The notification box identifier.
* `newProperties` {object} Object map that will override the target toast object
* `options` {object} Object map to pass more options parameters.  
	Supported options:
	* `refresh` {boolean} If true, the toast timer will be restarted (i.e. extend the display time of the toast). Works only if the current `timeout` value is greater than 0.

*Returns*  
Modified toast object or null if not found.

##### Function toaster.close
Close a toast object by id.

*Parameters*

* `id` {string} The notification box identifier.

*Returns*  
Toast object or null if not found.

##### Function toaster.clear
Close all notification boxes.

*Parameters*

None.

*Returns*  
`void`

#### Global configuration
A `toasterConfig` configuration object is available as an Angular constant.

Current default config is:

```js
{
    'limit': 0,                    // limits max number of toasts 
    'tap-to-dismiss': true,
    'newest-on-top': true,
    'time-out': 5000,              // Set timeOut and extendedTimeout to 0 to make it sticky
    'icon-classes': {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
    },
    'body-output-type': '',        // Options: '', 'trustedHtml', 'template'
    'body-template': 'toasterBodyTmpl.html',
    'icon-class': 'toast-info',
    'position-class': 'toast-top-right',
    'title-class': 'toast-title',
    'message-class': 'toast-message',
    'default-id-prefix': '__toast-'
}
```

You can customise the configuration by setting a `toaster-options` attribute on the `toaster-container` directive.

*Example*

Change display position.
```html
<toaster-container toaster-options="{'position-class': 'toast-top-full-width'}"></toaster-container>
```

### Animations
Unlike toastr, this library relies on ngAnimate and CSS3 transformations for animations.

## Author
* **Jiri Kavulak**

## Credits
Inspired by http://codeseven.github.io/toastr/demo.html.

## Copyright
Copyright © 2013 [Jiri Kavulak](https://twitter.com/jirikavi).

## License 
AngularJS-Toaster is under MIT license - http://www.opensource.org/licenses/mit-license.php
