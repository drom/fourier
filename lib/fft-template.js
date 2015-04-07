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

        for (i = <%= min %>; i <= <%= max %>; i++) {
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

<% var i, j, N, Nh, Nq;
for (i = min; i <= max; i++) {
    N = Math.pow(2, i);
    Nh = N / 2;
    Nq = N / 4;
%>
ret.fft<%= N %> = function (real, imag) {
    'use strict';
    'use asm';

    var i, j, k, x, N, Nq, half, ihalf, jh, step, width,
        sin,
        sink, sinkNq,
        realj, imagj,
        realjh, imagjh,
        tmpReal, tmpImag;

    N = <%= N %>;
    sin = sins.<%= 'twi' + N %>;

    // element permutation
    for (i = 0; i < N; i++) {
        // bit reversal
        x = i;
        j = 0;
        width = <%= i %>;
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
    Nq = <%= Nq %>;
    step = <%= Nh %>;
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
};<% } %>
return ret;
};
