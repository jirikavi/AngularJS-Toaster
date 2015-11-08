/* global describe global it global beforeEach global angular global inject global expect */

'use strict';

describe('directiveTemplate', function () {
	createDirectives();

	var toaster, scope, $compile;

	beforeEach(function () {
		// load dependencies
		module('testApp');
		module('toaster')
		
		// inject the toaster service
        inject(function (_toaster_, _$rootScope_, _$compile_) {
			toaster = _toaster_;
			scope = _$rootScope_;
			$compile = _$compile_;
		});
	});

	it('should load and render the referenced directive template text', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'bind-template-only', bodyOutputType: 'directive' });

		expect(container[0].innerText).toBe('here is some great new text! It was brought in via directive!');
	});

	it('should bind directiveData to the directive template', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'bind-template-with-data', bodyOutputType: 'directive', directiveData: { name: 'Bob' } });

		expect(container[0].innerText).toBe('Hello Bob');
	});
	
	it('should parse type string directiveData to an object', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'bind-template-with-data', bodyOutputType: 'directive', directiveData: '{ "name": "Bob" }' });

		expect(container[0].innerText).toBe('Hello Bob');
	});
	
	it('should render type number directiveData', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'bind-template-with-numeric-data', bodyOutputType: 'directive', directiveData: 2 });

		expect(container[0].innerText).toBe('1 + 1 = 2');
	});

	it('should bind Attribute-restricted templates', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'bind-template-only', bodyOutputType: 'directive', directiveData: { name: 'Bob' } });

		expect(container[0].innerText).toBe('here is some great new text! It was brought in via directive!');
	});

	it('should bind unrestricted templates', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'unrestricted-template', bodyOutputType: 'directive' });

		expect(container[0].innerText).toBe('Unrestricted Template');
	});

	it('should not bind Element-restricted templates', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'element-template', bodyOutputType: 'directive' });

		expect(container[0].innerText).toBe('');
		expect(container[0].innerText).not.toBe('Element Template');
	});

	it('should not bind Class-restricted templates', function () {
		var container = compileContainer();
		pop({ type: 'info', body: 'class-template', bodyOutputType: 'directive' });

		expect(container[0].innerText).toBe('');
		expect(container[0].innerText).not.toBe('Class Template');
	});

	it('should throw an error if directiveName argument is not passed via body', function () {
		var container = compileContainer();
		var hasError = false;
		
		expect(container[0].innerText).toBe('');
		
		try {
			pop({ type: 'info', bodyOutputType: 'directive' });
		} catch (e) {
			expect(e.message).toBe('A valid directive name must be provided via the toast body argument when using bodyOutputType: directive');
			hasError = true;
		}
		
		expect(container[0].innerText).toBe('');
		expect(hasError).toBe(true);
	});
	
	it('should throw an error if directiveName argument is an empty string', function () {
		var container = compileContainer();
		var hasError = false;
		
		expect(container[0].innerText).toBe('');
		
		try {
			pop({ type: 'info', body: '', bodyOutputType: 'directive' });
		} catch (e) {
			expect(e.message).toBe('A valid directive name must be provided via the toast body argument when using bodyOutputType: directive');
			hasError = true;
		}
		
		expect(container[0].innerText).toBe('');
		expect(hasError).toBe(true);
	});

	it('should throw an error if the directive could not be found', function () {
		var hasError = false;

		compileContainer();

		try {
			pop({ type: 'info', body: 'non-existent-directive', bodyOutputType: 'directive' });
		} catch (e) {
			expect(e.message).toBe('non-existent-directive could not be found.');
			hasError = true;
		}

		expect(hasError).toBe(true);
	});


	function compileContainer() {
		var element = angular.element('<toaster-container></toaster-container>');
		$compile(element)(scope);
		scope.$digest();

		return element;
	}

	function pop(params) {
		toaster.pop(params);
		
		// force new toast to be rendered
		scope.$digest();
	}

	function createDirectives() {
		angular.module('testApp', [])
			.directive('bindTemplateOnly', function () {
				return {
					restrict: 'A',
					template: 'here is some great new text! <span style="color:orange">It was brought in via directive!</span>'
				}
			})
			.directive('bindTemplateWithData', function () {
				return { template: 'Hello {{directiveData.name}}' }
			})
			.directive('bindTemplateWithNumericData', function () {
				return { template: '1 + 1 = {{directiveData}}' }
			})
			.directive('elementTemplate', function () {
				return { restrict: 'E', template: 'Element Template' }
			})
			.directive('classTemplate', function () {
				return { restrict: 'C', template: 'Class Template' }
			})
			.directive('unrestrictedTemplate', function () {
				return { template: 'Unrestricted Template' }
			});
	}
})