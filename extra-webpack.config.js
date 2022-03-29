const webpack = require('webpack');

module.exports = {
   plugins: [
      new webpack.DefinePlugin({
         'process.env': {
            PUSHER_API_KEY: JSON.stringify(process.env.PUSHER_API_KEY)
         }
      })
   ]
};
