const withPWA = require("next-pwa");

const PROD = process.env.NODE_ENV === "production";

const config = {
    pwa: {
        dest: "public",
    },
    swcMinify: true,
};

module.exports = PROD ? withPWA(config) : config;
