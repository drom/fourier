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

function initDouble (N) {
    return function () {
        var i;
        var reRaw = new ArrayBuffer(8 * N);
        var imRaw = new ArrayBuffer(8 * N);
        re = new Float64Array(reRaw);
        im = new Float64Array(imRaw);
        for (i = 0; i < N; i++) {
            re[i] = Math.random();
            im[i] = Math.random();
        }
    };
}

function fftDitRadix2 () { fourier.fftDitRadix2(re, im); }

function fftDitRadix2Double () { fourier.fftDitRadix2Double(re, im); }

for (j = 16; j <= Math.pow(2, 17); j *= 2) {
    suite.add('fft' + j, {
        onStart: init(j),
        fn: fftDitRadix2
    });
}
for (j = 16; j <= Math.pow(2, 17); j *= 2) {
    suite.add('fft-double-' + j, {
        onStart: initDouble(j),
        fn: fftDitRadix2Double
    });
}
suite
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({ async: true });
