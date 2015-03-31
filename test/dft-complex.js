'use strict';

var lib = require('../lib'),
    expect = require('chai').expect;

describe('DFT 4096', function () {
    var i,
        inpReal,
        inpImag,
        res,
        len = 4096,
        roundArray = function (arr, precision) {
            var ret = [];
            precision = precision || 100000;
            arr.forEach(function (e) {
                ret.push(Math.round(e * precision) / precision);
            });
            return ret;
        },
        add = function (a, b) { return a + b; };

    it('dft, zeros', function (done) {
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
        inpReal[0] = 1;

        res = lib.dft(inpReal, inpImag);

        expect(res[0].reduce(add, 0)).to.be.equal(len);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('random dft / idft', function (done) {
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

});
