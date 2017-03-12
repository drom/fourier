#!/usr/bin/env node

'use strict';

var range = require('lodash.range'),
    flows = require('../src/flows');

function ops () {
    var count = 1;
    return {
        binop: function (op) {
            return function (a, b) {
                var res = 'a' + count;
                console.log(res + ' = ' + a + op + b);
                count++;
                return res;
            };
        }
    };
}

var g = ops();

var std = {
    add: g.binop(' + '),
    sub: g.binop(' - '),
    mul: g.binop(' * ')
};

flows(std).radix8(range(8).map(function (e) {
    return { re: 'x_re' + e, im: 'x_im' + e };
}))
.map(function (e, i) {
    console.log('z_re' + i + ' = ' + e.re);
    console.log('z_im' + i + ' = ' + e.im);
});
