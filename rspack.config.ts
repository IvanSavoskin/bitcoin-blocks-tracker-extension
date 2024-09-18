import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";

import rspack from "@rspack/core";
import { SwcLoaderOptions } from "@rspack/core/dist/builtin-loader/swc/types";

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
    publicLocales: path.join(__dirname, "./public/_locales"),
    dist: path.join(__dirname, "./dist"),
    distJs: path.join(__dirname, "./dist/js"),
    distIcons: path.join(__dirname, "./dist/icons"),
    nodeModules: path.resolve(__dirname, "./node_modules")
};

const rspack_ = (_: any, argv: any) => {
    const isProduction = argv.mode === "production";

    return {
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? false : "source-map",
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
            runtimeChunk: false,
            moduleIds: "deterministic",
            minimize: true
        },
        module: {
            rules: [
                {
                    test: /\.tsx$/,
                    exclude: [PATHS.nodeModules],
                    use: {
                        loader: "builtin:swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    tsx: true
                                },
                                transform: {
                                    react: {
                                        runtime: "automatic"
                                    }
                                }
                            }
                        } satisfies SwcLoaderOptions
                    },
                    type: "javascript/auto"
                },
                {
                    test: /\.ts$/,
                    exclude: [PATHS.nodeModules],
                    loader: "builtin:swc-loader",
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript"
                            }
                        }
                    } satisfies SwcLoaderOptions,
                    type: "javascript/auto"
                },
                {
                    test: /\.scss$/,
                    exclude: [PATHS.nodeModules],
                    use: [
                        rspack.CssExtractRspackPlugin.loader,
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
                            loader: "builtin:lightningcss-loader",
                            options: {
                                targets: "chrome >= 110"
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: !isProduction,
                                api: "modern-compiler",
                                implementation: require.resolve("sass-embedded")
                            }
                        }
                    ]
                },
                {
                    test: /\.(m4a|wav|png)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "../static/assets/[name]-[contenthash][ext]"
                    }
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.tsx?$/,
                    use: [{ loader: "@svgr/webpack" }]
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
                "@popupUtils": path.resolve(__dirname, "src/popup/utils"),
                "@popupCoreStyles": path.resolve(__dirname, "src/popup/styles"),
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
            new rspack.ProgressPlugin(),
            new rspack.CopyRspackPlugin({
                patterns: [
                    {
                        from: `${PATHS.publicFiles}/`,
                        to: "../"
                    },
                    {
                        from: `${PATHS.publicIcons}/`,
                        to: "../icons/"
                    },
                    {
                        from: `${PATHS.publicLocales}/`,
                        to: "../_locales/"
                    }
                ]
            }),
            isProduction && new ForkTsCheckerWebpackPlugin({ typescript: { mode: "write-references" } }),
            new rspack.HtmlRspackPlugin({
                template: `${PATHS.publicHtml}/popup.html`,
                filename: "../popup.html",
                excludeChunks: ["offscreen", "background"]
            }),
            new rspack.HtmlRspackPlugin({
                template: `${PATHS.publicHtml}/offScreen.html`,
                filename: "../offScreen.html",
                excludeChunks: ["popup", "background"]
            }),
            new rspack.CssExtractRspackPlugin({
                filename: "../css/[name].css",
                chunkFilename: "../css/[name].css"
            })
        ].filter(Boolean)
    };
};
module.exports = rspack_;
