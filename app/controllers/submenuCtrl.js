/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["angular","app","lodash"],function(a,b,c){var d=a.module("grafana.controllers");d.controller("SubmenuCtrl",["$scope",function(a){var b={enable:!0};c.defaults(a.pulldown,b),a.init=function(){a.panel=a.pulldown,a.row=a.pulldown},a.init()}])});