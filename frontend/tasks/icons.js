const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const glob = require('glob');
const svgSpriter = require('svg-sprite');

const srcIcons = 'frontend/src/assets/icons/';
const buildIcons = 'frontend/public/assets/icons';

const svgoConfig = {
    plugins: [
        { rootAttributes: { xmlns: 'http://www.w3.org/2000/svg' } },
        { sortAttrs: true },
        { removeTitle: false },
        { removeViewBox: false },
        { removeDesc: true },
        { removeDimensions: true },
        { transformsWithOnePath: true },
        { convertStyleToAttrs: true },
        { removeStyleElement: true },
    ],
};

const spriter = new svgSpriter({
    dest: buildIcons,
    log: 'info',
    shape: {
        transform: [{ svgo: svgoConfig }],
    },
    svg: svgoConfig,
    mode: {
        symbol: {
            //css: true,
            inline: true,
            symbol: true,
            dest: '',
            prefix: '.icon-%s',
            sprite: 'icons.svg',
        },
    },
});

glob(path.resolve(srcIcons, '**/*.svg'), (err, result) => {
    if (err) throw err;

    result.forEach((file) => {
        let name = path.relative(srcIcons, file);
        spriter.add(file, name, fs.readFileSync(file));
    });

    spriter.compile((error, result) => {
        for (let mode in result) {
            for (let resource in result[mode]) {
                mkdirp.sync(path.dirname(result[mode][resource].path));
                fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
            }
        }
    });
});
