
var fs = require('fs');
var path = require('path');

var exit = process.exit;

module.exports = {
	/**
	 * 获取文件列表
	 */
	getFileList : function(filepath){
		var result = [];
		var walk = function(filepath){
			var files = fs.readdirSync(filepath);
			files.forEach((file)=>{
				var absolute = path.join(filepath, file);
				var stats = fs.statSync(absolute);
				if(file.charAt(0) !== '.' ){
					if(stats.isDirectory()){
						walk(absolute);
					}
					else {
						result.push(absolute);
					}
				}
			})
		};
		walk(filepath);
		return result;
	},

	/**
	 * 获取远端仓库名称
	 */
	getRepo : function (git) {
	    var repo = /(?:\/)([a-zA-Z0-9_-]+)(?:\.git)?$/;
	    var ret = repo.exec(git);
	    return ret[1];
	}
};



