const menu = require("./utils-build/menu.js");

module.exports = (phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        env: {
            menu: menu.get('_battles'),
        },
    };
};