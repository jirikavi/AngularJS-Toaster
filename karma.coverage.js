module.exports = function(config) {

	require("./karma.conf")(config);

	config.autoWatch = false;

	config.preprocessors = {
		'toaster.js': ['coverage']
	};
	
	config.coverageReporter = {
      dir: 'coverage/',
	  reporters: [
		  { type: 'html', subdir: 'html-report' }
	  ]
    };

	config.singleRun = true;

	config.reporters.push('coverage');
	config.plugins.push('karma-coverage');

	config.customLaunchers = {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    };
	
	if (process.env.TRAVIS) {
    	config.browsers = ['Chrome_travis_ci'];
		config.coverageReporter.reporters.push({
			type: 'lcov', subdir: 'lcov-report'
		});
	}

	config.set(config);
};