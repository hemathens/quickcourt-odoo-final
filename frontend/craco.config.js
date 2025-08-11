// Load configuration from environment or config file
const path = require('path');

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === 'true',
};

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      
      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });
        
        // Disable watch mode
        // # ignored is READONLY, DO NOT EDIT THIS
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        // IMPORTANT: ignored list can only be appended, but not overridden
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }
      
      // Force devServer client websocket to connect to the same origin/port (3000)
      if (!webpackConfig.devServer) webpackConfig.devServer = {};
      webpackConfig.devServer.client = {
        ...webpackConfig.devServer.client,
        webSocketURL: {
          hostname: 'localhost',
          port: 3000,
          protocol: 'ws',
        },
      };

      return webpackConfig;
    },
  },
};