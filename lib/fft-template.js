'use strict';

exports.alloc = function (size, base) {
    // allocate space for Real, Imag and Twiddles
    // Assumes Float data
    var byteSize,
        last,
        i;

    byteSize = (1 << base) * size * 13 / 4;
    i = 0x8000;
    last = i;
    for (; i < 0x10000000; i <<= 1) {
        if (byteSize & i) {
            last = i;
        }
    }
    byteSize = last << 1;
    // console.log('0x' + byteSize.toString(16));
    return new ArrayBuffer(byteSize);
};

exports.array2heap = function (input, arr, size, offset) {
    var i;
    for (i = 0; i < size; i++) {
        arr[i + offset] = input[i];
    }
};

exports.heap2array = function (arr, output, size, offset) {
    var i;
    for (i = 0; i < size; i++) {
        output[i] = arr[i + offset];
    }
};
<% var i, j, N, Nh, Nq;
[2, 3].forEach(function (log2base) {
    var base = 1 << log2base;
    var bitbase = 8 * base;
    for (i = min; i <= max; i++) {
        N = Math.pow(2, i);
        Nh = N / 2;
        Nq = N / 4;
%>
exports.fft_f<%= bitbase + '_' + N %> = function (stdlib, foreign, buffer) {
    'use asm';

    var sin = stdlib.Math.sin,
        data = new stdlib.Float<%= bitbase %>Array(buffer),
        twoPiByN = <%= 2 * Math.PI / N %>;

    function init () {
        var i = 0,
            tmp = 0.0,
            s0 = <%= base * N *  8 / 4 %>,
            s1 = <%= base * N * 10 / 4 %>,
            s2 = <%= base * N * 10 / 4 %>,
            s3 = <%= base * N * 12 / 4 %>,
            s4 = <%= base * N * 12 / 4 %>;

        data[<%=  8 * N / 4 %>] = 0.0;
        data[<%=  9 * N / 4 %>] = 1.0;
        data[<%= 10 * N / 4 %>] = 0.0;
        data[<%= 11 * N / 4 %>] = -1.0;
        data[<%= 12 * N / 4 %>] = 0.0;

        for (i = 1; (i | 0) < <%= N / 4 %>; i = (i + 1) | 0) {
            s0 = (s0 + <%= base %>) | 0;
            s1 = (s1 - <%= base %>) | 0;
            s2 = (s2 + <%= base %>) | 0;
            s3 = (s3 - <%= base %>) | 0;
            s4 = (s4 + <%= base %>) | 0;
            tmp = +sin(
                +(twoPiByN * +((i + 0) | 0))
            );
            data[s0 >> <%= log2base %>] = +tmp;
            data[s1 >> <%= log2base %>] = +tmp;
            data[s4 >> <%= log2base %>] = +tmp;
            data[s2 >> <%= log2base %>] = -tmp;
            data[s3 >> <%= log2base %>] = -tmp;
        }
    }

    function transform () {
        var i = 0,
            j = 0,
            k = 0,
            x = 0,
            half = 0,
            ihalf = 0,
            jh = 0,
            step = 0,
            width = 0,
            sink = 0.0,
            sinkNq = 0.0,
            realj = 0.0,
            imagj = 0.0,
            realjh = 0.0,
            imagjh = 0.0,
            tmpReal = 0.0,
            tmpImag = 0.0;

        // element permutation
        for (i = 0; (i | 0) < <%= base * N %>; i = (i + <%= base %>) | 0) {
            // bit reversal
            x = (i | 0) >> <%= log2base %>;
            j = 0;
            for (k = 0; (k | 0) < <%= i %>; k = (k + 1) | 0) {
                j = j << 1;
                j = j | (x & 1);
                x = x >> 1;
            }
            j = j << <%= log2base %>;
            if ((j | 0) > (i | 0)) {

                tmpReal = +data[i >> <%= log2base %>];
                data[i >> <%= log2base %>] = +data[j >> <%= log2base %>];
                data[j >> <%= log2base %>] = +tmpReal;

                tmpImag = +data[((i + <%= base * N %>) | 0) >> <%= log2base %>];
                data[((i + <%= base * N %>) | 0) >> <%= log2base %>] = +data[((j + <%= base * N %>) | 0) >> <%= log2base %>];
                data[((j + <%= base * N %>) | 0) >> <%= log2base %>] = +tmpImag;
            }
        }

        step = <%= base * Nh %>;
        half = <%= base %>;
        for (width = <%= base * 2 %>; (width | 0) <= <%= base * N %>; width = (width * 2) | 0) {
            for (i = 0; (i | 0) < <%= base * N %>; i = (i + width) | 0) {
                k = <%= base * 2 * N %>;
                ihalf = (i + half) | 0;
                for (j = i; (j | 0) < (ihalf | 0); j = (j + <%= base %>) | 0) {
                    jh = (j + half) | 0;

                    realj = +data[j >> <%= log2base %>];
                    imagj = +data[(j + <%= base * N %>) >> <%= log2base %>];

                    realjh = +data[jh >> <%= log2base %>];
                    imagjh = +data[(jh + <%= base * N %>) >> <%= log2base %>];

                    sink = +data[k >> <%= log2base %>];
                    sinkNq = +data[(k + <%= base * Nq %>) >> <%= log2base %>];

                    // complex multiplication
                    tmpReal = +(+realjh * +sinkNq + +imagjh * +sink);
                    tmpImag = +(-realjh * +sink   + +imagjh * +sinkNq);

                    // Radix-2 butterfly
                    data[jh >> <%= log2base %>] = +(realj - tmpReal);
                    data[((jh + <%= base * N %>) | 0) >> <%= log2base %>] = +(imagj - tmpImag);
                    data[j >> <%= log2base %>] = +(realj + tmpReal);
                    data[((j + <%= base * N %>) | 0) >> <%= log2base %>] = +(imagj + tmpImag);

                    k = (k + step) | 0;
                }
            }
            step = step >> 1;
            half = half << 1;
        }
    }

    return {
        init: init,
        transform: transform
    };
};
<% } }); %>
