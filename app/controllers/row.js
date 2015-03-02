/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["angular","app","lodash"],function(a,b,c){var d=a.module("grafana.controllers");d.controller("RowCtrl",["$scope","$rootScope","$timeout",function(a,b,d){var e={title:"Row",height:"150px",collapse:!1,editable:!0,panels:[]};c.defaults(a.row,e),a.init=function(){a.reset_panel()},a.toggle_row=function(b){b.collapse=b.collapse?!1:!0,b.collapse||d(function(){a.$broadcast("render")})},a.close_edit=function(){a.$broadcast("render")},a.add_panel=function(b){a.dashboard.add_panel(b,a.row)},a.delete_row=function(){confirm("Are you sure you want to delete this row?")&&(a.dashboard.rows=c.without(a.dashboard.rows,a.row))},a.move_row=function(b){var d=a.dashboard.rows,e=c.indexOf(d,a.row),f=e+b;f>=0&&f<=d.length-1&&c.move(d,e,e+b)},a.add_panel_default=function(b){a.reset_panel(b),a.add_panel(a.panel),d(function(){a.$broadcast("render")})},a.set_height=function(b){a.row.height=b,a.$broadcast("render")},a.remove_panel_from_row=function(a,b){confirm("Are you sure you want to remove this "+b.type+" panel?")&&(a.panels=c.without(a.panels,b))},a.duplicatePanel=function(b,c){a.dashboard.duplicatePanel(b,c||a.row)},a.reset_panel=function(b){function d(a){return a?c.isString(a)?a:a+"px":"200px"}var e=12,f=12-a.dashboard.rowSpan(a.row);a.panel={error:!1,span:e>f&&f>0?f:e,editable:!0,type:b},a.row.height=d(a.row.height)},a.init()}]),d.directive("rowHeight",function(){return function(a,b){a.$watchGroup(["row.collapse","row.height"],function(){b[0].style.minHeight=a.row.collapse?"5px":a.row.height})}}),d.directive("panelWidth",function(){return function(a,b){a.$watch("panel.span",function(){b[0].style.width=a.panel.span/1.2*10+"%"})}}),d.directive("panelDropZone",function(){return function(a,b){a.$watch("dashboard.$$panelDragging",function(c){c&&a.dashboard.rowSpan(a.row)<10?b.show():b.hide()})}})});