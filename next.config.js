const menu = require("./utils-build/menu.js");

const BASE_PATH = "/css-battle-showcase";
module.exports = (phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        basePath: BASE_PATH,
        env: {
            basePath: BASE_PATH,
            menu: menu.get('_battles'),
        },
    };
};