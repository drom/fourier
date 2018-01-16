'use strict';

var dftSimple = require('./dft-simple'),
    idftSimple = require('./idft-simple'),
    idftSimpleDouble = require('./idft-simple-double'),
    fftDitRadix2 = require('./fft-dit-radix2'),
    fftDitRadix2Simple = require('./fft-dit-radix2-simple'),
    custom = require('./fft-custom'),
    radix4Custom = require('./fft-radix4-custom');

module.exports = {
    dft: dftSimple,
    idft: idftSimple,
    fft: fftDitRadix2,
    custom: custom,
    radix4Custom: radix4Custom,
    dftSimple: dftSimple,
    idftSimple: idftSimple,
    idftSimpleDouble: idftSimpleDouble,
    fftDitRadix2: fftDitRadix2,
    fftDitRadix2Simple: fftDitRadix2Simple
};
