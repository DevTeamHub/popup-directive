 /**
 * Popup Directive
 * https://github.com/DevTeamHub/popup-directive
 * (c) 2016 Dev Team Inc. http://dev-team.com
 * License: MIT
 */

 var popupModule = angular.module('dev-team-popup', []);

 popupModule.directive('dtPopup', dtPopupDirective)
            .directive('dtPopupLink', dtPopupLinkDirective);

function dtPopupDirective() {
    return {
        scope: {},
        restrict: "E",
        replace: true,
        templateUrl: templateSelector,
        controller: ['$scope', dtPopupController],
        controllerAs: "ctrl",
        link: function ($scope) {
            $scope.$on("DtPopupShow", function (event, data) {
                $scope.origin = data.model;
                $scope.model = angular.copy(data.model);
                $scope.title = data.title;
                $scope.url = data.url;
                $scope.saveAction = data.saveAction;
                $scope.addMode = true;
                $scope.popupForm.$setPristine();
                $scope.popupForm.$submitted = false;
            });
        }
    };

    function templateSelector(element, attrs) {
        if (attrs.templateUrl) {
            return attrs.templateUrl;
        }
        return "dt-popup.tmpl.html";
    }
}

function dtPopupController($scope) {
	this.isSubmitted = function(){
		return $scope.popupForm.$submitted;
	};

    this.cancel = function () {
        $scope.addMode = false;
    };

    this.save = function () {
    	 if ($scope.popupForm.$invalid) {
            $scope.popupForm.$setDirty();
            $scope.popupForm.$submitted = true;
            return;
        }

        $scope.saveAction({model: $scope.model}).then(function(){
            if ($scope.origin) angular.copy($scope.model, $scope.origin);
        });
        $scope.addMode = false;
    };
}

function dtPopupLinkDirective() {
    return {
        scope: {
            model: "=ngModel",
            title: "@",
            url: '=',
            initAction: '&',
            saveAction: '&'
        },
        restrict: "E",
        replace: true,
        controller: ['$scope', '$rootScope', '$q', dtPopupLinkController],
        controllerAs: "ctrl",
        template: '<button ng-click="ctrl.open()">{{title}}</button>'
    }
}

function dtPopupLinkController($scope, $rootScope, $q) {
    this.open = function () {
        if (!$scope.model)
            $scope.model = {};
        var promise = $scope.initAction({model: $scope.model});
        if (!promise) promise = $q.when();
        promise.then(function() { $rootScope.$broadcast("DtPopupShow", $scope); });
    }
}


angular.module("dev-team-popup").run(["$templateCache", function ($templateCache) {
    $templateCache.put("dt-popup.tmpl.html",
	"<div class=\"fade popup\" ng-class=\"{modal: addMode, in: addMode}\" tabindex=\"-1\" ng-style=\"addMode && {'display': 'block'} || {'display': 'none'}\"><div class=\"modal-dialog\" ng-form=\"popupForm\" ng-class=\"{submitted: popupForm.$submitted}\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"ctrl.cancel()\">&times;<\/button><h4 class=\"modal-title\">{{title}}<\/h4><\/div><div class=\"modal-body\" ng-include=\"url\"><\/div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-white\" ng-click=\"ctrl.cancel()\">Cancel<\/button><button type=\"button\" class=\"btn btn-primary\" ng-click=\"ctrl.save()\">Save<\/button><\/div><\/div><\/div><\/div>");
}]);