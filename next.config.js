const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const webpack = require('webpack');

module.exports = withPWA({
    images: {
        domains: ['rickandmortyapi.com']
    },

    pwa: {
        disable: process.env.NODE_ENV === 'development',
        dest: 'public',
        register: true,
        scope: process.env.NEXT_PUBLIC_BASE_PATH || '/',
        sw: '/sw.js',
        runtimeCaching
    },

    webpack: (config, { isServer }) => {
        // (https://github.com/vercel/next.js/issues/7755) Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.node = {
                fs: 'empty'
            };
        }

        config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

        return config;
    }
});
