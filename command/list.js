
var config = require('../package.json');
var { templates } = config;
var { exit, stdout } = process;

module.exports = ()=>{
	Object.keys(templates).map((name)=>{
		stdout.write(`${name} : ${templates[name]}\n`);
	})
	exit(0);
}




