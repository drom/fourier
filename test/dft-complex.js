'use strict';

var lib = require('../lib'),
    expect = require('chai').expect;

describe('DFT 4096', function () {
    var i,
        inpReal,
        inpImag,
        len = 4096,
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
            expect(err, label).to.be.at.most(0.0000001);
        },
        add = function (a, b) { return a + b; };

    it('dft, zeros', function (done) {
        var res;

        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(0);
            inpImag.push(0);
        }

        res = lib.dft(inpReal, inpImag);

        expect(res[0]).to.be.an('array');
        expect(res[1]).to.be.an('array');
        expect(res[0].reduce(add, 0)).to.be.equal(0);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('idft, zeros', function (done) {
        var res;

        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(0);
            inpImag.push(0);
        }

        res = lib.idft(inpReal, inpImag);

        compare(res[0], inpReal, 'real');
        compare(res[1], inpImag, 'imag');
        done();
    });

    it('fft, zeros', function (done) {
        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(0);
            inpImag.push(0);
        }

        lib.fft(inpReal, inpImag);

        expect(inpReal.reduce(add, 0)).to.be.equal(0);
        expect(inpImag.reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('dft, DC = 1', function (done) {
        var res;

        inpReal[0] = 1;

        res = lib.dft(inpReal, inpImag);

        expect(res[0].reduce(add, 0)).to.be.equal(len);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('random dft / idft', function (done) {
        var res;

        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(100 * Math.random());
            inpImag.push(100 * Math.random());
        }

        res = lib.dft(inpReal, inpImag);
        res = lib.idft(res[0], res[1]);

        compare(res[0], inpReal, 'real');
        compare(res[1], inpImag, 'imag');
        done();
    });

    it('random fft / idft', function (done) {
        var res;

        res = [[], []];
        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(100 * Math.random());
            inpImag.push(100 * Math.random());
            res[0].push(inpReal[i]);
            res[1].push(inpImag[i]);
        }

        lib.fft()(res[0], res[1]);
        res = lib.idft(res[0], res[1]);

        compare(res[0], inpReal, 'real');
        compare(res[1], inpImag, 'imag');
        done();
    });

    it('random fft-double vs. idft-double', function (done) {
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
            real[i] = refReal[i] = Math.random() - 0.5;
            imag[i] = refImag[i] = Math.random() - 0.5;
        }

        lib.fft()(real, imag); // in-place
        res = lib.idft(real, imag);

        compare(res[0], refReal, 'real');
        compare(res[1], refImag, 'imag');
        done();
    });

    it('random fft-single vs. idft-double', function (done) {
        var refReal,
            refImag,
            real,
            imag,
            res;

        refReal = new Float32Array(len);
        refImag = new Float32Array(len);
        real = new Float32Array(len);
        imag = new Float32Array(len);

        for (i = 0; i < len; i++) {
            real[i] = refReal[i] = Math.random() - 0.5;
            imag[i] = refImag[i] = Math.random() - 0.5;
        }

        lib.fft()(real, imag); // in-place
        res = lib.idft(real, imag);

        compare(res[0], refReal, 'real');
        compare(res[1], refImag, 'imag');
        done();
    });
});
