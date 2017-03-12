'use strict';

var radix4 = require('./radix-4'),
    radix8 = require('./radix-8'),
    radix16 = require('./radix-16');

var fi = Math.PI / 8;


module.exports = function (std) {

    var add = std.add;
    var sub = std.sub;
    var mul = std.mul;

    function cmul (cnst) {
        return function (a) {
            return { re: mul(a.re, cnst), im: mul(a.im, cnst) };
        };
    }

    var ops = {
        c01: cmul(Math.cos(fi) - Math.cos(3 * fi)),
        c03: cmul(Math.cos(2 * fi)),
        c05: cmul(Math.cos(fi) + Math.cos(3 * fi)),
        c00: cmul(Math.cos(3 * fi)),
        c06: cmul(Math.sin(3 * fi)),
        swap: function (a) { return { re: a.im, im: a.re }; },
        pppp: function (a, b) { return { re: add(a.re, b.re), im: add(a.im, b.im) }; },
        pmmp: function (a, b) { return { re: sub(a.re, b.re), im: sub(b.im, a.im) }; },
        mpmp: function (a, b) { return { re: sub(b.re, a.re), im: sub(b.im, a.im) }; },
        pppm: function (a, b) { return { re: add(a.re, b.re), im: sub(a.im, b.im) }; },
        mppp: function (a, b) { return { re: sub(b.re, a.re), im: add(a.im, b.im) }; }
    };

    return {
        radix16: radix16(ops),
        radix8:  radix8(ops),
        radix4:  radix4(ops)
    };

};
