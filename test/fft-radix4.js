'use strict';

var lib = require('../lib');

try {
    var FFT = require('fft.js');
} catch(err) {
    console.log('Nope, the runtime is too old');
    console.log(err);
}

var expect = require('chai').expect;
var len = 16;

describe('DFT ' + len, function () {
    var i,
        inpReal,
        inpImag,
        fn,
        stdlib,
        heap,
        compare = function (a, b, label) {
            var i,
                err = 0;

            expect(a.length, label + 'length').to.be.equal(b.length);

            label += ' error:';
            for (i = 0; i < a.length; i++) {
                if (isNaN(a[i])) {
                    console.log(a);
                    return;
                }
                if (isNaN(b[i])) {
                    console.log(b);
                    return;
                }
                err += Math.abs(a[i] - b[i]);
            }
            err /= a.length;
            console.log(label, err);
            try {
                expect(err, label).to.be.at.most(0.0000001);
            } catch (err) {
                console.log(a);
                console.log(err);
            }
        },
        add = function (a, b) { return a + b; };

    if (typeof window === 'undefined') {
        stdlib = {
            Math: Math,
            Float64Array: Float64Array,
            Float32Array: Float32Array
        };
        if (stdlib.Math.fround === undefined) {
            stdlib.Math.fround = function (n) { return n; };
        }
    } else {
        stdlib = window;
    }

    it('random fft-radix4-f64-raw vs. idft-double', function (done) {
        var refReal,
            refImag,
            real,
            imag,
            res;

        refReal = new Float64Array(len);
        refImag = new Float64Array(len);
        real = new Float64Array(len);
        imag = new Float64Array(len);

        for (i = 0; i < len; i++) {
            // real[i] = refReal[i] = Math.random() - 0.5;
            // imag[i] = refImag[i] = Math.random() - 0.5;
            if (i === 1) {
                real[i] = refReal[i] = 1;
                imag[i] = refImag[i] = 1;
            } else {
                real[i] = refReal[i] = 0;
                imag[i] = refImag[i] = 0;
            }
        }

        heap = lib.custom.alloc(len, 3);

        fn = lib.radix4Custom['fft_radix4_f64_' + len + '_raw'](stdlib, null, heap);
        fn.init();

        lib.custom.array2heap(real, new Float64Array(heap), len, 0);
        lib.custom.array2heap(imag, new Float64Array(heap), len, len);

        fn.transform();

        lib.custom.heap2array(new Float64Array(heap), real, len, 0);
        lib.custom.heap2array(new Float64Array(heap), imag, len, len);

        console.log(real, imag);
        res = lib.idft(real, imag);

        compare(res[0], refReal, 'real');
        compare(res[1], refImag, 'imag');
        done();
    });
});

/* eslint no-console: 0 */
