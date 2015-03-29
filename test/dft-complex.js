'use strict';

var lib = require('../lib'),
    expect = require('chai').expect;

describe('DFT 1024', function () {
    var i,
        inpReal,
        inpImag,
        res,
        len = 1024,
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

        res = lib.dftComplex(inpReal, inpImag);

        expect(res[0]).to.be.an('array');
        expect(res[1]).to.be.an('array');
        expect(res[0].reduce(add, 0)).to.be.equal(0);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('DC = 1', function (done) {
        inpReal[0] = 1;

        res = lib.dftComplex(inpReal, inpImag);

        expect(res[0].reduce(add, 0)).to.be.equal(len);
        expect(res[1].reduce(add, 0)).to.be.equal(0);
        done();
    });

    it('random 8', function (done) {
        inpReal = [
            0.27984,
            0.57953,
            0.46401,
            0.35479,
            0.57387,
            0.83437,
            0.51631,
            0.86183
        ];

        res = lib.dftComplex(inpReal, inpImag);

        expect(res[0]).to.be.eql([
            4.46455,
            -0.11569766978475315,
            -0.12661000000000014,
            -0.4723623302152477,
            -0.7964899999999999,
            -0.4723623302152478,
            -0.1266100000000027,
            -0.11569766978474949
        ]);

        expect(res[1]).to.be.eql([
            0,
            0.5910305144504069,
            -0.19728000000000023,
            0.4864305144504075,
            -6.768867788247251e-16,
            -0.4864305144504081,
            0.19727999999999957,
            -0.5910305144504059
        ]);
        done();
    });

});
