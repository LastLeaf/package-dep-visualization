var fs = require('fs');

var graph = [];

var parseDir = function(basepath){
	var curProject = '[ NO NAME ]';
	if(fs.existsSync(basepath + 'package.json') && !fs.statSync(basepath + 'package.json').isDirectory()) {
		var curProject = JSON.parse(fs.readFileSync(basepath + 'package.json').toString('utf8')).name || '[ NO NAME ]';
	}
	if(fs.existsSync(basepath + 'node_modules') && fs.statSync(basepath + 'node_modules').isDirectory()) {
		fs.readdirSync(basepath + 'node_modules').forEach(function(dir){
			if(fs.statSync(basepath + 'node_modules/' + dir).isDirectory()) {
				var baseProject = parseDir(basepath + 'node_modules/' + dir + '/');
				graph.push([curProject, baseProject]);
			}
		});
	}
	return curProject;
}
parseDir('./');

console.log(JSON.stringify(graph));
