#! /usr/bin/env node --harmony

"use strict"

const program = require('commander');
const config = require('../package.json');
const makeTemplate = require('../command/init'); 

// 定义使用方法
program.usage('<command> <option>');

// 定义版本
program.version(config.version);

// 注册初始化指令
program
	.command('init')
	.description('使用模板初始化项目')
  	.action((arg)=>{
  		// 若 cli 显式传入参数(如 init directory1) 则 arg 返回当前参数(directory1) 
  		// 否则 arg 返回 command 对象
  		var dir = typeof arg === 'object' ? '' : arg;
  		makeTemplate(dir);
  	})

// 解析命令行参数
program.parse(process.argv);

// 显示帮助
if(!program.args.length){
	program.help();
}

