'use strict';

/**
    Fast Fourier transform (FFT).
    Cooley–Tukey algorithm.
    Assumes `real` and `imag` arrays have the same width.
*/

function fftDitRadix2 () {
    var sin = [];

    function bitReversal (x, log2N) {
        var res = 0;
        while (log2N--) {
            res <<= 1;
            res |= x & 1;
            x >>= 1;
        }
        return res;
    }

    /**
        element permutation
    */
    function permutation (real, imag) {
        var i,
            j,
            tmp,
            N,
            log2N;

        N = real.length;
        log2N = Math.log(N) / Math.log(2);

        for (i = 0; i < N; i++) {
            j = bitReversal(i, log2N);
            if (j > i) {
                tmp = real[i];
                real[i] = real[j];
                real[j] = tmp;
                tmp = imag[i];
                imag[i] = imag[j];
                imag[j] = tmp;
            }
        }
    }

    /**
        initialize Sin / Cos tables
    */
    function initTwiddles (input) {
        var twoPiByN,
            count,
            N,
            NQ,
            tmp,
            s0, s1, s2, s3, s4;

        N = input.length;
        NQ = N + N / 4;
        /** check existing tables */
        if (sin && sin.length && sin.length === NQ) {
            return;
        }
        twoPiByN = Math.PI / N * 2;

        switch (Object.prototype.toString.call(input)) {
            case '[object Float64Array]':
                sin = new Float64Array(NQ);
                break;
            case '[object Float32Array]':
                sin = new Float32Array(NQ);
                break;
            default:
                sin = new Array(NQ);
        }

        sin[0] = sin[N / 2] = sin[N] = 0;
        sin[N / 4] = 1;
        sin[3 * (N / 4)] = -1;

        s0 = 0;
        s1 = N / 2;
        s2 = N / 2;
        s3 = N;
        s4 = N;
        count = N / 4 - 1;

        while (count--) {
            s0++; s2++; s4++;
            s1--; s3--;
            tmp = Math.sin(twoPiByN * s0);
            sin[s0] = sin[s1] = sin[s4] = tmp;
            sin[s2] = sin[s3] = -tmp;
        }
    }

    function transform (real, imag) {
        var N,
            Nq,
            i,
            j,
            k,
            half,
            step,
            tmpReal,
            tmpImag,
            width;

        initTwiddles(real);
        permutation(real, imag);
        N = real.length;
        Nq = N / 4;

        for (width = 2; width <= N; width *= 2) {
            step = N / width;
            half = width / 2;
            for (i = 0; i < N; i += width) {
                k = 0;
                for (j = i; j < i + half; j++) {

                    // complex multiplication
                    tmpReal =  real[j + half] * sin[k + Nq] + imag[j + half] * sin[k];
                    tmpImag = -real[j + half] * sin[k] + imag[j + half] * sin[k + Nq];

                    // Radix-2 butterfly
                    real[j + half] = real[j] - tmpReal;
                    imag[j + half] = imag[j] - tmpImag;
                    real[j]        = real[j] + tmpReal;
                    imag[j]        = imag[j] + tmpImag;

                    k += step;
                }
            }
        }
    }

    return transform;
}

module.exports = fftDitRadix2;
