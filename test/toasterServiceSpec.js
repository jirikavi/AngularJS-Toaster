/* global describe global it global beforeEach global angular global inject global expect */

'use strict';

describe('toasterService', function () {
	var toaster, toasterConfig, rootScope, $compile;

	beforeEach(function () {
		// load dependencies
		module('testApp');
		module('toaster')
		
		// inject the toaster service
        inject(function (_toaster_, _toasterConfig_, _$rootScope_, _$compile_) {
			toaster = _toaster_;
			toasterConfig = _toasterConfig_;	
			rootScope = _$rootScope_;
			$compile = _$compile_;
		});
	});
	
	
	it('should create an error method from error icon class', function () {
		var container = angular.element('<toaster-container></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();
		
		expect(scope.toasters.length).toBe(0)
		
		expect(toasterConfig['icon-classes'].error).toBe('toast-error');
		
		toaster.error('test', 'test');
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1)
		expect(scope.toasters[0].type).toBe('toast-error');
	});
	
	it('should create an error method from info icon class', function () {
		var container = angular.element('<toaster-container></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();
		
		expect(scope.toasters.length).toBe(0)
		
		expect(toasterConfig['icon-classes'].info).toBe('toast-info');
		
		toaster.info('test', 'test');
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1)
		expect(scope.toasters[0].type).toBe('toast-info');
	});
	
	it('should create an error method from wait icon class', function () {
		var container = angular.element('<toaster-container></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();
		
		expect(scope.toasters.length).toBe(0)
		
		expect(toasterConfig['icon-classes'].wait).toBe('toast-wait');
		
		toaster.wait('test', 'test');
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1)
		expect(scope.toasters[0].type).toBe('toast-wait');
	});
	
	it('should create an error method from success icon class', function () {
		var container = angular.element('<toaster-container></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();
		
		expect(scope.toasters.length).toBe(0)
		
		expect(toasterConfig['icon-classes'].success).toBe('toast-success');
		
		toaster.success('test', 'test');
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1)
		expect(scope.toasters[0].type).toBe('toast-success');
	});
	
	it('should create an error method from warning icon class', function () {
		var container = angular.element('<toaster-container></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();
		
		expect(scope.toasters.length).toBe(0)
		
		expect(toasterConfig['icon-classes'].warning).toBe('toast-warning');
		
		toaster.warning('test', 'test');
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1)
		expect(scope.toasters[0].type).toBe('toast-warning');
	});
	
	it('should create a  method from the icon class that takes an object', function () {
		var container = angular.element('<toaster-container></toaster-container>');

		$compile(container)(rootScope);
		rootScope.$digest();
		var scope = container.scope();
		
		expect(scope.toasters.length).toBe(0)
		
		expect(toasterConfig['icon-classes'].error).toBe('toast-error');
		
		toaster.error({ title: 'test', body: 'test'});
		
		rootScope.$digest();
		
		expect(scope.toasters.length).toBe(1)
		expect(scope.toasters[0].type).toBe('toast-error');
	});
});