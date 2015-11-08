/* global describe global it global beforeEach global angular global jasmine global inject global expect global spyOn */

'use strict';

var rootScope, toaster, $compile;

describe('toasterContainer', function () {
	beforeEach(function () {
		module('toaster');
		
		// inject the toaster service
        inject(function (_toaster_, _$rootScope_, _$compile_) {
			toaster = _toaster_;
			rootScope = _$rootScope_;
			$compile = _$compile_;
		});
	});


	it('should unsubscribe events on $destroy if handlers exist', function () {
		var toasterEventRegistry;

		inject(function (_toasterEventRegistry_) {
			toasterEventRegistry = _toasterEventRegistry_;
		});

		var container = compileContainer();
		var scope = container.scope();

		spyOn(toasterEventRegistry, 'unsubscribeToNewToastEvent').and.callThrough();
		spyOn(toasterEventRegistry, 'unsubscribeToClearToastsEvent').and.callThrough();

		scope.$destroy();

		expect(toasterEventRegistry.unsubscribeToNewToastEvent).toHaveBeenCalled();
		expect(toasterEventRegistry.unsubscribeToClearToastsEvent).toHaveBeenCalled();
	});
	
	
	it('should default to icon-class config value if toast.type not found in icon-classes', function () {
		var toasterConfig;
		
		inject(function (_toasterConfig_) {
			toasterConfig = _toasterConfig_;
		});

		compileContainer();
		
		expect(toasterConfig['icon-class']).toBe('toast-info'); 
		
		toaster.pop({ type: 'invalid' });
		
		rootScope.$digest();
		
		expect(toaster.toast.type).toBe('toast-info');
	});

	it('should allow subsequent duplicates if prevent-duplicates is not set', function () {
		var container = compileContainer();
		var scope = container.scope();
				
		expect(scope.toasters.length).toBe(0);
				
		toaster.pop({ type: 'info', title: 'title', body: 'body' });
		toaster.pop({ type: 'info', title: 'title', body: 'body' });
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(2);
	});

	it('should not allow subsequent duplicates if prevent-duplicates is true without toastId param', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{\'prevent-duplicates\': true}"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
				
		var scope = container.scope();
				
		expect(scope.toasters.length).toBe(0);
				
		toaster.pop({ type: 'info', title: 'title', body: 'body' });
		toaster.pop({ type: 'info', title: 'title', body: 'body' });
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1);
	});
	
	it('should allow subsequent duplicates if prevent-duplicates is true with unique toastId params', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{\'prevent-duplicates\': true}"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
				
		var scope = container.scope();
				
		expect(scope.toasters.length).toBe(0);
				
		toaster.pop({ type: 'info', title: 'title', body: 'body', toastId: 1 });
		toaster.pop({ type: 'info', title: 'title', body: 'body', toastId: 2 });
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(2);
	});

	it('should not allow subsequent duplicates if prevent-duplicates is true with identical toastId params', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{\'prevent-duplicates\': true}"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
				
		var scope = container.scope();
				
		expect(scope.toasters.length).toBe(0);
				
		toaster.pop({ type: 'info', title: 'title', body: 'body', toastId: 1 });
		toaster.pop({ type: 'info', title: 'title', body: 'body', toastId: 1 });
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1);
	});

	it('should not render the close button if showCloseButton is false', function () {
		var container = compileContainer();

		toaster.pop({ type: 'info', body: 'With a close button' });

		rootScope.$digest();

		expect(container.find('button')[0]).toBeUndefined();
	});

	it('should use the default close html if toast.closeHtml is undefined', function () {
		var container = compileContainer();

		toaster.pop({ type: 'info', body: 'With a close button', showCloseButton: true });

		rootScope.$digest();

		var buttons = container.find('button');
		
		expect(buttons.length).toBe(1);
		expect(buttons[0].outerHTML).toBe('<button class="toast-close-button" type="button">×</button>');
	});
	
	it('should use the toast.closeHtml argument if passed', function () {
		var container = compileContainer();

		toaster.pop({ type: 'info', body: 'With a close button', showCloseButton: true,
			closeHtml: '<button>Close</button>'
		 });

		rootScope.$digest();

		var buttons = container.find('button');
		
		expect(buttons.length).toBe(1);
		expect(buttons[0].outerHTML).toBe('<button>Close</button>');
	});
	
	it('should render toast.closeHtml argument if not a button element', function () {
		var container = compileContainer();

		toaster.pop({ type: 'info', body: 'With close text', showCloseButton: true,
			closeHtml: '<span>Close</span>'
		 });

		rootScope.$digest();

		var spans = container.find('span');
		
		expect(spans.length).toBe(1);
		expect(spans[0].outerHTML).toBe('<span>Close</span>');
	});
	
	it('should show the close button if mergedConfig close-button is an object set to true for toast-info', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{\'close-button\': {\'toast-info\': true}}"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();

		toaster.pop({ type: 'info' });

		rootScope.$digest();

		var buttons = container.find('button');
		
		expect(buttons.length).toBe(1);
		expect(buttons[0].outerHTML).toBe('<button class="toast-close-button" type="button">×</button>');
	});
	
	it('should not render the close button if mergedConfig close-button type cannot be found', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{\'close-button\': {\'toast-invalid\': true}}"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();

		toaster.pop({ type: 'info' });

		rootScope.$digest();

		var buttons = container.find('button');
		
		expect(buttons.length).toBe(0);
		expect(buttons[0]).toBeUndefined();
	});
	
	it('should not render the close button if mergedConfig close-button is not an object', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{\'close-button\': 1 }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();

		toaster.pop({ type: 'info' });

		rootScope.$digest();

		var buttons = container.find('button');
		
		expect(buttons.length).toBe(0);
		expect(buttons[0]).toBeUndefined();
	});
	
	it('should render trustedHtml bodyOutputType', function () {
		var container = compileContainer();
		
		toaster.pop({ bodyOutputType: 'trustedHtml', body: '<section>Body</section>' });
		
		rootScope.$digest();

		var body = container.find('section');
		
		expect(body.length).toBe(1);
		expect(body[0].outerHTML).toBe('<section>Body</section>');
	});
	
	it('should render template bodyOutputType when body is passed', function () {
		inject(function($templateCache) {
			$templateCache.put('/templatepath/template.html', '<section>Template</section>');
		});
		
		var container = compileContainer();
		
		toaster.pop({ bodyOutputType: 'template', body: '/templatepath/template.html' });
		
		rootScope.$digest();

		expect(toaster.toast.body).toBe('/templatepath/template.html');

		var body = container.find('section');
		
		expect(body.length).toBe(1);
		expect(body[0].outerHTML).toBe('<section class="ng-scope">Template</section>');
	});
	
	it('should render default template bodyOutputType when body is not passed', function () {
		inject(function($templateCache) {
			$templateCache.put('toasterBodyTmpl.html', '<section>Template</section>');
		});
		
		var container = compileContainer();
		
		toaster.pop({ bodyOutputType: 'template' });
		
		rootScope.$digest();

		expect(toaster.toast.bodyTemplate).toBe('toasterBodyTmpl.html');

		var body = container.find('section');
		
		expect(body.length).toBe(1);
		expect(body[0].outerHTML).toBe('<section class="ng-scope">Template</section>');
	});
	
	it('should render templateWithData bodyOutputType when body is passed', function () {
		inject(function($templateCache) {
			$templateCache.put('template.html', '<section>Template {{toaster.data}}</section>');
		});
		
		var container = compileContainer();
		
		toaster.pop({ bodyOutputType: 'templateWithData', body: "{template: 'template.html', data: 123 }" });
		
		rootScope.$digest();

		var body = container.find('section');
		
		expect(body.length).toBe(1);
		expect(body[0].outerHTML).toBe('<section class="ng-binding ng-scope">Template 123</section>');
	});
	
	it('should throw exception for default templateWithData bodyOutputType when body is not passed', function () {
		// TODO:  If the default fallback template cannot be parsed to an object
		// composed of template and data, an exception is thrown.  This seems to 
		// be undesirable behavior.  A clearer exception should be thrown, or better
		// handling should be handled, or the fallback option should be removed.
		inject(function($templateCache) {
			$templateCache.put('template.html', '<section>Template {{toaster.data}}</section>');
		});
		
		compileContainer();
		var hasException = false;
		
		try {
			toaster.pop({ bodyOutputType: 'templateWithData' });
		} catch (e) {
			expect(e.message).toBe("Cannot read property 'template' of undefined");
			hasException = true;	
		}
		
		expect(hasException).toBe(true);
	});
});


