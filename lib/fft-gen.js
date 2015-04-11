'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

fs.readFile(
    path.resolve(__dirname, '../src/fft-template.js'),
    { encoding: 'utf8' },
    function (err, data) {
        if (err) { throw err; }
        console.log(_.template(data)({min: 4, max: 20}));
    }
);
