'use strict';

/**
Fast Fourier transform (FFT).
Cooley–Tukey algorithm.
(the slowest possible implementation)
Assumes `real` and `imag` arrays have the same width.
*/

function bitReversal (x, bits) {
    var res = 0;
    while (bits--) {
        res <<= 1;
        res |= x & 1;
        x >>= 1;
    }
    return res;
}

function log2 (N) {
    return Math.log(N) / Math.log(2);
}

module.exports = function fftDitRadix2 (real, imag) {
    var log2N,
        i,
        j,
        N,
        k,
        half,
        step,
        twoPiByN,
        angle,
        sin = [],
        cos = [],
        tmpReal,
        tmpImag,
        width;

    N = real.length;
    log2N = log2(N);
    twoPiByN = Math.PI / N * 2;

    /* initialize Sin / Cos tables */
    for (k = 0; k < N; k++) {
        angle = twoPiByN * k;
        sin.push(Math.sin(angle));
        cos.push(Math.cos(angle));
    }

    // element permutation
    for (i = 0; i < N; i++) {
        j = bitReversal(i, log2N);
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }

    for (width = 2; width <= N; width *= 2) {
        step = N / width;
        half = width / 2;
        for (i = 0; i < N; i += width) {
            k = 0;
            for (j = i; j < i + half; j++) {

                // complex multiplication
                tmpReal =  real[j + half] * cos[k] + imag[j + half] * sin[k];
                tmpImag = -real[j + half] * sin[k] + imag[j + half] * cos[k];

                // Radix-2 butterfly
                real[j + half] = real[j] - tmpReal;
                imag[j + half] = imag[j] - tmpImag;
                real[j]        = real[j] + tmpReal;
                imag[j]        = imag[j] + tmpImag;

                k += step;
            }
        }
    }
};
