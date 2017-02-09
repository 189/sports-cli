"use strict"

var child = require('child_process');
var chalk = require('chalk');
var co = require('co');
var prompt = require('co-prompt');
var fs = require('fs');
var path = require('path');
var bb = require('bluebird');

var config = require('../package.json');
var utils = require('../libs/utils');
var cwd = process.cwd();

var errorTip = chalk.red,
    blueTip = chalk.blue;

var exit = process.exit;

module.exports = (cmd) => {
    var { templates } = config;
    var sample = templates[cmd || "mobile-sample"];
    var repo;

    // 判断远端仓库是否存在对应模板
    if (!sample) {
        return console.log(chalk.red(`x 没有找到对应${cmd}的模板，请确认当前模板是否存在`));
    }

    // 获取模板参考名称
    repo = utils.getRepo(sample);

    co(function*() {
        var dirname = yield prompt('App name: ');
        var order = `git clone ${sample}`;
        var files = fs.readdirSync(cwd);

        // 遍历当前根目录 判断是否已经存在同名文件夹
        files.forEach((file) => {
            var stats = fs.statSync(file);
            var absolute = path.join(cwd, file);
            var filename = path.posix.basename(absolute);
            if (stats.isDirectory() && filename === dirname) {
                console.log(errorTip("x 已经存在同名文件夹: " + dirname));
                exit(0);
            }
        })

        console.log(blueTip(`> 正在生成目录 ${dirname}`));

        child.exec(order, (error, stdout, stderr) => {
        	var absolute = path.join(cwd, dirname);
            if (error) {
                console.log(errorTip(error));
                exit(0);
            }
            // 目录重命名
            fs.renameSync(repo, dirname);

            // 获取文件列表 替换文件内容
        	var fileList = utils.getFileList(absolute);
        	console.log(blueTip(`> 内容替换`));
        	fileList.forEach((file)=>{
        		var data = fs.readFileSync(file, 'utf-8');
        		var content = data.replace(/\{\s*\{\s*APPNAME\s*\}\s*\}/g, dirname);
        		fs.writeFileSync(file, content, 'utf-8');
        	})
        	
            console.log(chalk.green(`√ 目录生成完毕`));
        	exit(0);
        });
    })
};
