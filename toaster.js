'use strict';
 
/*
 * AngularJS Toaster
 * Version: 0.4.1
 *
 * Copyright 2013 Jiri Kavulak.  
 * All Rights Reserved.  
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: Jiri Kavulak
 * Related to project of John Papa and Hans Fjällemark
 */
 
angular.module('toaster', ['ngAnimate'])
.service('toaster', ['$rootScope', function ($rootScope) {
    this.pop = function (type, title, body, timeout, bodyOutputType) {
        this.toast = {
            type: type,
            title: title,
            body: body,
            timeout: timeout,
            bodyOutputType: bodyOutputType
        };
        $rootScope.$broadcast('toaster-newToast');
    };
    this.clearAll = function () {
        $rootScope.$broadcast('toaster-clearAll');
    };
}])
.constant('toasterConfig', {
  				'tap-to-dismiss': true,
					'newest-on-top': true,
					//'fade-in': 1000,            // done in css
					//'on-fade-in': undefined,    // not implemented
					//'fade-out': 1000,           // done in css
					// 'on-fade-out': undefined,  // not implemented
					//'extended-time-out': 1000,    // not implemented
					'time-out': 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
					'icon-classes': {
						error: 'toast-error',
						info: 'toast-info',
						success: 'toast-success',
						warning: 'toast-warning'
					},
					'body-output-type': '', // Options: '', 'trustedHtml', 'template'
					'body-template': 'toasterBodyTmpl.html',
					'icon-class': 'toast-info',
					'position-class': 'toast-top-right',
					'title-class': 'toast-title',
					'message-class': 'toast-message'
				})
.directive('toasterContainer', ['$compile', '$timeout', '$sce', 'toasterConfig', 'toaster',
function ($compile, $timeout, $sce, toasterConfig, toaster) {
  return {
    replace: true,
    restrict: 'EA',
    link: function (scope, elm, attrs){
      
      var id = 0;
      
      var mergedConfig = toasterConfig;
      if (attrs.toasterOptions) {
          angular.extend(mergedConfig, scope.$eval(attrs.toasterOptions));
      }
      
      scope.config = {
          position: mergedConfig['position-class'],
          title: mergedConfig['title-class'],
          message: mergedConfig['message-class'],
          tap: mergedConfig['tap-to-dismiss']
      };
      scope.configureTimer = function configureTimer(toast) {
          var timeout = typeof(toast.timeout) == "number" ? toast.timeout : mergedConfig['time-out'];
          setTimeout(toast, timeout);
      }
      
      function addToast (toast){
        toast.type = mergedConfig['icon-classes'][toast.type];
        if (!toast.type)
            toast.type = mergedConfig['icon-class'];
        
        id++;
        angular.extend(toast, { id: id });

	// Set the toast.bodyOutputType to the default if it isn't set
	toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type']
        switch(toast.bodyOutputType)
        {
          case 'trustedHtml':
            toast.html = $sce.trustAsHtml(toast.body);
            break;
          case 'template':
            toast.bodyTemplate = mergedConfig['body-template'];
            break;
        }
        
        scope.configureTimer(toast);
        
        if (mergedConfig['newest-on-top'] === true)
            scope.toasters.unshift(toast);
        else
            scope.toasters.push(toast);
      }
      
      function setTimeout(toast, time){
          toast.timeout= $timeout(function (){ 
              scope.removeToast(toast.id);
            }, time);
      }

      function clearAllToasts() {
          scope.toasters = [];
      }
      
      scope.toasters = [];
      scope.$on('toaster-newToast', function () {
        addToast(toaster.toast);
      });
      scope.$on('toaster-clearAll', function () {
        clearAllToasts();
      });
    },
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
      
      $scope.stopTimer = function(toast){
        if(toast.timeout) {
          $timeout.cancel(toast.timeout);
            toast.timeout = null;
        }
      };
      $scope.restartTimer = function(toast){
        if(!toast.timeout)
            $scope.configureTimer(toast);
      };
      
      $scope.removeToast = function (id){
        var i = 0;
        for (i; i < $scope.toasters.length; i++){
            if($scope.toasters[i].id === id)
                break;
        }
        $scope.toasters.splice(i, 1);
      };
      
      $scope.remove = function(id){
        if ($scope.config.tap === true){
            $scope.removeToast(id);
        }
      };
    }],
    template:
    '<div  id="toast-container" ng-class="config.position">' +
        '<div ng-repeat="toaster in toasters" class="toast" ng-class="toaster.type" ng-click="remove(toaster.id)" ng-mouseover="stopTimer(toaster)" ng-mouseout="restartTimer(toaster)">' +
          '<div ng-class="config.title">{{toaster.title}}</div>' +
          '<div ng-class="config.message" ng-switch on="toaster.bodyOutputType">' +
            '<div ng-switch-when="trustedHtml" ng-bind-html="toaster.html"></div>' +
            '<div ng-switch-when="template"><div ng-include="toaster.bodyTemplate"></div></div>' +
            '<div ng-switch-default >{{toaster.body}}</div>' +
          '</div>' +
        '</div>' +
    '</div>'
  };
}]);
