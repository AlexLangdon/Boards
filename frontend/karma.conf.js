// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon-chai', '@angular/cli'],
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-sinon-chai'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-istanbul-threshold'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-phantomjs-launcher')
    ],
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      mocha: {
        timeout : 8000
      }
    },
    files: [
      { pattern: './src/test.ts', watched: false },
      { pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css', included: true, watched: true },
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul', 'istanbul-threshold', 'mocha']
      : ['progress', 'mocha'],
    istanbulThresholdReporter: {
      src: 'coverage/coverage-final.json',
      basePath: path.resolve(__dirname, './src'),
      reporters: ['text'],
      excludes: [ // will exclude .ts files in `path/to/source/some/module` 
      ],
      thresholds: {
        global: {
          statements: 90,
          branches: 90,
          lines: 70,
          functions: 90,
        },
        each: {
          statements: 80,
          branches: 80,
          lines: 60,
          functions: 80,
        },
      }
    },    
    mochaReporter: {
      showDiff: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
