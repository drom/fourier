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
        outRealRaw,
        outImagRaw,
        outReal,
        outImag,
        sumReal,
        sumImag,
        kk,
        sinRaw,
        cosRaw,
        sin,
        cos,
        twoPiByN;

    N = inpReal.length;
    twoPiByN = Math.PI / N * 2;

    outRealRaw = new ArrayBuffer(8 * N);
    outReal = new Float64Array(outRealRaw);

    outImagRaw = new ArrayBuffer(8 * N);
    outImag = new Float64Array(outImagRaw);

    /* initialize Sin / Cos tables */
    sinRaw = new ArrayBuffer(8 * N);
    sin = new Float64Array(sinRaw);

    cosRaw = new ArrayBuffer(8 * N);
    cos = new Float64Array(cosRaw);

    for (n = 0; n < N; n++) {
        angle = twoPiByN * k;
        sin[n] = Math.sin(angle);
        cos[n] = Math.cos(angle);
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
        outReal[n] = sumReal / N;
        outImag[n] = sumImag / N;
    }
    return [outReal, outImag];
};
