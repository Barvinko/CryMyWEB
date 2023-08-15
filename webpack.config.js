const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'devolopment';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        port: 8080,
        open: true,
        //CAN PROBLEM
        hot: true,
    },

    // from get files for WebPack
    entry: path.resolve(__dirname, 'src', 'index.js'),
    //to files past WebPack
    output: {
        path: path.resolve(__dirname,'dist'),
        clean: true,
        filename: 'index.[contenthash].js',
        assetModuleFilename: 'assets/[hash][ext]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'src','index.html')
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new MiniCssExtractPlugin({
            filename: 'index.[contenthash].css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            }
                        }
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator:{
                    filename: 'fontas/[name].[ext]'
                }
            },
            {
                test: /\.(png|jpe&g|webp|svg|gif)$/i,
                use: [
                    {
                        loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.65, 0.9],
                            speed: 4,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        webp: {
                            quality: 75,
                        },
                        },
                    }
                ],
                type: 'asset/resource',
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer")
        },
    },
    optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ],
    },
}