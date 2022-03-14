const menu = require("./utils-build/menu.js");

module.exports = (phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        basePath: "/css-battle-showcase",
        env: {
            menu: menu.get('_battles'),
        },
    };
};