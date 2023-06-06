const webpack = require('webpack');

module.exports = {
   plugins: [
      new webpack.DefinePlugin({
         'process.env': {
            IMAGE_BASE_URL: JSON.stringify(process.env.IMAGE_BASE_URL),
            API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
            PUSHER_API_KEY: JSON.stringify(process.env.PUSHER_API_KEY)
         }
      })
   ]
};
