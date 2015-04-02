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

function fft () {
    var fn = fourier.fft();
    return function () {
        fn(re, im);
    };
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft-single-' + j, {
        onStart: initType(j, Float32Array),
        fn: fft()
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft-double-' + j, {
        onStart: initType(j, Float64Array),
        fn: fft()
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft-' + j, {
        onStart: init(j),
        fn: fft()
    });
}

suite
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({ async: true });
