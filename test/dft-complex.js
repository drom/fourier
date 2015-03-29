'use strict';

var lib = require('../lib'),
    expect = require('chai').expect;

describe('DFT 1024', function () {
    var i,
        inpReal,
        inpImag,
        res,
        len = 1024,
        roundArray = function (arr, precision) {
            var ret = [];
            precision = precision || 100000;
            arr.forEach(function (e) {
                ret.push(Math.round(e * precision) / precision);
            });
            return ret;
        },
        add = function (a, b) { return a + b; };

    before(function () {
        inpReal = [];
        inpImag = [];
        for (i = 0; i < len; i++) {
            inpReal.push(0);
            inpImag.push(0);
        }
    });

    it('zero', function (done) {

        res = lib.dft(inpReal, inpImag);

        expect(res[0]).to.be.an('array');
        expect(res[1]).to.be.an('array');
        expect(res[0].reduce(add, 0)).to.be.equal(0);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('DC = 1', function (done) {
        inpReal[0] = 1;

        res = lib.dft(inpReal, inpImag);

        expect(res[0].reduce(add, 0)).to.be.equal(len);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('random 8', function (done) {
        inpReal = [
            0.24971,
            0.62419,
            0.52696,
            0.17905,
            0.75235,
            0.42635,
            0.49530,
            0.72413
        ];

        res = lib.dft(inpReal, inpImag);

        expect(roundArray(res[0])).to.be.eql([
            3.97804,
            0.02268,
            -0.0202,
            -1.02796,
            0.0706,
            -1.02796,
            -0.0202,
            0.02268
        ]);

        expect(roundArray(res[1])).to.be.eql([
            0.00000,
            0.21388,
            -0.14736,
            0.27720,
            -0.00000,
            -0.27720,
            0.14736,
            -0.21388
        ]);
        done();
    });

});
