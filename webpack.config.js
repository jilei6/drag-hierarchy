const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssNormalize = require("postcss-normalize");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const webpackAliases = {
  // https://github.com/facebook/react/issues/13991
  react: resolveApp("./node_modules/react"),
};
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const shouldUseSourceMap = false;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            ident: "postcss",
            plugins: [
              "postcss-flexbugs-fixes",
              // https://github.com/postcss/autoprefixer/issues/1406
              [
                "postcss-preset-env",
                {
                  autoprefixer: {
                    grid: true,
                  },
                  stage: 3,
                },
              ],
              // 根据browserslist适配
              postcssNormalize(),
            ],
          },

          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: Object.assign(
          preProcessor === "sass-loader"
            ? { implementation: require("sass") }
            : {},
          preProcessor === "less-loader"
            ? { modifyVars: theme, javascriptEnabled: true }
            : {},
          {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          }
        ),
      });
    }

    return loaders;
  };
  return {
    mode: "development",
    entry: "./src/index.js",
    resolve: {
      // 找不到直接去node_modules中查找，不一层层向上了
      modules: ["node_modules", resolveApp("./node_modules")],
      alias: {
        ...(webpackAliases || {}),
      },
      extensions: ["js", "jsx", "ts", "tsx", "json"].map((ext) => `.${ext}`),
      plugins: [
        // 防止引入src目录之外的文件导致不可预期的结果
        // new ModuleScopePlugin(paths.appSrc, [
        //   paths.appPackageJson,
        // ]),
      ],
    },
    devtool: 'source-map',
    // devtool: isEnvProduction
    //   ? shouldUseSourceMap
    //     ? "source-map"
    //     : false
    //   : isEnvDevelopment && "cheap-module-source-map",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "./dist"),
      //   publicPath: '../'
    },
    devServer: {
      open: true,
      compress: true,
      hot: true,

      client: {
        overlay: true,
      },
      port: 8080,
      static: {
        directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
      },
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // 压缩js
        new TerserPlugin({
          terserOptions: {
            compress: {
              // Uglify违反了有效的代码的问题而被禁用
              warnings: false,
              // Terser破坏有效代码而被禁用：
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // output: {
            //   // comments: false,
            //   ascii_only: true,
            // },
            format: {
              // 删除代码注释
              comments: false,
            },
            sourceMap: shouldUseSourceMap,
          },
        }),
        // 压缩css
        new CssMinimizerPlugin({
          test: /\.foo\.css$/i,
        }),
      ],
      splitChunks: Object.assign(
        {
          chunks: "all",
          name: isEnvProduction ? "isEnvDevelopment" : "app",
        },
        isEnvProduction
          ? {
              automaticNameDelimiter: "~",
              minSize: 30000,
              maxAsyncRequests: 3,
              maxInitialRequests: 3,
              hidePathInfo: true,
              cacheGroups: {
                react: {
                  // 项目基本框架等
                  test: /[\\/](react|react-dom|react-dom-router)[\\/]/,
                  priority: 0,
                  name: "react",
                },
                antd: {
                  name: "antd",
                  test: /[\\/]node_modules[\\/]antd[\\/]/,
                  priority: -5,
                },
                vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "vendors",
                  priority: -8, // 优先级
                  maxSize: 1000000,
                },
                default: {
                  minChunks: 2,
                  priority: -15,
                  maxSize: 1000,
                },
                styles: {
                  name: "styles",
                  type: "css/mini-extract",
                  chunks: "all",
                  enforce: true,
                },
              },
            }
          : {}
      ),
      emitOnErrors: true, // 关键错误生成的代码中，并会在运行时报错
      removeEmptyChunks: false, // 移除空chunk
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    module: {
      rules: [
        // 添加其他需要的loader规则
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              // 使用Dart Sass
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
              // modules: isEnvProduction ? {
              //   auto: (resourcePath) => !resourcePath.includes("app\\styles\\app"),
              //   namedExport: true,
              //   localIdentName: "[hash:base64:5]",
              // } : undefined,
            },
            "sass-loader"
          ),
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
        PUBLIC_URL: "/".slice(0, -1),
    }),
      isEnvDevelopment && new ReactRefreshWebpackPlugin(),
      isEnvDevelopment && new BundleAnalyzerPlugin({ analyzerPort: "auto" }),
      new HtmlWebpackPlugin({
        title: "可拖拽视系图",
        template: "./public/index.html",
      }),

      // 模块热跟新
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      // 检查输入路径大小写问题
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
    ].filter(Boolean),
  };
};
