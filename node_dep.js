var fs = require('fs');

var graph = [];

var parseDir = function(basepath){
	var curProject = '';
	if(fs.existsSync(basepath + 'package.json') && !fs.statSync(basepath + 'package.json').isDirectory()) {
		curProject = JSON.parse(fs.readFileSync(basepath + 'package.json').toString('utf8')).name || '';
	}
	if(fs.existsSync(basepath + 'node_modules') && fs.statSync(basepath + 'node_modules').isDirectory()) {
		fs.readdirSync(basepath + 'node_modules').forEach(function(dir){
			if(fs.statSync(basepath + 'node_modules/' + dir).isDirectory()) {
				var baseProject = parseDir(basepath + 'node_modules/' + dir + '/');
				if(baseProject) graph.push([curProject || '[ NO NAME ]', baseProject]);
			}
		});
	}
	return curProject;
};
parseDir('./');

console.log(JSON.stringify(graph));
