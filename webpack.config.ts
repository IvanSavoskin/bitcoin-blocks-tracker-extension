import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";

export const PATHS = {
    src: path.join(__dirname, "./src"),
    srcPopup: path.join(__dirname, "./src/popup"),
    srcOffScreen: path.join(__dirname, "./src/offScreen"),
    srcBackground: path.join(__dirname, "./src/background"),
    public: path.join(__dirname, "./public"),
    publicHtml: path.join(__dirname, "./public/html"),
    publicFiles: path.join(__dirname, "./public/files"),
    publicIcons: path.join(__dirname, "./public/icons"),
    publicImages: path.join(__dirname, "./public/images"),
    dist: path.join(__dirname, "./dist"),
    distJs: path.join(__dirname, "./dist/js"),
    distIcons: path.join(__dirname, "./dist/icons"),
    nodeModules: path.resolve(__dirname, "./node_modules")
};

const webpack_ = (_: any, argv: any) => {
    const isProduction = argv.mode === "production";

    return {
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "cheap-source-map" : "source-map",
        context: __dirname,
        entry: {
            popup: path.join(PATHS.srcPopup, "index.tsx"),
            background: path.join(PATHS.srcBackground, "index.ts"),
            offscreen: path.join(PATHS.srcOffScreen, "index.ts")
        },
        output: {
            path: PATHS.distJs,
            filename: "[name].js"
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendors",
                        test: /node_modules\/(?!react)(?!react-dom)/,
                        chunks: "all",
                        enforce: true,
                        maxSize: 249_856
                    }
                }
            },
            runtimeChunk: false,
            moduleIds: "deterministic",
            minimize: true
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: [PATHS.nodeModules],
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                compilerOptions: {
                                    module: "ESNext",
                                    removeComments: false
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: [PATHS.nodeModules],
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                import: true,
                                sourceMap: !isProduction,
                                modules: {
                                    namedExport: false,
                                    auto: true,
                                    localIdentName: isProduction ? "[hash:base64]" : "[path][name]__[local]",
                                    exportLocalsConvention: "camelCaseOnly"
                                }
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                postcssOptions: {
                                    config: path.resolve(__dirname, "postcss.config.js")
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: !isProduction
                            }
                        }
                    ]
                },
                {
                    test: /\.(m4a|svg|wav|png)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "../static/assets/[name]-[contenthash][ext]"
                    }
                }
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css", ".m4a", ".wav", ".svg", ".png"],
            alias: {
                "@settings": path.resolve(__dirname, "src/popup/components/Settings"),
                "@main": path.resolve(__dirname, "src/popup/components/Main"),
                "@context": path.resolve(__dirname, "src/popup/context"),
                "@parts": path.resolve(__dirname, "src/popup/parts"),
                "@static": path.resolve(__dirname, "src/static"),
                "@coreUtils": path.resolve(__dirname, "src/utils"),
                "@hooks": path.resolve(__dirname, "src/utils/hooks"),
                "@models": path.resolve(__dirname, "src/models")
            }
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: []
            }),
            new webpack.ProgressPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: `${PATHS.publicFiles}/`,
                        to: "../"
                    },
                    {
                        from: `${PATHS.publicIcons}/`,
                        to: "../icons/"
                    }
                ]
            }),
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: `${PATHS.publicHtml}/popup.html`,
                filename: "../popup.html",
                excludeChunks: ["offscreen", "background"]
            }),
            new HtmlWebpackPlugin({
                template: `${PATHS.publicHtml}/offScreen.html`,
                filename: "../offScreen.html",
                excludeChunks: ["popup", "background"]
            }),
            new MiniCssExtractPlugin({
                filename: "../css/[name].css",
                chunkFilename: "../css/[name].css"
            })
        ]
    };
};
module.exports = webpack_;
