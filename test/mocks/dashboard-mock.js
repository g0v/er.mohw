/*! grafana - v1.7.0 - 2014-08-14
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define([],function(){return{create:function(){return{emit_refresh:function(){},set_interval:function(a){this.refresh=a},title:"",tags:[],style:"dark",timezone:"browser",editable:!0,failover:!1,panel_hints:!0,rows:[],pulldowns:[{type:"templating"},{type:"annotations"}],nav:[{type:"timepicker"}],time:{},templating:{list:[]},refresh:!0}}}});