describe('toasterContainer', function () {
	var $interval, $intervalSpy;

	inject(function (_$interval_) {
		$interval = _$interval_;
	});

	beforeEach(function () {
		$intervalSpy = jasmine.createSpy('$interval', $interval);

		module('toaster', function ($provide) {
			$provide.value('$interval', $intervalSpy);
		});

		// inject the toaster service
		inject(function (_toaster_, _$rootScope_, _$compile_) {
			toaster = _toaster_;
			rootScope = _$rootScope_;
			$compile = _$compile_;
		});
	});

	it('should use the toast.timeout argument if it is a valid number', function () {
		var container = compileContainer();
		var scope = container.scope();

		spyOn(scope, 'configureTimer').and.callThrough();

		toaster.pop({ timeout: 2 });

		expect(scope.configureTimer).toHaveBeenCalled();
		expect(scope.configureTimer.calls.allArgs()[0][0].timeout).toBe(2);
		expect($intervalSpy.calls.first().args[1]).toBe(2)
	});

	it('should not use the toast.timeout argument if not a valid number', function () {
		var container = compileContainer();
		var scope = container.scope();

		spyOn(scope, 'configureTimer').and.callThrough();

		toaster.pop({ timeout: "2" });

		expect(scope.configureTimer).toHaveBeenCalled();
		expect(scope.configureTimer.calls.allArgs()[0][0].timeout).toBe("2");
		expect($intervalSpy.calls.first().args[1]).toBe(5000);
	});

	it('should call scope.removeToast when toast.timeoutPromise expires', function () {
		var container = compileContainer();
		var scope = container.scope();

		spyOn(scope, 'removeToast').and.callThrough();

		toaster.pop({ timeout: 2 });

		$intervalSpy.calls.first().args[0]();

		rootScope.$digest();

		expect(scope.removeToast).toHaveBeenCalled();
	});

	it('should retrieve timeout by toast type if mergedConfig toast-timeout is an object', function () {
		var element = angular.element(
			'<toaster-container toaster-options="{\'time-out\': {\'toast-info\': 5}}"></toaster-container>');

		$compile(element)(rootScope);
		rootScope.$digest();

		toaster.pop({ type: 'info' });

		expect($intervalSpy.calls.first().args[1]).toBe(5);
	});

	it('should not set a timeout if mergedConfig toast-timeout is an object and does not match toast type', function () {
		// TODO: this seems to be a bug in the toast-timeout configuration option.
		// It should fall back to a default value if the toast type configuration
		// does not match the target toast type or throw an exception to warn of an
		// invalid configuration.
		
		var element = angular.element(
			'<toaster-container toaster-options="{\'time-out\': {\'toast-info\': 5}}"></toaster-container>');

		$compile(element)(rootScope);
		rootScope.$digest();

		toaster.pop({ type: 'warning' });

		expect($intervalSpy.calls.all().length).toBe(0);
	});
});


function compileContainer() {
	var element = angular.element('<toaster-container></toaster-container>');
	$compile(element)(rootScope);
	rootScope.$digest();

	return element;
}