const menu = require("./utils-build/menu.js");
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const BASE_PATH = "/css-battle-showcase";
module.exports = (phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        basePath: BASE_PATH,
        env: {
            basePath: BASE_PATH,
            menu: menu.get('_battles'),
        },
        webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
            // Note: we provide webpack above so you should not `require` it
            // Perform customizations to webpack config
            config.plugins.push(
                new CopyPlugin({
                    patterns: [
                        {
                            from: './_battles/**/*.html',
                            to({ context, absoluteFilename }) {
                                // remove _battle, and move to public/solutions
                                const pth = path.relative(context, absoluteFilename)
                                const { root, dir, base, ext } = path.parse(pth);
                                const folders = dir.split(path.sep);
                                folders.shift();
                                const newPath = path.join(root, ...folders, base);
                                return path.join(__dirname, 'public', 'solutions', newPath);
                            },
                        },
                    ],
                })
            )

            // Important: return the modified config
            return config
        },
    };
};