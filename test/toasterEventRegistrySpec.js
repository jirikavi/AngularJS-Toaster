/* global describe global it global beforeEach global angular global inject global expect */

'use strict';

describe('toasterEventRegistry', function () {
	var toaster, toasterConfig, toasterEventRegistry, rootScope, $compile;

	beforeEach(function () {
		// load dependencies
		module('testApp');
		module('toaster')
		
		// inject the toaster service
        inject(function (_toaster_, _toasterConfig_, _toasterEventRegistry_, _$rootScope_, _$compile_) {
			toaster = _toaster_;
			toasterConfig = _toasterConfig_;	
			toasterEventRegistry = _toasterEventRegistry_;
			rootScope = _$rootScope_;
			$compile = _$compile_;
		});
	});
	
	it('unsubscribeToNewToastEvent will throw error if newToastEventSubscribers is empty and deregisterNewToast is not defined', function () {
		var hasError = false;
		
		try {
			toasterEventRegistry.unsubscribeToNewToastEvent(function () {});	
		} catch(e) {
			expect(e.message.indexOf(' is not a function')).toBeGreaterThan(-1);
			hasError = true;
		}
		
		expect(hasError).toBe(true);
	});
	
	it('unsubscribeToNewToastEvent will not splice if index not found and will not throw error', function () {
		var hasError = false;
		var fakeHandler = function (fakeHandlerId) {};
		toasterEventRegistry.subscribeToNewToastEvent(fakeHandler);
		
		try {
			toasterEventRegistry.unsubscribeToNewToastEvent(function () {});	
		} catch(e) {
			hasError = true;
		}
		
		expect(hasError).toBe(false);
	});
	
	it('unsubscribeToClearToastsEvent will throw error if clearToastsEventSubscribers is empty and deregisterClearToasts is not defined', function () {
		var hasError = false;
		
		try {
			toasterEventRegistry.unsubscribeToClearToastsEvent(function () {});	
		} catch(e) {
			expect(e.message.indexOf(' is not a function')).toBeGreaterThan(-1);
			hasError = true;
		}
		
		expect(hasError).toBe(true);
	});
	
	it('unsubscribeToClearToastsEvent will not splice if index not found and will not throw error', function () {
		var hasError = false;
		var fakeHandler = function (fakeHandlerId) {};
		toasterEventRegistry.subscribeToClearToastsEvent(fakeHandler);
		
		try {
			toasterEventRegistry.unsubscribeToClearToastsEvent(function () {});	
		} catch(e) {
			hasError = true;
		}
		
		expect(hasError).toBe(false);
	});
});