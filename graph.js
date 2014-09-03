// generated edge lists
var graph = [["compression","bytes"],["compression","compressible"],["compression","negotiator"],["fw.mpa","compression"],["mongodb","bson"],["mongodb","kerberos"],["connect-mongo","mongodb"],["fw.mpa","connect-mongo"],["cookie-parser","cookie"],["cookie-parser","cookie-signature"],["fw.mpa","cookie-parser"],["accepts","mime"],["accepts","negotiator"],["express","accepts"],["express","buffer-crc32"],["express","cookie"],["express","cookie-signature"],["express","debug"],["express","escape-html"],["express","fresh"],["express","merge-descriptors"],["express","methods"],["express","parseurl"],["express","path-to-regexp"],["proxy-addr","ipaddr.js"],["express","proxy-addr"],["express","qs"],["express","range-parser"],["send","debug"],["send","mime"],["express","send"],["express","serve-static"],["type-is","mime"],["express","type-is"],["express","utils-merge"],["fw.mpa","express"],["express-session","buffer-crc32"],["express-session","cookie"],["express-session","cookie-signature"],["debug","ms"],["express-session","debug"],["express-session","depd"],["express-session","on-headers"],["uid-safe","base64-url"],["uid-safe","mz"],["express-session","uid-safe"],["express-session","utils-merge"],["fw.mpa","express-session"],["optimist","wordwrap"],["handlebars","optimist"],["uglify-js","async"],["source-map","amdefine"],["uglify-js","source-map"],["handlebars","uglify-js"],["fw.mpa","handlebars"],["fw.mpa","locale"],["fw.mpa","mkdirp"],["mongoose","hooks"],["bson","nan"],["mongodb","bson"],["mongodb","kerberos"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["mongodb","readable-stream"],["mongoose","mongodb"],["mongoose","mpath"],["mongoose","mpromise"],["mquery","debug"],["mongoose","mquery"],["mongoose","ms"],["mongoose","muri"],["mongoose","regexp-clone"],["mongoose","sliced"],["fw.mpa","mongoose"],["faye-websocket","websocket-driver"],["sockjs","faye-websocket"],["sockjs","node-uuid"],["fw.mpa","sockjs"],["stylus","css-parse"],["stylus","debug"],["glob","inherits"],["minimatch","lru-cache"],["minimatch","sigmund"],["glob","minimatch"],["stylus","glob"],["stylus","mkdirp"],["stylus","sax"],["fw.mpa","stylus"],["optimist","wordwrap"],["uglify-js","optimist"],["source-map","amdefine"],["uglify-js","source-map"],["uglify-js","uglify-to-browserify"],["fw.mpa","uglify-js"],["fw.mpa","uglifycss"],["fw.mpa","watch"],["lightpalette","fw.mpa"],["lightpalette","marked"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["multiparty","readable-stream"],["multiparty","stream-counter"],["lightpalette","multiparty"],["mv","mkdirp"],["mv","ncp"],["mv","rimraf"],["lightpalette","mv"],["nodemailer","directmail"],["nodemailer","he"],["mailcomposer","dkim-signer"],["follow-redirects","underscore"],["mailcomposer","follow-redirects"],["mailcomposer","mime"],["mimelib","addressparser"],["encoding","iconv-lite"],["mimelib","encoding"],["mailcomposer","mimelib"],["mailcomposer","punycode"],["nodemailer","mailcomposer"],["nodemailer","public-address"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["nodemailer","readable-stream"],["simplesmtp","rai"],["simplesmtp","xoauth2"],["nodemailer","simplesmtp"],["lightpalette","nodemailer"],["lightpalette","pngjs"],["rss","mime"],["rss","xml"],["lightpalette","rss"],["sanitize-html","he"],["htmlparser2","domelementtype"],["htmlparser2","domhandler"],["htmlparser2","domutils"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["htmlparser2","readable-stream"],["sanitize-html","htmlparser2"],["sanitize-html","lodash"],["lightpalette","sanitize-html"],["lightpalette","timezone"]];

'use strict'; (function(){

	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	var V_CIRCLE_R = 5;
	var V_CIRCLE_COLOR_H = '191';
	var V_CIRCLE_COLOR_S = '100%';
	var V_CIRCLE_ACTIVE_COLOR = '#444';
	var E_DEFAULT_COLOR = '#bbb';
	var E_ILLEGAL_COLOR = 'red';
	var E_ACTIVE_IN_COLOR = '#E98C03';
	var E_ACTIVE_OUT_COLOR = '#FF6969';

	var E_DISTANCE = 10;
	var E_CHARGE = -160;

	// generate v list
	var v = [], e = [];
	var vNameMap = {};
	for(var i=0; i<graph.length; i++) {
		vNameMap[graph[i][0]] = 0;
		vNameMap[graph[i][1]] = 0;
	}
	for(var k in vNameMap) {
		var vObj = {
			vid: v.length,
			title: k,
			inEdge: [],
			outEdge: [],
			outVidMap: {}
		};
		vNameMap[k] = vObj;
		v.push(vObj);
	}

	// generate e list
	for(var i=0; i<graph.length; i++) {
		var v0 = vNameMap[graph[i][0]];
		var v1 = vNameMap[graph[i][1]];
		if(v0.outVidMap[v1.vid]) continue;
		var eObj = {
			source: v0,
			target: v1,
			illegal: false
		};
		v0.outVidMap[v1.vid] = eObj;
		v0.outEdge.push(eObj);
		v1.inEdge.push(eObj);
		e.push(eObj);
	}

	// calculate in-degree
	var degreeMax = 1;
	for(var i=0; i<v.length; i++) {
		if(v[i].inEdge.length + v[i].outEdge.length > degreeMax) degreeMax = v[i].inEdge.length + v[i].outEdge.length;
	}

	// find circles (depth-first search)
	var dfsFindCircles = function(v, circleCb){
		var visited = {};
		var stackPos = {};
		var stack = [];
		var dfs = function(curV){
			visited[curV.vid] = true;
			stackPos[curV.vid] = stack.length;
			stack.push(curV.vid);
			for(var i=0; i<curV.outEdge.length; i++) {
				var curE = curV.outEdge[i];
				if(stackPos[curE.target.vid] >= 0) {
					circleCb(stack.slice(stackPos[curE.target.vid]));
				}
				if(!visited[curE.target.vid]) {
					dfs(curE.target);
				}
			}
			stackPos[curV.vid] = -1;
			stack.pop();
		};
		for(var i=0; i<v.length; i++) {
			if(visited[i]) continue;
			dfs(v[i]);
		}
	};
	dfsFindCircles(v, function(circleVids){
		v[circleVids[circleVids.length-1]].outVidMap[circleVids[0]].illegal = true;
		for(var i=1; i<circleVids.length; i++) {
			v[circleVids[i-1]].outVidMap[circleVids[i]].illegal = true;
		}
	});

	// init force graph
	var force = d3.layout.force()
		.size([WIDTH, HEIGHT])
		.linkDistance(E_DISTANCE)
		.charge(E_CHARGE)
		.nodes(v)
		.links(e)
		.start();

	// init svg
	var wrapper = d3.select('#wrapper');
	var svg = wrapper.append('svg').attr('width', WIDTH).attr('height', HEIGHT);
	var svgLines = svg.append('g');
	var svgCircles = svg.append('g');

	// draw circles
	svgCircles.selectAll('g').data(v).enter().append('g')
		.classed('gv', true)
		.property('data', function(d){ return d; })
		.attr('transform', function(d){ return 'translate(' + d.x + ',' + d.y + ')'; })
		.attr('vid', function(d){ return d.x; })
		.attr('vtitle', function(d){ return d.title; })
		.call(function(g){
			// add circle
			g.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', V_CIRCLE_R)
				.each(function(d){
					d.elem = this;
					d3.select(this).style('fill', 'hsl(' + V_CIRCLE_COLOR_H + ',' + V_CIRCLE_COLOR_S + ',' + (90 - (d.inEdge.length + d.outEdge.length) / degreeMax*70) + '%)');
				});
		})
		.call(force.drag);

	// v hover hints
	svgCircles.selectAll('.gv')
		.on('mouseenter', function(){
			var curV = this.data;
			d3.select('#tooltip')
				.style('left', curV.x)
				.style('top', curV.y)
				.style('display', 'block');
			d3.select('#tooltip .tooltipText').text(this.getAttribute('vtitle'));
			for(var i=0; i<curV.inEdge.length; i++) {
				curV.inEdge[i].elem.style.stroke = E_ACTIVE_IN_COLOR;
				curV.inEdge[i].source.elem.style.stroke = E_ACTIVE_IN_COLOR;
			}
			for(var i=0; i<curV.outEdge.length; i++) {
				curV.outEdge[i].elem.style.stroke = E_ACTIVE_OUT_COLOR;
				curV.outEdge[i].target.elem.style.stroke = E_ACTIVE_OUT_COLOR;
			}
			curV.elem.style.stroke = V_CIRCLE_ACTIVE_COLOR;
		})
		.on('mouseleave', function(){
			var curV = this.data;
			d3.select('#tooltip').style('display', 'none');
			for(var i=0; i<curV.inEdge.length; i++) {
				curV.inEdge[i].elem.style.stroke = ( curV.inEdge[i].illegal ? E_ILLEGAL_COLOR : E_DEFAULT_COLOR );
				curV.inEdge[i].source.elem.style.stroke = '';
			}
			for(var i=0; i<curV.outEdge.length; i++) {
				curV.outEdge[i].elem.style.stroke = ( curV.outEdge[i].illegal ? E_ILLEGAL_COLOR : E_DEFAULT_COLOR );
				curV.outEdge[i].target.elem.style.stroke = '';
			}
			curV.elem.style.stroke = '';
		});

	// draw lines
	svgLines.selectAll('line').data(e).enter().append('line')
		.classed('ge', true)
		.attr('x1', function(d){ return d.source.x; })
		.attr('x2', function(d){ return d.target.x; })
		.attr('y1', function(d){ return d.source.y; })
		.attr('y2', function(d){ return d.target.y; })
		.attr('stroke-width', 1)
		.attr('stroke', function(d){ if(d.illegal) return E_ILLEGAL_COLOR; return E_DEFAULT_COLOR; })
		.each(function(d){
			d.elem = this;
		});

	// animation
	var updateGraph = function(){
		svgCircles.selectAll('.gv').data(v)
			.attr('transform', function(d){ return 'translate(' + d.x + ',' + d.y + ')'; });
		svgLines.selectAll('.ge').data(e)
			.attr('x1', function(d){ return d.source.x; })
			.attr('x2', function(d){ return d.target.x; })
			.attr('y1', function(d){ return d.source.y; })
			.attr('y2', function(d){ return d.target.y; });
	};
	setInterval(function(){
		force.tick();
		updateGraph();
	}, 40);

})();
