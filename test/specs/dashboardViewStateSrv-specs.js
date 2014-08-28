/*! grafana - v1.7.0 - 2014-08-28
 * Copyright (c) 2014 Torkel Ödegaard; Licensed Apache License */

define(["services/dashboard/dashboardViewStateSrv"],function(){describe("when updating view state",function(){var a,b;beforeEach(module("grafana.services")),beforeEach(inject(function(c,d,e){e.onAppEvent=function(){},a=c.create(e),b=d})),describe("to fullscreen true and edit true",function(){it("should update querystring and view state",function(){var c={fullscreen:!0,edit:!0,panelId:1};a.update(c),expect(b.search()).to.eql(c),expect(a.fullscreen).to.be(!0)})}),describe("to fullscreen false",function(){it("should remove params from query string",function(){a.update({fullscreen:!0,panelId:1,edit:!0}),a.update({fullscreen:!1}),expect(b.search()).to.eql({}),expect(a.fullscreen).to.be(!1)})})})});