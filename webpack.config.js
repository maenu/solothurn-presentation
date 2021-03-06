const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopywebpackPlugin = require('copy-webpack-plugin')

// The path to the Cesium source code
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

module.exports = [{
	context: __dirname,
	entry: {
		app: './src/index.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		// Needed to compile multiline strings in Cesium
		sourcePrefix: ''
	},
	amd: {
		// Enable webpack-friendly use of require in Cesium
		toUrlUndefined: true
	},
	node: {
		// Resolve node module use of fs
		fs: 'empty'
	},
	resolve: {
		modules: [
			'./node_modules'
		],
		alias: {
			'cesium': path.resolve(__dirname, cesiumSource),
			'ol': 'openlayers/src/ol',
			'olcs': 'ol-cesium/src/olcs',
			'goog': 'ol-cesium/src/goog'
		}
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}, {
			test: /\.(png|gif|jpg|jpeg|svg|xml|json|pdf|swf)$/,
			use: ['url-loader']
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new CopywebpackPlugin([{
			from: path.join(__dirname, 'src/assets'),
			to: 'assets'
		}]),
		// Copy Cesium Assets, Widgets, and Workers to a static directory
		new CopywebpackPlugin([{
			from: path.join(cesiumSource, cesiumWorkers),
			to: 'Workers'
		}]),
		new CopywebpackPlugin([{
			from: path.join(cesiumSource, 'Assets'),
			to: 'Assets'
		}]),
		new CopywebpackPlugin([{
			from: path.join(cesiumSource, 'Widgets'),
			to: 'Widgets'
		}]),
		new webpack.DefinePlugin({
			// Define relative base path in cesium for loading assets
			CESIUM_BASE_URL: JSON.stringify('')
		})
	],
	// development server options
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist')
	}
}]
