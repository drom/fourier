#!/usr/bin/env node

'use strict';

var Benchmark = require('benchmark'),
    fourier = require('../lib');

var suite = new Benchmark.Suite;

var re, im, j;

function init (N) {
    return function () {
        var i;
        re = [];
        im = [];
        for (i = 0; i < N; i++) {
            re.push(Math.random());
            im.push(Math.random());
        }
    };
}

function fft () { fourier.fft(re, im); }

for (j = 16; j <= Math.pow(2, 17); j *= 2) {
    suite.add('fft' + j,   { onStart: init(j), fn: fft });
}
suite
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({ async: true });
