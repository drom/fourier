'use strict';
'use asm';

module.exports = function () {
    var sins = {},
        ret = {};

    function initTwiddles () {
        var i,
            sin,
            twoPiByN,
            count,
            N,
            NQ,
            tmp,
            s0, s1, s2, s3, s4;

        for (i = 4; i <= 20; i++) {
            N = Math.pow(2, i);
            NQ = N + N / 4;
            twoPiByN = Math.PI / N * 2;

            sin = new Float32Array(NQ);
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
            sins['twi' + N] = sin;
        }
    }

initTwiddles();


ret.fft16 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 16;
    sin = sins.twi16;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 4;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 4;
    step = 8;
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
};
ret.fft32 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 32;
    sin = sins.twi32;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 5;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 8;
    step = 16;
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
};
ret.fft64 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 64;
    sin = sins.twi64;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 6;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 16;
    step = 32;
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
};
ret.fft128 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 128;
    sin = sins.twi128;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 7;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 32;
    step = 64;
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
};
ret.fft256 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 256;
    sin = sins.twi256;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 8;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 64;
    step = 128;
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
};
ret.fft512 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 512;
    sin = sins.twi512;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 9;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 128;
    step = 256;
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
};
ret.fft1024 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 1024;
    sin = sins.twi1024;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 10;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 256;
    step = 512;
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
};
ret.fft2048 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 2048;
    sin = sins.twi2048;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 11;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 512;
    step = 1024;
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
};
ret.fft4096 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 4096;
    sin = sins.twi4096;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 12;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 1024;
    step = 2048;
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
};
ret.fft8192 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 8192;
    sin = sins.twi8192;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 13;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 2048;
    step = 4096;
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
};
ret.fft16384 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 16384;
    sin = sins.twi16384;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 14;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 4096;
    step = 8192;
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
};
ret.fft32768 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 32768;
    sin = sins.twi32768;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 15;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 8192;
    step = 16384;
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
};
ret.fft65536 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 65536;
    sin = sins.twi65536;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 16;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 16384;
    step = 32768;
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
};
ret.fft131072 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 131072;
    sin = sins.twi131072;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 17;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 32768;
    step = 65536;
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
};
ret.fft262144 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 262144;
    sin = sins.twi262144;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 18;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 65536;
    step = 131072;
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
};
ret.fft524288 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 524288;
    sin = sins.twi524288;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 19;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 131072;
    step = 262144;
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
};
ret.fft1048576 = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = 1048576;
    sin = sins.twi1048576;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = 20;
        while (width--) {
            j <<= 1;
            j |= x & 1;
            x >>= 1;
        }
        if (j > i) {
            tmpReal = real[i];
            real[i] = real[j];
            real[j] = tmpReal;
            tmpImag = imag[i];
            imag[i] = imag[j];
            imag[j] = tmpImag;
        }
    }
    Nq = 262144;
    step = 524288;
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
};
return ret;
};

