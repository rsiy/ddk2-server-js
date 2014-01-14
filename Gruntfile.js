"use strict";

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON("package.json"),
		
		filename: function (settings) {
			settings = grunt.util._.defaults(settings || {}, { minify: false, flag: "" }); 
			return "<%= pkg.name %>" + (settings.flag ? "-" + settings.flag : "") + (settings.minify ? ".min" : "") + ".<%= pkg.extension %>";
		},

		// Task configuration.
		clean: {
			files: ["dist"]
		},
		
		concat: {
			options: {
				stripBanners: false,
				separator: ";" + grunt.util.linefeed,
				banner: ""
			},
			dist: {
				src: ["js/*.js"],
				dest: "dist/<%= filename() %>"			
			}
		},

		jshint: {
			all: ["js/101-ddk-global-object.js"]
		},
		
		uglify: {
			options: {
				banner: "var DDK_SERVERJSMIN = true;\n\n"			
			},
			dist: {
				src: "<%= concat.dist.dest %>",
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
