/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["angular","config","store"],function(a,b,c){var d=a.module("grafana.routes");d.config(["$routeProvider",function(a){a.when("/",{redirectTo:function(){return c.get("grafanaDashboardDefault")||b.default_route}})}])});