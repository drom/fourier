'use strict';

var lib = require('../lib'),
    expect = require('chai').expect;

describe('DFT 4096', function () {
    var i,
        inpReal,
        inpImag,
        len = 4096,
        roundArray = function (arr, precision) {
            var j,
                jlen,
                ret = [];

            precision = precision || 100000;
            for (j = 0; j < jlen; j++) {
                ret.push(Math.round(arr[j] * precision) / precision);
            }
            return ret;
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

        expect(res[0]).to.be.an('array');
        expect(res[1]).to.be.an('array');
        expect(res[0].reduce(add, 0)).to.be.equal(0);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('fft, zeros', function (done) {
        var res;

        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(0);
            inpImag.push(0);
        }

        lib.fft(inpReal, inpImag);

        expect(inpReal).to.be.an('array');
        expect(inpImag).to.be.an('array');
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

        expect(roundArray(res[0])).to.be.eql(roundArray(inpReal));
        expect(roundArray(res[1])).to.be.eql(roundArray(inpImag));
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

        lib.fft(res[0], res[1]);
        res = lib.idft(res[0], res[1]);

        expect(roundArray(res[0])).to.be.eql(roundArray(inpReal));
        expect(roundArray(res[1])).to.be.eql(roundArray(inpImag));
        done();
    });

    it('random fft-double vs. idft-double', function (done) {
        var refRealRaw,
            refImagRaw,
            refReal,
            refImag,
            realRaw,
            imagRaw,
            real,
            imag,
            res;

        refRealRaw = new ArrayBuffer(8 * len);
        refReal = new Float64Array(refRealRaw);

        refImagRaw = new ArrayBuffer(8 * len);
        refImag = new Float64Array(refImagRaw);

        realRaw = new ArrayBuffer(8 * len);
        real = new Float64Array(realRaw);

        imagRaw = new ArrayBuffer(8 * len);
        imag = new Float64Array(imagRaw);

        for (i = 0; i < len; i++) {
            real[i] = refReal[i] = 100 * Math.random();
            imag[i] = refImag[i] = 100 * Math.random();
        }

        lib.fftDitRadix2Double(real, imag); // in-place
        res = lib.idftSimpleDouble(real, imag);

        expect(roundArray(res[0])).to.be.eql(roundArray(refReal));
        expect(roundArray(res[1])).to.be.eql(roundArray(refImag));
        done();
    });
});
