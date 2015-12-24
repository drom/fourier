#!/usr/bin/env node

'use strict';

var template = require('lodash.template'),
    fs = require('fs'),
    path = require('path');

fs.readFile(
    path.resolve(__dirname, '../src/fft-template.js'),
    { encoding: 'utf8' },
    function (err, data) {
        if (err) { throw err; }
        console.log(template(data)({min: 4, max: 20}));
    }
);
