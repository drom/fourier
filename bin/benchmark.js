#!/usr/bin/env node

'use strict';

var Benchmark = require('benchmark'),
    fft = require('../lib/fft-custom.js');

var suite = new Benchmark.Suite;

var re, im, j, fn = fft();

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

function initType (N, Type) {
    return function () {
        var i;
        re = new Type(N);
        im = new Type(N);
        for (i = 0; i < N; i++) {
            re[i] = Math.random();
            im[i] = Math.random();
        }
    };
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft-single-' + j, {
        onStart: initType(j, Float32Array),
        fn: (function (N) {
            return function () { fn['fft' + N](re, im); };
        })(j)
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft-double-' + j, {
        onStart: initType(j, Float64Array),
        fn: (function (N) {
            return function () { fn['fft' + N](re, im); };
        })(j)
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft-' + j, {
        onStart: init(j),
        fn: (function (N) {
            return function () { fn['fft' + N](re, im); };
        })(j)
    });
}

suite
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({ async: true });
