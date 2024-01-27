'use strict';

const dftSimple = require('./dft-simple');
const idftSimple = require('./idft-simple');
const idftSimpleDouble = require('./idft-simple-double');
const fftDitRadix2 = require('./fft-dit-radix2');
const fftDitRadix2Simple = require('./fft-dit-radix2-simple');
const custom = require('./fft-custom');
const radix4Custom = require('./fft-radix4-custom');

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
