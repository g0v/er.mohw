/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["module"],function(a){var b=a.config&&a.config()||{};return{load:function(a,c,d){var e=c.toUrl(a);c(["text!"+a],function(a){b.registerTemplate&&b.registerTemplate(e,a),d(a)})}}});