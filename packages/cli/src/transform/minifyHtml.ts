const {minify} = require('html-minifier-terser');

// from here --- https://github.com/jantimon/html-webpack-plugin/blob/fdef1b4e7847413e67f7826120073ea282bfe927/index.js#L914

const minifyOptions = {
    // https://www.npmjs.com/package/html-minifier-terser#options-quick-reference
    collapseWhitespace: true,
    keepClosingSlash: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
};

export const minifyHtml = async (html: string) => {
    html = await minify(html, minifyOptions);
    return html;
};