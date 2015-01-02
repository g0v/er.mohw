/*! grafana - v1.9.1 - 2015-01-02
 * Copyright (c) 2015 Torkel Ödegaard; Licensed Apache License */

define(["angular","app","lodash","require"],function(a,b,c){var d=a.module("grafana.panels.custom",[]);b.useModule(d),d.controller("CustomPanelCtrl",["$scope","panelSrv",function(a,b){a.panelMeta={description:"Example plugin panel"};var d={};c.defaults(a.panel,d),a.init=function(){b.init(a)},a.init()}])});