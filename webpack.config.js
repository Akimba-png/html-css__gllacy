const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './source/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'source'),
    },
    port: 5000,
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          sources: {
            urlFilter: (_attribute, value, _resourcePath) => {
              if (/\.svg$/.test(value)) {
                return false;
              }
              return true;
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (url) => {
                  if (/\.svg/.test(url)) {
                    return false;
                  }
                  return true;
                },
              }
            },
          }
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (url) => {
                  if (/\.svg/.test(url)) {
                    return false;
                  }
                  return true;
                },
              }
            },
          }, 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(png|jpe?g|webp|gif)/,
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
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              }
            }
          },
        ],
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash][ext]',
       },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './source/index.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new SVGSpritemapPlugin('./source/img/icons/**/*.svg', {
      output: {
        filename: 'img/icons/sprite.svg',
        svg: {
          sizes: false,
        },
        svgo: true,
      },
      sprite: {
        prefix: false,
        generate: {
          use: true,
          symbol: true,
          view: '-fragment',
        },
      },
      styles: {
        format: 'fragment',
      }
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
