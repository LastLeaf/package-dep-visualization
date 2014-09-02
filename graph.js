// generated edge lists
var graph = [["lightpalette","[ NO NAME ]"],["fw.mpa","[ NO NAME ]"],["compression","bytes"],["compression","compressible"],["compression","negotiator"],["fw.mpa","compression"],["mongodb","bson"],["mongodb","kerberos"],["connect-mongo","mongodb"],["fw.mpa","connect-mongo"],["cookie-parser","cookie"],["cookie-parser","cookie-signature"],["fw.mpa","cookie-parser"],["accepts","mime"],["accepts","negotiator"],["express","accepts"],["express","buffer-crc32"],["express","cookie"],["express","cookie-signature"],["express","debug"],["express","escape-html"],["express","fresh"],["express","merge-descriptors"],["express","methods"],["express","parseurl"],["express","path-to-regexp"],["proxy-addr","ipaddr.js"],["express","proxy-addr"],["express","qs"],["express","range-parser"],["send","debug"],["send","mime"],["express","send"],["express","serve-static"],["type-is","mime"],["express","type-is"],["express","utils-merge"],["fw.mpa","express"],["express-session","buffer-crc32"],["express-session","cookie"],["express-session","cookie-signature"],["debug","ms"],["express-session","debug"],["express-session","depd"],["express-session","on-headers"],["uid-safe","base64-url"],["uid-safe","mz"],["express-session","uid-safe"],["express-session","utils-merge"],["fw.mpa","express-session"],["handlebars","[ NO NAME ]"],["optimist","wordwrap"],["handlebars","optimist"],["uglify-js","async"],["source-map","amdefine"],["uglify-js","source-map"],["handlebars","uglify-js"],["fw.mpa","handlebars"],["fw.mpa","locale"],["fw.mpa","mkdirp"],["mongoose","hooks"],["bson","nan"],["mongodb","bson"],["mongodb","kerberos"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["mongodb","readable-stream"],["mongoose","mongodb"],["mongoose","mpath"],["mongoose","mpromise"],["mquery","debug"],["mongoose","mquery"],["mongoose","ms"],["mongoose","muri"],["mongoose","regexp-clone"],["mongoose","sliced"],["fw.mpa","mongoose"],["faye-websocket","websocket-driver"],["sockjs","faye-websocket"],["sockjs","node-uuid"],["fw.mpa","sockjs"],["stylus","css-parse"],["stylus","debug"],["glob","inherits"],["minimatch","lru-cache"],["minimatch","sigmund"],["glob","minimatch"],["stylus","glob"],["stylus","mkdirp"],["stylus","sax"],["fw.mpa","stylus"],["optimist","wordwrap"],["uglify-js","optimist"],["source-map","amdefine"],["uglify-js","source-map"],["uglify-js","uglify-to-browserify"],["fw.mpa","uglify-js"],["fw.mpa","uglifycss"],["fw.mpa","watch"],["lightpalette","fw.mpa"],["lightpalette","marked"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["multiparty","readable-stream"],["multiparty","stream-counter"],["lightpalette","multiparty"],["mv","[ NO NAME ]"],["mv","mkdirp"],["mv","ncp"],["mv","rimraf"],["lightpalette","mv"],["nodemailer","[ NO NAME ]"],["nodemailer","directmail"],["nodemailer","he"],["mailcomposer","dkim-signer"],["follow-redirects","underscore"],["mailcomposer","follow-redirects"],["mailcomposer","mime"],["mimelib","addressparser"],["encoding","iconv-lite"],["mimelib","encoding"],["mailcomposer","mimelib"],["mailcomposer","punycode"],["nodemailer","mailcomposer"],["nodemailer","public-address"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["nodemailer","readable-stream"],["simplesmtp","rai"],["simplesmtp","xoauth2"],["nodemailer","simplesmtp"],["lightpalette","nodemailer"],["lightpalette","pngjs"],["rss","mime"],["rss","xml"],["lightpalette","rss"],["sanitize-html","[ NO NAME ]"],["sanitize-html","he"],["htmlparser2","domelementtype"],["htmlparser2","domhandler"],["htmlparser2","domutils"],["readable-stream","core-util-is"],["readable-stream","inherits"],["readable-stream","isarray"],["readable-stream","string_decoder"],["htmlparser2","readable-stream"],["sanitize-html","htmlparser2"],["sanitize-html","lodash"],["lightpalette","sanitize-html"],["lightpalette","timezone"]];

'use strict'; (function(){

	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;

	var V_CIRCLE_R = 5;
	var V_CIRCLE_COLOR = '#00d2ff';
	var E_SINGLE_COLOR = '#bbb';
	var E_DOUBLE_COLOR = '#444';

	var E_DISTANCE = 10;
	var E_CHARGE = -200;

	// list vertex
	var v = [], e = [];
	var vObj = {};
	for(var i=0; i<graph.length; i++) {
		vObj[graph[i][0]] = 0;
		vObj[graph[i][1]] = 0;
	}
	for(var k in vObj) {
		v.push({title: k});
		vObj[k] = v.length - 1;
	}
	for(var i=0; i<graph.length; i++) {
		e.push({ source: vObj[graph[i][0]], target: vObj[graph[i][1]] })
	}

	// force graph
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
				.style('fill', V_CIRCLE_COLOR);
		})
		.call(force.drag);

	// circle hints
	svgCircles.selectAll('.gv')
		.on('mouseenter', function(){
			d3.select('#tooltip')
				.style('left', this.data.x)
				.style('top', this.data.y)
				.style('display', 'block');
			d3.select('#tooltip .tooltipText').text(this.getAttribute('vtitle'));
		})
		.on('mouseleave', function(){
			d3.select('#tooltip').style('display', 'none');
		})
		/*.on('mousedown', function(){
			force.stop();
			d3.select('#tooltip .tooltipText').text(this.getAttribute('vtitle'));
		})
		.on('mouseup', function(){
			force.resume();
		})
		.on('mousemove', function(e){
			this.data.x = e.layerX;
			this.data.y = e.layerY;
		})*/;

	// draw lines
	svgLines.selectAll('line').data(e).enter().append('line')
		.classed('ge', true)
		.attr('x1', function(d){ return d.source.x; })
		.attr('x2', function(d){ return d.target.x; })
		.attr('y1', function(d){ return d.source.y; })
		.attr('y2', function(d){ return d.target.y; })
		.attr('stroke-width', 1)
		.attr('stroke', E_SINGLE_COLOR);

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
