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

	it('should pop a toast via individual parameters', function () {
		var container = compileContainer();
		var scope = container.scope();
		
		toaster.pop('info', 'test', 'test');
		
		expect(scope.toasters.length).toBe(1);
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
	
	
	describe('addToast', function () {
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
	
		it('should not allow subsequent duplicates if prevent-duplicates is true and body matches', function () {
			var container = angular.element(
				'<toaster-container toaster-options="{\'prevent-duplicates\': true}"></toaster-container>');
	
			$compile(container)(rootScope);
			rootScope.$digest();
					
			var scope = container.scope();
					
			expect(scope.toasters.length).toBe(0);
					
			toaster.pop({ type: 'info', title: 'title', body: 'body' });
			toaster.pop({ type: 'info', title: 'title', body: 'body' });
			
			expect(scope.toasters.length).toBe(1);
		});
		
        it('should not allow subsequent duplicates if prevent-duplicates is true and id matches with unique bodies', function () {
			var container = angular.element(
				'<toaster-container toaster-options="{\'prevent-duplicates\': true}"></toaster-container>');
	
			$compile(container)(rootScope);
			rootScope.$digest();
					
			var scope = container.scope();
					
			expect(scope.toasters.length).toBe(0);
					
			var toastWrapper = toaster.pop({ type: 'info', title: 'title', body: 'body' });
			toaster.pop({ type: 'info', title: 'title', body: 'body2', toastId: toastWrapper.toastId });
			
			expect(scope.toasters.length).toBe(1);
		});
        
		it('should allow subsequent duplicates if prevent-duplicates is true with unique toastId and body params', function () {
			var container = angular.element(
				'<toaster-container toaster-options="{\'prevent-duplicates\': true}"></toaster-container>');
	
			$compile(container)(rootScope);
			rootScope.$digest();
					
			var scope = container.scope();
					
			expect(scope.toasters.length).toBe(0);
					
			toaster.pop({ type: 'info', title: 'title', body: 'body', toastId: 1 });
			toaster.pop({ type: 'info', title: 'title', body: 'body2', toastId: 2 });
			
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
		
		it('default toast template exists', function () {
			inject(function($templateCache) {
				var template = $templateCache.get('angularjs-toaster/toast.html');

				expect(template.length).toBeGreaterThan(0);
			});
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
		
		it('should remove first in toast if limit is met and newest-on-top is true', function () {
			var container = angular.element(
				'<toaster-container toaster-options="{\'limit\': 2, \'newest-on-top\': true }"></toaster-container>');
				
			$compile(container)(rootScope);
			rootScope.$digest();
			
			var scope = container.scope();
			
			toaster.pop({ type: 'info', body: 'first' });
			toaster.pop({ type: 'info', body: 'second' });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(2);
			expect(scope.toasters[0].body).toBe('second');
			expect(scope.toasters[1].body).toBe('first');
			
			toaster.pop({ type: 'info', body: 'third' });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(2);
			expect(scope.toasters[0].body).toBe('third');
			expect(scope.toasters[1].body).toBe('second');
		});
		
		it('should remove last in toast if limit is met and newest-on-top is false', function () {
			var container = angular.element(
				'<toaster-container toaster-options="{\'limit\': 2, \'newest-on-top\': false }"></toaster-container>');
				
			$compile(container)(rootScope);
			rootScope.$digest();
			
			var scope = container.scope();
			
			toaster.pop({ type: 'info', body: 'first' });
			toaster.pop({ type: 'info', body: 'second' });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(2);
			expect(scope.toasters[0].body).toBe('first');
			expect(scope.toasters[1].body).toBe('second');
			
			toaster.pop({ type: 'info', body: 'third' });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(2);
			expect(scope.toasters[0].body).toBe('second');
			expect(scope.toasters[1].body).toBe('third');
		});
        
        it('should invoke onShowCallback if it exists when toast is added', function () {
			compileContainer();
			var mock = {
				callback : function () { }
			};
			
			spyOn(mock, 'callback');
			
			toaster.pop({ type: 'info', body: 'toast 1', onShowCallback: mock.callback });
			
			rootScope.$digest();
			
			expect(mock.callback).toHaveBeenCalled();
		});
        
        it('should not invoke onShowCallback if it does not exist when toast is added', function () {
			compileContainer();
			var mock = {
				callback : function () { }
			};
			
			spyOn(mock, 'callback');
			
			toaster.pop({ type: 'info', body: 'toast 1' });
			
			rootScope.$digest();
			
			expect(mock.callback).not.toHaveBeenCalled();
		});
	});
	
	
	describe('removeToast', function () {
		it('should not remove toast if toastId does not match a toastId', function() {
			var container = compileContainer();
			var scope = container.scope();
			
			var toast1 = toaster.pop({ type: 'info', body: 'toast 1' });
			var toast2 = toaster.pop({ type: 'info', body: 'toast 2' });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(2);
			expect(scope.toasters[1].toastId).toBe(toast1.toastId)
			expect(scope.toasters[0].toastId).toBe(toast2.toastId)
			
			scope.removeToast(3);
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(2);
		});
	
		it('should invoke onHideCallback if it exists when toast is removed', function () {
			var container = compileContainer();
			var scope = container.scope();
			
			var mock = {
				callback : function () { }
			};
			
			spyOn(mock, 'callback');
			
			var toast = toaster.pop({ type: 'info', body: 'toast 1', onHideCallback: mock.callback });
			
			rootScope.$digest();
			scope.removeToast(toast.toastId);
			rootScope.$digest();
			
			expect(mock.callback).toHaveBeenCalled();
		});
	});


	describe('scope._onNewTest', function () {
		it('should not add toast if toasterId is passed to scope._onNewToast but toasterId is not set via config', function () {
			var container = compileContainer();
			var scope = container.scope();
	
			expect(scope.config.toasterId).toBeUndefined();
			
			toaster.pop({ type: 'info', body: 'toast 1', toasterId: 1 });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(0);
		});
		
		it('should add toast if toasterId is passed to scope._onNewToast and toasterId is set via config', function () {
			var container = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 1 }"></toaster-container>');
					
			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
	
			expect(scope.config.toasterId).toBe(1);
			
			toaster.pop({ type: 'info', body: 'toast 1', toasterId: 1 });
			
			rootScope.$digest();
			
			expect(scope.toasters.length).toBe(1);
		});
	
		it('should add toasts to their respective container based on toasterId', function () {
			var container1 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 1 }"></toaster-container>');
			var container2 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 2 }"></toaster-container>');
					
			$compile(container1)(rootScope);
			$compile(container2)(rootScope);
			rootScope.$digest();
			
			var scope1 = container1.scope();
			var scope2 = container2.scope();
				
			toaster.pop({ type: 'info', body: 'toast 1', toasterId: 1 });
			toaster.pop({ type: 'info', body: 'toast 2', toasterId: 2 });
				
			rootScope.$digest();
				
			expect(scope1.toasters.length).toBe(1);
			expect(scope2.toasters.length).toBe(1);
		});
	});

	describe('scope._onClearToasts', function (){
		it('should remove all toasts from all containers if toasterId is *', function () {
			var container1 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 1 }"></toaster-container>');
			var container2 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 2 }"></toaster-container>');
					
			$compile(container1)(rootScope);
			$compile(container2)(rootScope);
			rootScope.$digest();
			
			var scope1 = container1.scope();
			var scope2 = container2.scope();
				
			toaster.pop({ type: 'info', body: 'toast 1', toasterId: 1 });
			toaster.pop({ type: 'info', body: 'toast 2', toasterId: 2 });
				
			rootScope.$digest();
				
			expect(scope1.toasters.length).toBe(1);
			expect(scope2.toasters.length).toBe(1);
			
			toaster.clear('*');
			
			rootScope.$digest();
			
			expect(scope1.toasters.length).toBe(0);
			expect(scope2.toasters.length).toBe(0); 
		});
		
		it('should remove all toasts from all containers if config.toasterId and toastId are undefined', function () {
			var container1 = angular.element(
				'<toaster-container toaster-options="{ \'close-button\': false }"></toaster-container>');
			var container2 = angular.element(
				'<toaster-container toaster-options="{ \'close-button\': true }" ></toaster-container>');
					
			$compile(container1)(rootScope);
			$compile(container2)(rootScope);
			rootScope.$digest();
			
			var scope1 = container1.scope();
			var scope2 = container2.scope();
				
			toaster.pop({ type: 'info', body: 'toast 1' });
			toaster.pop({ type: 'info', body: 'toast 2' });
				
			rootScope.$digest();
				
			// since there are two separate instances of the container  
			// without a toasterId, both receive the newToast event
			expect(scope1.toasters.length).toBe(2);
			expect(scope2.toasters.length).toBe(2);
			
			toaster.clear();
			
			rootScope.$digest();
			
			expect(scope1.toasters.length).toBe(0);
			expect(scope2.toasters.length).toBe(0);
		});
		
		it('should not remove by toasterId / toastId from the correct container if toast.toasterId is defined and toast.toastId is undefined', function () {
			var container1 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 1 }"></toaster-container>');
			var container2 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 2 }"></toaster-container>');
					
			$compile(container1)(rootScope);
			$compile(container2)(rootScope);
			rootScope.$digest();
			
			var scope1 = container1.scope();
			var scope2 = container2.scope();
			
			// removeAllToasts explicitly looks for toast.uid, which is only set
			// if toastId is passed as a parameter
			toaster.pop({ type: 'info', body: 'toast 1', toasterId: 1 });
			toaster.pop({ type: 'info', body: 'toast 2', toasterId: 2 });
			toaster.pop({ type: 'info', body: 'toast 3', toasterId: 2 });
				
			rootScope.$digest();
				
			expect(scope1.toasters.length).toBe(1);
			expect(scope2.toasters.length).toBe(2);
			
			toaster.clear(2, 1);
			
			rootScope.$digest();
			
			expect(scope1.toasters.length).toBe(1);
			expect(scope2.toasters.length).toBe(2);
		});
		
		it('should remove by toasterId / toastId from the correct container if toasterId is defined and toastId is defined', function () {
			var container1 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 1 }"></toaster-container>');
			var container2 = angular.element(
				'<toaster-container toaster-options="{ \'toaster-id\': 2 }"></toaster-container>');
					
			$compile(container1)(rootScope);
			$compile(container2)(rootScope);
			rootScope.$digest();
			
			var scope1 = container1.scope();
			var scope2 = container2.scope();
			
			// removeAllToasts explicitly looks for toast.uid, which is only set
			// if toastId is passed as a parameter
			var toast1 = toaster.pop({ type: 'info', body: 'toast 1', toasterId: 1, toastId: 1 });
			var toast2 = toaster.pop({ type: 'info', body: 'toast 2', toasterId: 2, toastId: 1 });
			var toast3 = toaster.pop({ type: 'info', body: 'toast 3', toasterId: 2, toastId: 2 });
				
			rootScope.$digest();
				
			expect(scope1.toasters.length).toBe(1);
			expect(scope2.toasters.length).toBe(2);
			
			toaster.clear(2, toast2.toastId);
			
			rootScope.$digest();
			
			expect(scope1.toasters.length).toBe(1);
			expect(scope2.toasters.length).toBe(1);
		});
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