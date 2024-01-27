'use strict';

/**
Discrete Fourier transform (DFT).
(the slowest possible implementation)
Assumes `inpReal` and `inpImag` arrays have the same size.
*/
module.exports = function (inpReal, inpImag) {
  const outReal = [];
  const outImag = [];
  const sin = [];
  const cos = [];

  const N = inpReal.length;
  const twoPiByN = Math.PI / N * 2;

  /* initialize Sin / Cos tables */
  for (let k = 0; k < N; k++) {
    const angle = twoPiByN * k;
    sin.push(Math.sin(angle));
    cos.push(Math.cos(angle));
  }

  for (let k = 0; k < N; k++) {
    let sumReal = 0;
    let sumImag = 0;
    let nn = 0;
    for (let n = 0; n < N; n++) {
      sumReal +=  inpReal[n] * cos[nn] + inpImag[n] * sin[nn];
      sumImag += -inpReal[n] * sin[nn] + inpImag[n] * cos[nn];
      nn = (nn + k) % N;
    }
    outReal.push(sumReal);
    outImag.push(sumImag);
  }
  return [outReal, outImag];
};
