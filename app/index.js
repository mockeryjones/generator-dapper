'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string')


var DapperGenerator = module.exports = function DapperGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DapperGenerator, yeoman.generators.Base);

DapperGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'projectName',
    message: 'What Will You Call This Project?',
  }];

  var webify = function(string) {
    return _s.camelize(string);
  }

  var hyphenCasify = function(string) {

  }

  this.prompt(prompts, function (props) {
    this.projectName = _s.camelize(props.projectName);
    this.projectFile = _s.dasherize(props.projectName);


    cb();
  }.bind(this));
};

DapperGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/templates');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/controllers');
  this.mkdir('app/scripts/directives');
  this.mkdir('app/scripts/filters');
  this.mkdir('app/scripts/services');
  this.mkdir('app/styles');
  
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('_Gruntfile.js', 'Gruntfile.js');


  this.copy('_app.js', 'app/scripts/app.js');
  this.copy('_index_controllers.js', 'app/scripts/controllers/index.js');
  this.copy('_index_directives.js', 'app/scripts/directives/index.js');
  this.copy('_index_filters.js', 'app/scripts/filters/index.js');
  this.copy('_index_services.js', 'app/scripts/services/index.js');
};

DapperGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
