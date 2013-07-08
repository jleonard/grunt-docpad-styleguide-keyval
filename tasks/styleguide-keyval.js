/*
 * grunt-docpad-styleguide-keyval
 * https://github.com/jleonard/grunt-docpad-styleguide-keyval
 *
 * Copyright (c) 2013 John Leonard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task
  // creation: https://github.com/gruntjs/grunt/blob/devel/docs/toc.md

  grunt.registerMultiTask('styleguide-keyval', 'Your task description goes here.', function() {

    var options = this.options({
      dest: ''
    });

    this.files.forEach(function(fileObj){
      var files = grunt.file.expand({nonull: true}, fileObj.src);
      var dest = options.dest;
      var src = files.map(function(filepath){
        if (!grunt.file.exists(filepath)) {
          
        }else{
          var file = grunt.file.read(filepath);
          file = removeComments(file);
          file = file.replace(/ /g,"").replace(/\t/g,"").replace(/\n/g,"");
          var arr = file.split(";");
          var len = arr.length;
          
          var html = "<table class='table table-condensed table-striped'>";
          for (var i = 0; i < len -1; i++) {
            var key_val = arr[i].split(":");
            grunt.log.write(key_val[0]);
            html += makeChip(key_val);
          }
          html += "</table>";
          grunt.file.write(dest,html);
        }
      });

    });

    function makeChip(arr){
      var val = arr[1];
      if(val.indexOf("@") == 0 || val.indexOf("(") == 0){
        return "";
      }
      var html = "<tr><td>"+arr[0]+"</td>";
      html += "<td>"+val+"</td></tr>";
      return html;
    }

    function removeComments(str) {
 
        var uid = '_' + +new Date(),
            primatives = [],
            primIndex = 0;
     
        return (
            str
            /* Remove strings */
            .replace(/(['"])(\\\1|.)+?\1/g, function(match){
                primatives[primIndex] = match;
                return (uid + '') + primIndex++;
            })
     
            /* Remove Regexes */
            .replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
                primatives[primIndex] = $2;
                return $1 + (uid + '') + primIndex++;
            })
     
            /*
            - Remove single-line comments that contain would-be multi-line delimiters
                E.g. // Comment /* <--
            - Remove multi-line comments that contain would be single-line delimiters
                E.g. /* // <-- 
           */
            .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')
     
            /*
            Remove single and multi-line comments,
            no consideration of inner-contents
           */
            .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')
     
            /*
            Remove multi-line comments that have a replaced ending (string/regex)
            Greedy, so no inner strings/regexes will stop it.
           */
            .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')
     
            /* Bring back strings & regexes */
            .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
                return primatives[n];
            })
        );
     
    }

  });

}
