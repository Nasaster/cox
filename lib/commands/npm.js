var path = require('path');
var repeater = require('../repeater');
var _ = require('lodash');

module.exports = function(args){
    var subCommand = typeof args === 'string'? args : args._[1];

    var command = function(moduleName, moduleRepo, done){
        console.info(('cox is running npm ' + subCommand + ' for the ' + moduleName + ' module').action );
        var pkg = require( path.join(process.cwd(), 'modules', moduleName, 'package.json'));
        var deps = _.merge(pkg.dependencies, pkg.devDependencies);
        if(Object.keys(deps).length === 0){
            console.info((moduleName + ' has no dependencies').warning);
            return done();
        }

        cd('modules/'+moduleName);
        
        if (exec('npm ' + subCommand).code !== 0) {
            console.error( ('Error: npm install didn\'t run for ' + moduleName).error);
            process.exit(1);
        }
        console.info( ('successfully ran npm ' + subCommand + ' on module ' + moduleName).success);
        cd('../..');
        done();
    };

    console.info('starting task npm ' + subCommand);
    repeater(command, function(){
        //run for the command in the main project folder
        console.info( ('running npm ' + subCommand + ' in ' + process.cwd() ).action);
        if (exec('npm ' + subCommand).code !== 0) {
            console.error( ('Error: npm install didn\'t run for ' + moduleName).error);
            process.exit(1);
        }
        console.log( ('cox has successfully run the task npm ' + subCommand).success);
    });
};