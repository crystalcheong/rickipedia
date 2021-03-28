module.exports = {
    //-- SITE SETTINGS -----
    author: '@crystalcheong',
    siteTitle: 'Rick and Morty Wiki',
    siteShortTitle: 'Rickipedia',
    siteDescription: 'A Rick and Morty character wiki',
    siteUrl:
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/'
            : 'https://rickipedia.vercel.app/',
    siteLanguage: 'en_US',
    siteIcon: '/icons/favicon.ico',
    basePrefix: process.env.NEXT_PUBLIC_BASE_PATH || ''
};
