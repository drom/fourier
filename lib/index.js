'use strict';

var dftSimple = require('./dft-simple'),
    idftSimple = require('./idft-simple'),
    fftDitRadix2 = require('./fft-dit-radix2');

module.exports = {
    dft: dftSimple,
    idft: idftSimple,
    fft: fftDitRadix2
};
