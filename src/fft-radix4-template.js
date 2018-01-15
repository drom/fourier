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
asms.forEach(function (asm) {
bases.forEach(function (log2base) {
    var base = 1 << log2base;
    var bitbase = 8 * base;
    var F = asm ? ((log2base === 3) ? '+' : 'fround') : '';

    var Z = (log2base === 3) ? '0.0' : 'fround(0.0)';
    sizes.forEach(function (i) {
        N = Math.pow(2, i);
        Nh = N / 2;
        Nq = N / 4;
%>
exports.fft_f<%= bitbase + '_' + N + '_' + (asm ? 'asm' : 'raw') %> = function (stdlib, foreign, buffer) {
<%= asm ? '    \'use asm\';' : '' %>

    var sin = stdlib.Math.sin,
<% if (log2base === 2) { %>        fround = stdlib.Math.fround,<% } %>
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
            tmp = sin(
                +(
                    +(twoPiByN) *
                    +((i + 0) | 0)
                )
            );
            data[s0 >> <%= log2base %>] = <%= F %>(tmp);
            data[s1 >> <%= log2base %>] = <%= F %>(tmp);
            data[s4 >> <%= log2base %>] = <%= F %>(tmp);
            data[s2 >> <%= log2base %>] = <%= F %>(-tmp);
            data[s3 >> <%= log2base %>] = <%= F %>(-tmp);
        }
    }

    function transform () {
        var i = 0,
            j = 0,
            k = 0,
            ihalf = 0,
            width = 0;

        var step = <%= base * Nh %>;
        var half = <%= base %>;

        // data is in normal order
        for (width = <%= base * 2 %>; (width | 0) <= <%= base * N %>; width = (width * 4) | 0) {
            for (i = 0; (i | 0) < <%= base * N %>; i = (i + width) | 0) {
                k = <%= base * 2 * N %>;
                ihalf = (i + half) | 0;
                for (j = i; (j | 0) < (ihalf | 0); j = (j + <%= base %>) | 0) {

                    // Data address
<% for(var idx = 0; idx < 4; idx++) { %>
                    var daddr_re<%= idx %> = j + (<%= idx %> * half);
                    var daddr_im<%= idx %> = daddr_re<%= idx %> + <%= base * N %>;
<% } %>
                    // Load Data
<% for(var idx = 0; idx < 4; idx++) { %>
                    var y_re<%= idx %> = <%= F %>(data[daddr_re<%= idx %> >> <%= log2base %>]);
                    var y_im<%= idx %> = <%= F %>(data[daddr_im<%= idx %> >> <%= log2base %>]);
<% } %>
                    // Twiddle addresses
<% for(var idx = 0; idx < 4; idx++) { %>
                    var taddr_re<%= idx %> = <%= idx %> * k;
                    var taddr_im<%= idx %> = taddr_re<%= idx %> + <%= base * Nq %>;
<% } %>
                    // Load twiddles
<% for(var idx = 0; idx < 4; idx++) { %>
                    var sin<%= idx %> = <%= F %>(data[taddr_re<%= idx %> >> <%= log2base %>]);
                    var cos<%= idx %> = <%= F %>(data[taddr_im<%= idx %> >> <%= log2base %>]);
<% } %>
                    // complex multiplication
<% for(var idx = 0; idx < 4; idx++) { %>
                    var x_re<%= idx %> = <%= F %>(<%= F %>(<%= F %>(y_im<%= idx %>) * <%= F %>(sin<%= idx %>)) + <%= F %>(<%= F %>(y_re<%= idx %>) * <%= F %>(sin<%= idx %>)));
                    var x_im<%= idx %> = <%= F %>(<%= F %>(<%= F %>(y_im<%= idx %>) * <%= F %>(cos<%= idx %>)) - <%= F %>(<%= F %>(y_re<%= idx %>) * <%= F %>(cos<%= idx %>)));
<% } %>
                    // Radix-4 butterfly

                    var a1 = x_re0 + x_re2;
                    var a2 = x_im0 + x_im2;
                    var a3 = x_re1 + x_re3;
                    var a4 = x_im1 + x_im3;
                    var a5 = x_re0 - x_re2;
                    var a6 = x_im0 - x_im2;
                    var a7 = x_re1 - x_re3;
                    var a8 = x_im1 - x_im3;
                    var a9 = a1 + a3;
                    var a10 = a2 + a4;
                    var a11 = a5 + a8;
                    var a12 = a6 - a7;
                    var a13 = a1 - a3;
                    var a14 = a2 - a4;
                    var a15 = a5 - a8;
                    var a16 = a7 + a6;
                    var z_re0 = a9;
                    var z_im0 = a10;
                    var z_re1 = a11;
                    var z_im1 = a12;
                    var z_re2 = a13;
                    var z_im2 = a14;
                    var z_re3 = a15;
                    var z_im3 = a16;

                    // Store data
<% for(var idx = 0; idx < 4; idx++) { %>
                    data[daddr_re<%= idx %> >> <%= log2base %>] = <%= F %>(z_re<%= idx %>);
                    data[daddr_im<%= idx %> >> <%= log2base %>] = <%= F %>(z_im<%= idx %>);
<% } %>
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
<% }); }); }); %>

/* eslint camelcase:0  */
