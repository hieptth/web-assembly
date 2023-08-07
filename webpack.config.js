const path = require("path");
const fs = require("fs");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    bundle: [path.resolve(__dirname, "./src/index.js")],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][contenthash].js",
    clean: true,
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "javascript/auto" /** this disables webpack default handling of wasm */,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              // publicPath: path.resolve(__dirname, 'dist'),
            },
          },
        ],
      },
      {
        test: /\.worker\.js/,
        use: {
          loader: "worker-loader",
          // options: { fallback: true },
        },
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.ejs",
      filename: "./index.html",
      title: "WebAssembly",
      custom: `<script src="native.js"></script>`,
      hash: false,
      inject: true,
      minify: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "wasm/native.wasm",
          to: `[name][ext]`,
        },
        { from: "wasm/native.js", to: `[name][ext]` },
      ],
    }),
  ],
  target: "web",
};
