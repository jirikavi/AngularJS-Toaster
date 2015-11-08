module.exports = function(config) {

	require("./karma.conf")(config);

	config.autoWatch = false;

	config.preprocessors = {
		'toaster.js': ['coverage']
	};
	
	config.coverageReporter = {
      type: 'html',
      dir: 'coverage/'
    };

	config.singleRun = true;

	config.reporters.push('coverage');
	config.plugins.push('karma-coverage');


	config.set(config);
};