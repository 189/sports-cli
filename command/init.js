"use strict"

var child = require('child_process');
var chalk = require('chalk');
var co = require('co');
var prompt = require('co-prompt');
var fs = require('fs');
var path = require('path');

var config = require('../package.json');
var cwd = process.cwd();

var errorTip = chalk.red, blueTip = chalk.blue;
var exit = process.exit;

module.exports = (cmd)=>{
	var { templates } = config;
	var sample = templates[cmd || "mobile-sample"];
	var repo;

	if(!sample){
		return console.log(chalk.red(`x 没有找到对应${cmd}的模板，请确认当前模板是否存在`));
	}

	repo = getRepo(sample);

	co(function*() {
	    // 处理用户输入
	    var dirname = yield prompt('app name: ');
	    var order = `git clone ${sample}`;
	    var files = fs.readdirSync(cwd);

	    files.forEach((file)=>{
	    	var stats = fs.statSync(file);
	    	var absolute = path.join(cwd, file);
	    	var filename = path.posix.basename(absolute);
	    	// 判断是否已经存在同名文件夹
	    	if(stats.isDirectory() && filename === dirname ){
	    		console.log(errorTip("x 已经存在同名文件夹: " + dirname));
	    		exit(0);
	    	}
	    })
	    
	    console.log(blueTip(`\n >>> 正在生成目录 ${dirname}`));

	    child.exec(order, (error, stdout, stderr) => {
	        if (error) {
	            console.log(errorTip(error));
	            exit(0);
	        }
	        // 目录重命名
	        fs.renameSync(repo, dirname);
	        console.log(chalk.green(`\n √ 目录生成完毕`));
	        exit(0);
	    });
	})

	/**
	 * 获取远端仓库名称
	 */
	function getRepo(git){
		var repo = /([^\/]+)(?=\.git)/;
		var ret = repo.exec(git);
		return ret[0];
	}
};




