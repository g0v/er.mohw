/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["angular","lodash","config"],function(a,b,c){var d=a.module("grafana.controllers");d.controller("MetricKeysCtrl",["$scope","$http","$q",function(d,e,f){function g(a,d,g){return f.all(b.map(c.datasources,function(b){return(b.type="graphite")?e.get(b.url+a).then(d,g):void 0}))}function h(a,b){return a||a.data||0!==a.data.length?a.data.length===b?f.when("done"):(b=b||0,l(a.data[b]).then(function(){return h(a,b+1)})):f.reject("No metrics from graphite")}function i(){var a=f.defer();return e.delete(n,o).success(function(){a.resolve("ok")}).error(function(b,c){404===c?a.resolve("ok"):a.reject("elastic search returned unexpected error")}),a.promise}function j(){return e.put(n,{settings:{analysis:{analyzer:{metric_path_ngram:{tokenizer:"my_ngram_tokenizer"}},tokenizer:{my_ngram_tokenizer:{type:"nGram",min_gram:"3",max_gram:"8",token_chars:["letter","digit","punctuation","symbol"]}}}},mappings:{metricKey:{properties:{metricPath:{type:"multi_field",fields:{metricPath:{type:"string",index:"analyzed",index_analyzer:"standard"},metricPath_ng:{type:"string",index:"analyzed",index_analyzer:"metric_path_ngram"}}}}}}},o)}function k(a){var c=a.data;if(!c||0===c.length)return void console.log("no data");var d=b.map(c,function(a){return a.expandable?m(a.id+".*"):a.leaf?l(a.id):void 0});return f.all(d)}function l(a){var b=d.ejs.Document(c.grafana_metrics_index,"metricKey",a).source({metricPath:a});return b.doIndex(function(){d.infoText="Indexing "+a,d.metricCounter=d.metricCounter+1},function(){d.errorText="failed to save metric "+a})}function m(a){return g("/metrics/find/?query="+a,k)}var n=c.elasticsearch+"/"+c.grafana_metrics_index+"/",o={};c.elasticsearchBasicAuth&&(o.withCredentials=!0,o.headers={Authorization:"Basic "+c.elasticsearchBasicAuth}),d.init=function(){d.metricPath="prod.apps.api.boobarella.*",d.metricCounter=0},d.createIndex=function(){d.errorText=null,d.infoText=null,i().then(j).then(function(){d.infoText="Index created!"}).then(null,function(b){d.errorText=a.toJson(b)})},d.loadMetricsFromPath=function(){return d.errorText=null,d.infoText=null,d.metricCounter=0,m(d.metricPath).then(function(){d.infoText="Indexing completed!"},function(a){d.errorText="Error: "+a})},d.loadAll=function(){d.infoText="Fetching all metrics from graphite...",g("/metrics/index.json",h).then(function(){d.infoText="Indexing complete!"}).then(null,function(a){d.errorText=a})}}])});