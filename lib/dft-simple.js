'use strict';

/**
Discrete Fourier transform (DFT).
(the slowest possible implementation)
Assumes `inpReal` and `inpImag` arrays have the same size.
*/
module.exports = function (inpReal, inpImag) {
  var N,
    k,
    n,
    angle,
    outReal = [],
    outImag = [],
    sumReal,
    sumImag,
    nn,
    sin = [],
    cos = [],
    twoPiByN;

  N = inpReal.length;
  twoPiByN = Math.PI / N * 2;

  /* initialize Sin / Cos tables */
  for (k = 0; k < N; k++) {
    angle = twoPiByN * k;
    sin.push(Math.sin(angle));
    cos.push(Math.cos(angle));
  }

  for (k = 0; k < N; k++) {
    sumReal = 0;
    sumImag = 0;
    nn = 0;
    for (n = 0; n < N; n++) {
      sumReal +=  inpReal[n] * cos[nn] + inpImag[n] * sin[nn];
      sumImag += -inpReal[n] * sin[nn] + inpImag[n] * cos[nn];
      nn = (nn + k) % N;
    }
    outReal.push(sumReal);
    outImag.push(sumImag);
  }
  return [outReal, outImag];
};
