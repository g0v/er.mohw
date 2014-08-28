/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["kbn"],function(a){function b(){var a=this;this.datasource={},this.annotationsSrv={},this.datasourceSrv={getMetricSources:function(){},get:function(){return a.datasource}},this.providePhase=function(){return module(function(b){b.value("datasourceSrv",a.datasourceSrv),b.value("annotationsSrv",a.annotationsSrv)})},this.createControllerPhase=function(b){return inject(function(c,f,g){a.scope=f.$new(),a.scope.panel={},a.scope.row={panels:[]},a.scope.filter=new e,a.scope.dashboard={},a.scope.dashboardViewState=new d,f.colors=[];for(var h=0;50>h;h++)f.colors.push("#"+h);a.$q=g,a.scope.skipDataOnInit=!0,a.controller=c(b,{$scope:a.scope})})}}function c(){var a=this;this.createService=function(b){return inject([b,"$q","$rootScope","$httpBackend",function(b,c,d,f){a.service=b,a.$q=c,a.$rootScope=d,a.filterSrv=new e,a.$httpBackend=f}])}}function d(){this.registerPanel=function(){}}function e(){this.time={from:"now-1h",to:"now"},this.timeRange=function(b){return b===!1?this.time:{from:a.parseDate(this.time.from),to:a.parseDate(this.time.to)}},this.applyTemplateToTarget=function(a){return a}}return{ControllerTestContext:b,FilterSrvStub:e,ServiceTestContext:c}});