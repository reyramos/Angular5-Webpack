/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');

/**
 * Webpack Plugins
 *
 * problem with copy-webpack-plugin
 */
const AssetsPlugin = require('assets-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
//const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ngcWebpack = require('ngc-webpack');
const ngtools = require('@ngtools/webpack');
const AngularCompilerPlugin = ngtools.AngularCompilerPlugin;

/*
 * Webpack Constants
 */
/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const AOT = (process.env.BUILD_AOT || helpers.hasNpmFlag('aot')) ? true : false;
const METADATA = {
  title: 'freshtxt',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  HMR: HMR,
  AOT: AOT
};


/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  let isProd = options.env === 'production';

  return {
    /*
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    //cache: false,

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {

      'polyfills': './src/polyfills.browser.ts',
      'main': AOT ? './src/main.browser.aot.ts' : './src/main.browser.ts',
    },
    /*
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /*
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.js', '.json'],
      modules: [
        helpers.root('src'),
        helpers.root('node_modules'),
        helpers.root('custom_modules')
      ],
      alias: {
        app: 'src',
        // jquery: 'jquery/dist/jquery.min.js',
        // Rx: helpers.root('node_modules', 'rxjs', 'Rx.js'),
        // 'jquery-ui': helpers.root('node_modules', 'jquery-ui', 'ui'),
        // moment: 'moment/moment',
      }
    },
    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [
        {
          test: !isProd ? /(?:\.ngfactory\.js|\.ngstyle\.js)$/ : /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
          // test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
          use: [
            {
              loader: '@ngtools/webpack',
              options: {
                sourcemap: isProd
              }
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]

        },
        /*
          * Json loader support for *.json files.
          *
          * See: https://github.com/webpack/json-loader
          */
        {
          test: /\.json$/,
          use: 'json-loader'
        },

        /*
         * to string and css loader support for *.css files (from Angular layout)
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          exclude: [helpers.root('src', 'styles')]
        },
        {
          test: /\.less$/,
          use: ['to-string-loader', 'css-loader', 'postcss-loader', 'less-loader'],
          exclude: [helpers.root('src', 'styles')]
        },
        /*
         * to string and sass loader support for *.scss files (from Angular layout)
         * Returns compiled css content as string
         *
         */
        {
          test: /\.scss$/,
          use: ['to-string-loader', 'css-loader', 'sass-loader'],
          exclude: [helpers.root('src', 'styles')]
        },
        /* Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },

        /*
         * File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },

        // /* File loader for supporting fonts, for example, in CSS files.
        // */
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "http://localhost:3000/", // Development Server
              }
            }
          ]
        },

        // // the url-loader uses DataUrls.
        // // the file-loader emits files.
        // {
        //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   use: [
        //     {
        //       loader: "url-loader",
        //       options: {
        //         limit: 10000,
        //         mimetype: 'application/font-woff',
        //       }
        //     }
        //   ]
        // },
        //
        // {
        //   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   use: [
        //     {
        //       loader: "file-loader",
        //       options: {
        //         publicPath: "http://localhost:3000/", // Development Server
        //       }
        //     }
        //   ]
        // },

        {test: /\.worker/, use: "webworker-loader"}

      ],

    },

    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      // Remove all locale files in moment with the IgnorePlugin if you don't need them
      // new IgnorePlugin(/^\.\/locale$/, /moment$/),

      /**
       * Plugin: ForkCheckerPlugin
       * Description: Do type checking in a separate process, so webpack doesn't need to wait.
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      new CheckerPlugin(),
      /**
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      /**
       * This enables tree shaking of the vendor modules
       */
      // new CommonsChunkPlugin({
      //   name: 'vendor',
      //   chunks: ['main'],
      //   minChunks: module => /node_modules/.test(module.resource)
      // }),
      /**
       * Specify the correct order the scripts will be injected in
       */
      // new CommonsChunkPlugin({
      //   name: ['polyfills', 'vendor'].reverse()
      // }),
      // new CommonsChunkPlugin({
      //   name: ['manifest'],
      //   minChunks: Infinity,
      // }),
      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('src'), // location of your src
        {
          /**
           * Your Angular Async Route paths relative to this root directory
           */
        }
      ),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin([
          {from: 'src/assets', to: 'assets'},
          {from: 'src/meta'}
        ],
        isProd ? {ignore: ['mock-data/**/*']} : undefined
      ),

      /*
		* Plugin: PreloadWebpackPlugin
		* Description: Preload is a web standard aimed at improving
		* performance and granular loading of resources.
		*
		* See: https://github.com/GoogleChrome/preload-webpack-plugin
		*/
      //new PreloadWebpackPlugin({
      //  rel: 'preload',
      //  as: 'script',
      //  include: ['polyfills', 'vendor', 'main'].reverse(),
      //  fileBlacklist: ['.css', '.map']
      //}),
      //new PreloadWebpackPlugin({
      //  rel: 'prefetch',
      //  as: 'script',
      //  include: 'asyncChunks'
      //}),
      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: function (a, b) {
          const entryPoints = ["inline", "polyfills", "sw-register", "styles", "vendor", "main"];
          return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
        },
        metadata: METADATA,
        inject: 'body'
      }),

      /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /polyfills|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/]
      }),

      /*
       * Plugin: HtmlElementsPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({}),

      new ngcWebpack.NgcWebpackPlugin({
        /**
         * If false the plugin is a ghost, it will not perform any action.
         * This property can be used to trigger AOT on/off depending on your build target (prod, staging etc...)
         *
         * The state can not change after initializing the plugin.
         * @default true
         */
        AOT: true,
        tsConfigPath: helpers.root('tsconfig.json'),
        mainPath: AOT ? './src/main.browser.aot.ts' : './src/main.browser.ts'
      }),

      /**
       * Plugin: InlineManifestWebpackPlugin
       * Inline Webpack's manifest.js in index.html
       *
       * https://github.com/szrenwei/inline-manifest-webpack-plugin
       */
      new InlineManifestWebpackPlugin(),

      new ProvidePlugin({
        // jQuery: 'jquery',
        // $: ['jquery', 'jQueryUI'],
        // jquery: 'jquery',
        // 'window.jQuery': 'jquery'
      })

    ],

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
};
