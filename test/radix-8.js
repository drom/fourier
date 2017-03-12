'use strict';

var lib = require('../lib'),
    flows = require('../src/flows'),
    expect = require('chai').expect;

var std = {
    add: function (a, b) { return a + b; },
    sub: function (a, b) { return a - b; },
    mul: function (a, b) { return a * b; }
};

describe('Radix8', function () {
    var i,
        inpReal,
        inpImag,
        fn,
        stdlib,
        heap,
        len = 8,
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
            } catch (error) {
                for (i = 0; i < a.length; i++) {
                    console.log(a[i], b[i], a[i] - b[i]);
                }
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

    it('flow radix8 vs. dft-double', function (done) {
        var refReal = new Float64Array(len);
        var refImag = new Float64Array(len);
        var real = new Float64Array(len);
        var imag = new Float64Array(len);
        var complex = [];

        for (i = 0; i < len; i++) {
            real[i] = refReal[i] = Math.random() - 0.5;
            imag[i] = refImag[i] = Math.random() - 0.5;
            complex.push({ re: real[i], im: imag[i] });
        }

        complex = flows(std).radix8(complex);

        var cx = complex.reduce(function (res, e) {
            res.re.push(e.re);
            res.im.push(e.im);
            return res;
        }, { re: [], im: [] });

        var res = lib.dft(real, imag);

        compare(res[0], cx.re, 'real');
        compare(res[1], cx.im, 'imag');
        done();
    });
});
