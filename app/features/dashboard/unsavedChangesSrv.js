/*! grafana - v1.9.1 - 2015-01-02
 * Copyright (c) 2015 Torkel Ödegaard; Licensed Apache License */

define(["angular","lodash","config"],function(a,b,c){if(c.unsaved_changes_warning){var d=a.module("grafana.services");d.service("unsavedChangesSrv",["$rootScope","$modal","$q","$location","$timeout",function(c,d,e,f,g){var h=this,i=c.$new();c.$on("dashboard-loaded",function(b,c){g(function(){h.original=a.copy(c),h.current=c},1200)}),c.$on("dashboard-saved",function(b,c){h.original=a.copy(c),h.current=c,h.orignalPath=f.path()}),c.$on("$routeChangeSuccess",function(){h.original=null,h.originalPath=f.path()}),window.onbeforeunload=function(){return h.has_unsaved_changes()?"There are unsaved changes to this dashboard":void 0},this.init=function(){c.$on("$locationChangeStart",function(a,b){h.originalPath!==f.path()&&h.has_unsaved_changes()&&(a.preventDefault(),h.next=b,g(h.open_modal))})},this.open_modal=function(){var a=d({template:"./app/partials/unsaved-changes.html",persist:!0,show:!1,scope:i,keyboard:!1});e.when(a).then(function(a){a.modal("show")})},this.has_unsaved_changes=function(){if(!h.original)return!1;var c=a.copy(h.current),d=h.original;c.time=d.time={},c.refresh=d.refresh,b.each(c.templating.list,function(a,b){a.current=null,a.options=null,d.templating.list[b].current=null,d.templating.list[b].options=null});var e=b.findWhere(c.nav,{type:"timepicker"}),f=b.findWhere(d.nav,{type:"timepicker"});e&&f&&(e.now=f.now);var g=a.toJson(c),i=a.toJson(d);return g!==i?!0:!1},this.goto_next=function(){var a=f.absUrl().length-f.url().length,b=h.next.substring(a);f.url(b)},i.ignore=function(){h.original=null,h.goto_next()},i.save=function(){var a=c.$on("dashboard-saved",function(){h.goto_next()});g(a,2e3),c.$emit("save-dashboard")}}]).run(["unsavedChangesSrv",function(a){a.init()}])}});