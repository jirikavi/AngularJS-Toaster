/* global describe global it global beforeEach global angular global jasmine global inject global expect global spyOn */

'use strict';

var rootScope, toaster, $compile;

describe('toasterContainer controller', function () {
	beforeEach(function () {
		module('toaster');
		
		// inject the toaster service
        inject(function (_toaster_, _$rootScope_, _$compile_) {
			toaster = _toaster_;
			rootScope = _$rootScope_;
			$compile = _$compile_;
		});
	});

	it('should stop timer if config.mouseoverTimer is true', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': true }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		expect(scope.config.mouseoverTimer).toBe(true);

		toaster.pop({ type: 'info' });

		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBeDefined();

		scope.stopTimer(scope.toasters[0]);

		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBe(null);
	});

	it('should do nothing if config.mouseoverTimer is true and stopTimer is called again', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': true }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		expect(scope.config.mouseoverTimer).toBe(true);

		toaster.pop({ type: 'info' });

		rootScope.$digest();

		scope.stopTimer(scope.toasters[0]);
		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBe(null);

		scope.stopTimer(scope.toasters[0]);
		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBe(null);
	});

	it('should not stop timer if config.mouseoverTimer is false', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': false }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		expect(scope.config.mouseoverTimer).toBe(false);

		toaster.pop({ type: 'info' });

		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBeDefined();

		scope.stopTimer(scope.toasters[0]);

		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBeDefined();
	});

	it('should restart timer if config.mouseoverTimer is true and timeoutPromise is falsy', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': true }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		toaster.pop({ type: 'info' });
		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBeDefined();

		scope.stopTimer(scope.toasters[0]);
		expect(scope.toasters[0].timeoutPromise).toBe(null);

		scope.restartTimer(scope.toasters[0]);
		expect(scope.toasters[0].timeoutPromise).toBeDefined();
	});

	it('should not restart timer if config.mouseoverTimer is true and timeoutPromise is truthy', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': true }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		toaster.pop({ type: 'info' });
		rootScope.$digest();

		expect(scope.toasters[0].timeoutPromise).toBeDefined();

		spyOn(scope, 'configureTimer').and.callThrough();

		scope.restartTimer(scope.toasters[0]);
		expect(scope.toasters[0].timeoutPromise).toBeDefined();
		expect(scope.configureTimer).not.toHaveBeenCalled();
	});

	it('should not restart timer and should remove toast if config.mouseoverTimer is not true and timeoutPromise is null', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': 2 }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		toaster.pop({ type: 'info' });
		rootScope.$digest();

		expect(scope.config.mouseoverTimer).toBe(2);

		scope.toasters[0].timeoutPromise = null;

		spyOn(scope, 'configureTimer').and.callThrough();
		spyOn(scope, 'removeToast').and.callThrough();

		scope.restartTimer(scope.toasters[0]);

		expect(scope.configureTimer).not.toHaveBeenCalled();
		expect(scope.removeToast).toHaveBeenCalled();
		expect(scope.toasters.length).toBe(0)
	});

	it('should not restart timer or remove toast if config.mouseoverTimer is not true and timeoutPromise is not null', function () {
		var container = angular.element(
			'<toaster-container toaster-options="{ \'mouseover-timer-stop\': 2 }"></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();

		toaster.pop({ type: 'info' });
		rootScope.$digest();

		expect(scope.config.mouseoverTimer).toBe(2);

		spyOn(scope, 'configureTimer').and.callThrough();
		spyOn(scope, 'removeToast').and.callThrough();

		scope.restartTimer(scope.toasters[0]);

		expect(scope.configureTimer).not.toHaveBeenCalled();
		expect(scope.removeToast).not.toHaveBeenCalled();
		expect(scope.toasters.length).toBe(1)
	});

	describe('click', function () {
		it('should do nothing if config.tap is not true and toast.showCloseButton is not true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': false, \'close-button\': false }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});
		
		it('should do nothing if config.tap is not true and toast.showCloseButton is true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': false, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});
		
		it('should do nothing if config.tap is not true and isCloseButton is not true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': false, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0], false);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});

		it('should do nothing if config.tap is not true and toast.tap is not true and isCloseButton is not true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': false, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', tapToDismiss: false });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0], false);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});

		it('should do nothing if config.tap is true and toast.tap is not true and isCloseButton is not true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', tapToDismiss: false });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0], false);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});
		
		it('should remove toast if config.tap is false but toast.tap is true', function () {	
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': false, \'close-button\': false }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', tapToDismiss: true });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(0);
			expect(scope.removeToast).toHaveBeenCalled();
		});

		it('should remove toast if config.tap is false but toast.tap is true', function () {	
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': false }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', tapToDismiss: true });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(0);
			expect(scope.removeToast).toHaveBeenCalled();
		});

		it('should remove toast if config.tap is true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(0);
			expect(scope.removeToast).toHaveBeenCalled();
		});
		
		it('should remove toast if config.tap is true and the click handler function returns true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', clickHandler: function (toast, isCloseButton) { return true; } });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(0);
			expect(scope.removeToast).toHaveBeenCalled();
		});
		
		it('should not remove toast if config.tap is true and the click handler function does not return true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', clickHandler: function (toast, isCloseButton) { } });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});
		
		it('should remove toast if config.tap is true and the click handler exists on the parent returning true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			scope.$parent.clickHandler = function () { return true; };
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', clickHandler: 'clickHandler' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(0);
			expect(scope.removeToast).toHaveBeenCalled();
		});
		
		it('should not remove toast if config.tap is true and the click handler exists on the parent not returning true', function () {
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			scope.$parent.clickHandler = function () { };
			
			spyOn(scope, 'removeToast').and.callThrough();
			
			toaster.pop({ type: 'info', clickHandler: 'clickHandler' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(1);
			expect(scope.removeToast).not.toHaveBeenCalled();
		});
		
		it('should remove toast if config.tap is true and the click handler does not exist on the parent', function () {
			// TODO: this functionality seems counter-intuitive.  
			// Need to identify use cases to see if this is actually correct.
			
			var container = angular.element(
			'<toaster-container toaster-options="{ \'tap-to-dismiss\': true, \'close-button\': true }"></toaster-container>');

			$compile(container)(rootScope);
			rootScope.$digest();
			var scope = container.scope();
			
			spyOn(scope, 'removeToast').and.callThrough();
			console.log = jasmine.createSpy("log");
			
			toaster.pop({ type: 'info', clickHandler: 'clickHandler' });
			rootScope.$digest();
			
			scope.click({stopPropagation: function() {return true;}}, scope.toasters[0]);
			
			expect(scope.toasters.length).toBe(0);
			expect(scope.removeToast).toHaveBeenCalled();
			
    		expect(console.log).toHaveBeenCalledWith("TOAST-NOTE: Your click handler is not inside a parent scope of toaster-container.");
		});
	});
});