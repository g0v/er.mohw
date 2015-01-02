/*! grafana - v1.9.1 - 2015-01-02
 * Copyright (c) 2015 Torkel Ödegaard; Licensed Apache License */

define(["module"],function(a){var b=a.config&&a.config()||{};return{load:function(a,c,d){var e=c.toUrl(a);c(["text!"+a],function(a){b.registerTemplate&&b.registerTemplate(e,a),d(a)})}}});