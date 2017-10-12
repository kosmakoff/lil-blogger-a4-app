const merge = require('webpack-merge');
const common = require('./webpack.common');
const helpers = require('./helpers');
const { AotPlugin } = require('@ngtools/webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        new AotPlugin({
            "mainPath": "main.ts",
            "replaceExport": false,
            "hostReplacementPaths": {
              "environments/environment.ts": "environments/environment.ts"
            },
            "exclude": [],
            "tsConfigPath": "tsconfig.aot.json",
            "skipCodeGeneration": true,
            "entryModule": helpers.root('src/app/app.module#AppModule')
          }),
        new UglifyJSPlugin({
            beautify: false,
            comments: false,
            compress: {
                screw_ie8: true,
                warnings: false
            },
            mangle: {
                keep_fnames: true,
                screw_ie8: true
            }
        })
    ]
});
