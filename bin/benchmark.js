#!/usr/bin/env node
'use strict';

var Benchmark = require('benchmark'),
    fourier = require('../lib');

var suite,
    re,
    im,
    j,
    stdlib,
    heap,
    fn;

suite = new Benchmark.Suite;

if (typeof window === 'undefined') {
    stdlib = {
        Math: Math,
        Float32Array: Float32Array,
        Float64Array: Float64Array
    };
    if (stdlib.Math.fround === undefined) {
        stdlib.Math.fround = function (n) { return n; };
    }
} else {
    stdlib = window;
}

// function init (N) {
//     return function () {
//         var i;
//         re = [];
//         im = [];
//         for (i = 0; i < N; i++) {
//             re.push(Math.random());
//             im.push(Math.random());
//         }
//     };
// }

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
    suite.add('fft_f64_' + j + '_asm', {
        onStart: (function (size) {
            return function () {
                heap = fourier.custom.alloc(size, 3);
                fn = fourier.custom['fft_f64_' + size + '_asm'](stdlib, null, heap);
                fn.init();
            };
        })(j),
        fn: function () { fn.transform(); }
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft_f64_' + j + '_raw', {
        onStart: (function (size) {
            return function () {
                heap = fourier.custom.alloc(size, 3);
                fn = fourier.custom['fft_f64_' + size + '_raw'](stdlib, null, heap);
                fn.init();
            };
        })(j),
        fn: function () { fn.transform(); }
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft_f32_' + j + '_asm', {
        onStart: (function (size) {
            return function () {
                heap = fourier.custom.alloc(size, 2);
                fn = fourier.custom['fft_f32_' + size + '_asm'](stdlib, null, heap);
                fn.init();
            };
        })(j),
        fn: function () { fn.transform(); }
    });
}

for (j = 16; j <= Math.pow(2, 19); j *= 2) {
    suite.add('fft_f32_' + j + '_raw', {
        onStart: (function (size) {
            return function () {
                heap = fourier.custom.alloc(size, 2);
                fn = fourier.custom['fft_f32_' + size + '_raw'](stdlib, null, heap);
                fn.init();
            };
        })(j),
        fn: function () { fn.transform(); }
    });
}

// for (j = 16; j <= Math.pow(2, 9); j *= 2) {
//     suite.add('fft-' + j, {
//         onStart: init(j),
//         fn: (function (N) {
//             return function () { fn['fft' + N](re, im); };
//         })(j)
//     });
// }

suite
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({ async: false });
