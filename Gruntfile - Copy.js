"use strict";

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON("package.json"),
		
		banner: function (filename, status) {
			return "/* <%= pkg.title %>\n" +
			" * Filename: " + filename + "\n" +
			" * Version: <%= pkg.version %>\n" +
			" * Date: <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
			" * Copyright (c) <%= grunt.template.today('yyyy') %> PureShare, Inc.\n" +
			" */\n\n" +
			status;
		},
		
		filename: function (settings) {
			settings = grunt.util._.defaults(settings || {}, { minify: false, flag: "" }); 
			return "<%= pkg.name %>" + (settings.flag ? "-" + settings.flag : "") + (settings.minify ? ".min" : "") + ".<%= pkg.extension %>";
		},
		
		status: function (settings) {
			settings = grunt.util._.defaults(settings || {}, { minify: false }); 
			return "DDK_SERVERJSMIN = " + (settings.minify ? "true" : "false") + ";\n\n";
		},

		// Task configuration.
		clean: {
			files: ["dist"]
		},
		
		concat: {
			options: {
				stripBanners: false,
				separator: ";" + grunt.util.linefeed
			},
			standard: {
				banner: "<%= banner(filename(), status()) %>",
				src: ["js/*.js"], //
				dest: "dist/<%= filename() %>"
			}
		},

		jshint: {
			all: ["js/101-ddk-global-object.js"]
		},
		
		uglify: {
			standard: {
				banner: "<%= banner(filename({ minify: true }), status({ minify: true })) %>",
				src: "<%= concat.standard.dest %>",
				dest: "dist/<%= filename({ minify: true }) %>"
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	//grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");

	// Default task.
	grunt.registerTask("default", [/*"qunit",*/ /*"jshint,"*/ "clean", "concat", "uglify"]);

};
