/*! grafana - v1.7.0 - 2014-08-16
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["angular","app","lodash"],function(a,b,c){var d=a.module("grafana.controllers");d.controller("PulldownCtrl",["$scope","$rootScope","$timeout",function(a,b,d){var e={collapse:!1,notice:!1,enable:!0};c.defaults(a.pulldown,e),a.init=function(){a.panel=a.pulldown,a.row=a.pulldown},a.toggle_pulldown=function(b){b.collapse=b.collapse?!1:!0,b.collapse?a.row.notice=!1:d(function(){a.$broadcast("render")})},a.init()}])});