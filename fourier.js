(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var fourier = require('./index');

},{"./index":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

/**
Fast Fourier transform (FFT).
Cooley–Tukey algorithm.
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

},{}],4:[function(require,module,exports){
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
            ihalf,
            jh,
            realj,
            imagj,
            realjh,
            imagjh,
            step,
            tmpReal,
            tmpImag,
            width,
            sink,
            sinkNq;

        initTwiddles(real);
        permutation(real, imag);
        N = real.length;
        Nq = N / 4;
        step = N / 2;
        half = 1;
        for (width = 2; width <= N; width *= 2) {

            for (i = 0; i < N; i += width) {
                k = 0;
                ihalf = i + half;

                for (j = i; j < ihalf; j++) {

                    // complex multiplication
                    realj = real[j];
                    imagj = imag[j];
                    jh = j + half;
                    realjh = real[jh];
                    imagjh = imag[jh];
                    sink = sin[k];
                    sinkNq = sin[k + Nq];
                    tmpReal =  realjh * sinkNq + imagjh * sink;
                    tmpImag = -realjh * sink   + imagjh * sinkNq;

                    // Radix-2 butterfly
                    real[jh] = realj - tmpReal;
                    imag[jh] = imagj - tmpImag;
                    real[j]  = realj + tmpReal;
                    imag[j]  = imagj + tmpImag;

                    k += step;
                }

            }
            step >>= 1;
            half <<= 1;
        }
    }

    return transform;
}

module.exports = fftDitRadix2;

},{}],5:[function(require,module,exports){
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
        outReal,
        outImag,
        sumReal,
        sumImag,
        kk,
        sin,
        cos,
        twoPiByN;

    N = inpReal.length;
    twoPiByN = Math.PI / N * 2;

    outReal = new Float64Array(N);
    outImag = new Float64Array(N);

    sin = new Float64Array(N);
    cos = new Float64Array(N);

    /* initialize Sin / Cos tables */
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

var dftSimple = require('./dft-simple'),
    idftSimple = require('./idft-simple'),
    idftSimpleDouble = require('./idft-simple-double'),
    fftDitRadix2 = require('./fft-dit-radix2'),
    fftDitRadix2Simple = require('./fft-dit-radix2-simple');

module.exports = {
    dft: dftSimple,
    idft: idftSimple,
    fft: fftDitRadix2,

    dftSimple: dftSimple,
    idftSimple: idftSimple,
    idftSimpleDouble: idftSimpleDouble,
    fftDitRadix2: fftDitRadix2,
    fftDitRadix2Simple: fftDitRadix2Simple
};

},{"./dft-simple":2,"./fft-dit-radix2":4,"./fft-dit-radix2-simple":3,"./idft-simple":6,"./idft-simple-double":5}]},{},[1]);
