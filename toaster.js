'use strict';

/*
 * AngularJS Toaster
 * Version: 0.4.5
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
    this.pop = function (type, title, body, timeout, bodyOutputType, id) {
        var toast;

        if (type && (arguments.length === 1) && (typeof type === 'object')) { // if we're given a toast definition instead of a list of properties
            toast = type;
        } else {
            toast = {
                type: type,
                title: title,
                body: body,
                timeout: timeout,
                bodyOutputType: bodyOutputType,
                id: id
            };
        }

        var returnBag = {};
        $rootScope.$broadcast('toaster-newToast', toast, returnBag);

        // Currently designed to return only a single toast.
        // Not ready for a use case where there's more than one toastContainer
        return returnBag.toast;
    };

    /**
     * Get a toast object by id
     * @TODO Move the toast object management to the service instead. That would avoid a fair amount of indirect calls between service-controller-view
     * @param {string} id Toast id
     * @returns {object} Toast object or null if not found.
     */
    this.get = function (id) {
        var returnBag = {};
        $rootScope.$broadcast('toaster-getToast', id, returnBag);

        // Currently designed to return only a single toast.
        // Not ready for a use case where there's more than one toastContainer
        return returnBag.toast;
    };

    /**
     * Edit a toast object by id with a given object map to override its properties
     * @TODO Move the toast object management to the service instead. That would avoid a fair amount of indirect calls between service-controller-view
     * @param {string} id Toast id
     * @param {Object} newProperties
     * @returns {object} Modified toast object or null if not found.
     */
    this.edit = function (id, newProperties) {
        var returnBag = {};
        $rootScope.$broadcast('toaster-editToast', id, newProperties, returnBag);

        // Currently designed to return only a single toast.
        // Not ready for a use case where there's more than one toastContainer
        return returnBag.toast;
    };

    /**
     * Close a toast object by id
     * @TODO Move the toast object management to the service instead. That would avoid a fair amount of indirect calls between service-controller-view
     * @param {string} id Toast id
     * @returns {object} Toast object or null
     */
    this.close = function (id) {
        var returnBag = {};
        $rootScope.$broadcast('toaster-removeToast', id, returnBag);

        // Currently designed to return only a single toast.
        // Not ready for a use case where there's more than one toastContainer
        return returnBag.toast;
    };

    this.clear = function () {
        $rootScope.$broadcast('toaster-clearToasts');
    };
}])
.constant('toasterConfig', {
    'limit': 0,                   // limits max number of toasts 
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
    'message-class': 'toast-message',
    'default-id-prefix': '__toast-'
})
.directive('toasterContainer', ['$compile', '$timeout', '$sce', 'toasterConfig', 'toaster',
function ($compile, $timeout, $sce, toasterConfig, toaster) {
    return {
        replace: true,
        restrict: 'EA',
        scope: true, // creates an internal scope for this directive
        link: function (scope, elm, attrs) {

            var defaultToastIdCounter = 0,
                mergedConfig;
            scope.toasters = [];

            if (attrs.toasterOptions) {
                mergedConfig = angular.extend({}, toasterConfig, scope.$eval(attrs.toasterOptions));
            }

            scope.config = {
                position: mergedConfig['position-class'],
                title: mergedConfig['title-class'],
                message: mergedConfig['message-class'],
                tap: mergedConfig['tap-to-dismiss']
            };

            scope.configureTimer = function configureTimer(toast) {
                var timeout = parseInt(toast.timeout, 10);
                if (typeof timeout !== "number" || isNaN(timeout)) {
                    timeout = mergedConfig['time-out'];
                }
                if (timeout > 0)
                    setTimeout(toast, timeout);
            };

            function addToast(toast) {
                var toastIdPreset = toast.id != null && toast.id !== '';

                // if the toast id was already set, we can edit the existing one if any
                if (toastIdPreset) {
                    var modifiedToast = editToast(toast.id, toast);
                    if (modifiedToast) { // if we found and edited a toast, we can return it
                        return modifiedToast;
                    }
                }

                // setting default toast properties
                setToastDefaultProperties(toast);

                // otherwise, continue to setup the toast object since it's a new one
                scope.configureTimer(toast);

                if (mergedConfig['newest-on-top'] === true) {
                    scope.toasters.unshift(toast);
                    if (mergedConfig['limit'] > 0 && scope.toasters.length > mergedConfig['limit']) {
                        scope.toasters.pop();
                    }
                } else {
                    scope.toasters.push(toast);
                    if (mergedConfig['limit'] > 0 && scope.toasters.length > mergedConfig['limit']) {
                        scope.toasters.shift();
                    }
                }
                return toast;
            }

            // setting default toast properties
            function setToastDefaultProperties(toast) {
                var toastIdPreset = toast.id != null && toast.id !== '';

                toast.type = mergedConfig['icon-classes'][toast.type];
                if (!toast.type) {
                    toast.type = mergedConfig['icon-class'];
                }

                if (!toastIdPreset) {
                    toast.id = mergedConfig['default-id-prefix'] + defaultToastIdCounter++;
                }

                // Set the toast.bodyOutputType to the default if it isn't set
                toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type']
                switch (toast.bodyOutputType) {
                    case 'trustedHtml':
                        toast.html = $sce.trustAsHtml(toast.body);
                        break;
                    case 'template':
                        toast.bodyTemplate = toast.body || mergedConfig['body-template'];
                        break;
                }
            }

            function editToast(id, newProperties) {
                var toast = null;
                if (newProperties) {
                    var result = scope.findToastById(id);
                    if (result) {
                        toast = angular.extend(result.toast, newProperties);
                        // setting default toast properties
                        setToastDefaultProperties(toast);
                    }
                }
                return toast;
            }

            function setTimeout(toast, time) {
                toast.timeoutCancel = $timeout(function () {
                    scope.removeToast(toast.id);
                }, time);
            }

            scope.toasters = [];
            scope.$on('toaster-newToast', function (event, toast, returnBag) {
                var bakedToast = addToast(toast);
                returnBag.toast = bakedToast; // side-effect hack to return the modified toast object to the event caller
            });

            scope.$on('toaster-getToast', function (event, toastId, returnBag) {
                var result = scope.findToastById(toastId); // side-effect hack to return the modified toast object to the event caller
                returnBag.toast = result && result.toast;
            });

            scope.$on('toaster-editToast', function (event, toastId, newProperties, returnBag) {
                var toast = editToast(toastId, newProperties); // side-effect hack to return the modified toast object to the event caller
                returnBag.toast = toast;
            });

            scope.$on('toaster-removeToast', function (event, toastId, returnBag) {
                var result = scope.removeToast(toastId); // side-effect hack to return the modified toast object to the event caller
                returnBag.toast = result && result.toast;
            });

            scope.$on('toaster-clearToasts', function () {
                var toasters = scope.toasters;
                for (var i= 0, len = toasters.length; i < len; i++) {
                    scope.stopTimer(toasters[i]);
                }
                scope.toasters.splice(0, toasters.length);
            });
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            $scope.stopTimer = function (toast) {
                if (toast.timeoutCancel) {
                    $timeout.cancel(toast.timeoutCancel);
                    toast.timeoutCancel = null;
                }
            };

            $scope.restartTimer = function (toast) {
                // if the current toast has a timeout setting and is still in the list of active toasts
                if (toast.timeout && (this.toasters.indexOf(toast) !== -1)) {
                    this.configureTimer(toast);
                }
            };

            /**
             * Finds a toast object by id
             * @param {string} id
             * @returns {index: number, toast: object} Returns an object giving the index of the toast object in "toasters" and the toast object.
             * Or null if not found.
             */
            $scope.findToastById = function (id) {
                var i = 0,
                    toasters = this.toasters,
                    len = toasters.length;
                for (i; i < len; i++) {
                    if (toasters[i].id === id) {
                        return {
                            index: i,
                            toast: toasters[i]
                        };
                    }
                }
                return null;
            };

            /**
             * Deletes a toast object by id
             * @param {string} id
             * @returns {object} Returns the deleted toast object or null if not found.
             */
            $scope.removeToast = function (id) {
                var toastResult = this.findToastById(id);

                if (toastResult) {
                    var toast = toastResult.toast;
                    this.toasters.splice(toastResult.index, 1);

                    this.stopTimer(toast);
                    return toast;
                }
                return null;
            };

            $scope.remove = function (id) {
                if ($scope.config.tap === true) {
                    $scope.removeToast(id);
                }
            };
        }],
        template:
        '<div  id="toast-container" ng-class="config.position">' +
            '<div ng-repeat="toaster in toasters" class="toast" ng-class="toaster.type" ng-click="remove(toaster.id)" ng-mouseover="stopTimer(toaster)"  ng-mouseout="restartTimer(toaster)">' +
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
