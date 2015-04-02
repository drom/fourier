'use strict';

/**
Inverse Discrete Fourier transform (IDFT).
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
        kk,
        sin = [],
        cos = [],
        twoPiByN;

    N = inpReal.length;
    twoPiByN = Math.PI / N * 2;
    /* initialize Sin / Cos tables */
    for (n = 0; n < N; n++) {
        angle = twoPiByN * n;
        sin.push(Math.sin(angle));
        cos.push(Math.cos(angle));
    }

    for (n = 0; n < N; n++) {
        sumReal = 0;
        sumImag = 0;
        kk = 0;
        for (k = 0; k < N; k++) {
            sumReal +=  inpReal[k] * cos[kk] - inpImag[k] * sin[kk];
            sumImag +=  inpReal[k] * sin[kk] + inpImag[k] * cos[kk];
            kk = (kk + n) % N;
        }
        outReal.push(sumReal / N);
        outImag.push(sumImag / N);
    }
    return [outReal, outImag];
};
