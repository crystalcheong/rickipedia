import React from 'react';

const config = require('@config');

const SEO = () => (
    <>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="description" content={config.siteDescription} />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content={config.siteTitle} />
        <meta name="og:description" property="og:description" content={config.siteDescription} />
        <meta property="og:site_name" content={config.siteTitle} />
        <meta property="og:url" content={`${config.siteUrl}`} />
        <meta property="og:image" content={`${config.basePrefix + config.siteIcon}`} />

        <meta name="twitter:card" content={config.siteShortTitle} />
        <meta name="twitter:title" content={config.siteTitle} />
        <meta name="twitter:description" content={config.siteDescription} />
        <meta name="twitter:site" content={config.author} />
        <meta name="twitter:creator" content={config.author} />
        <meta name="twitter:image" content={`${config.basePrefix + config.siteIcon}`} />

        <link rel="canonical" href={`${config.siteUrl}`} />
        <link rel="icon" href={config.basePrefix + config.siteIcon} />
        <link rel="shortcut icon" href={config.basePrefix + config.siteIcon} />

        <meta name="application-name" content={config.siteTitle} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={config.siteTitle} />
        <meta name="description" content={config.siteDescription} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFFFFF" />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${config.basePrefix}/icons/apple-touch-icon.png`}
        />
        <link rel="manifest" href={`${config.basePrefix}/manifest.json`} />
    </>
);

export default SEO;
