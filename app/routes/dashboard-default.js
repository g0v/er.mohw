/*! grafana - v1.7.0 - 2014-08-16
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["angular","config"],function(a,b){var c=a.module("grafana.routes");c.config(["$routeProvider",function(a){a.when("/",{redirectTo:function(){return window.localStorage&&window.localStorage.grafanaDashboardDefault?window.localStorage.grafanaDashboardDefault:b.default_route}})}])});