/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const fs = require('fs');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const devConfig = require('./webpack.dev.js'); // the settings that are common to prod and dev
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(devConfig({env: ENV}).metadata, {
  REVISION: "",
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
});


/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  return webpackMerge(devConfig({env: ENV, USE_MOCKDATA: false}), {


      plugins: [

        /**
         * Plugin: DefinePlugin
         * Description: Define free variables.
         * Useful for having development builds with debug logging or adding global constants.
         *
         * Environment helpers
         *
         * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
         */
        // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
        new DefinePlugin({
          'ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
          'BUILD_ON': JSON.stringify(new Date().toLocaleString()),
          'REVISION': JSON.stringify(METADATA.REVISION),
          'USE_MOCKDATA': false,
          'process.env.ENV': JSON.stringify(METADATA.ENV),
          'process.env.NODE_ENV': JSON.stringify(METADATA.NODE_ENV),
          'process.env.HMR': JSON.stringify(METADATA.HMR)
        }),
      ],
      /**
       * Webpack Development Server configuration
       * Description: The webpack-dev-server is a little node.js Express server.
       * The server emits information about the compilation state to the client,
       * which reacts to those events.
       *
       * See: https://webpack.github.io/docs/webpack-dev-server.html
       */
      devServer: {
        port: METADATA.port,
        host: METADATA.host,
        historyApiFallback: true,
        clientLogLevel: "none",
        watchContentBase: true,
        watchOptions: {
          // if you're using Docker you may need this
          // aggregateTimeout: 300,
          poll: 1000,
          ignored: /node_modules/
        },
        noInfo: true,
        quiet: true,
        // stats: "errors-only",
        // proxy: {
        //   "/api/**": {
        //     // target: "http://192.168.1.19:9998",
        //     // target: "http://localhost:9998",
        //     // pathRewrite: {"^/api": ""}
        //     // onProxyReq: function (proxyReq, req, res) {
        //     //
        //     // }
        //   }
        // }
      }
    }
  );
};
