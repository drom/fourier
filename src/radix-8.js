'use strict';

function genRadix8 (ops) {

    var pppp = ops.pppp,
        mpmp = ops.mpmp,
        pmmp = ops.pmmp,
        swap = ops.swap,
        c03 = ops.c03;

    function radix8_a (x) {
        return [
            x[0],
            pppp(x[1], x[7]),
            pppp(x[2], x[6]),
            pppp(x[3], x[5]),
            x[4],
            pmmp(x[5], x[3]),
            pmmp(x[6], x[2]),
            pmmp(x[7], x[1])
        ];
    }

    function radix8_f (e) {
        return [
            e[0],
            pppp(e[1], e[7]),
            pppp(e[2], swap(e[6])),
            pppp(e[3], e[5]),
            e[4],
            mpmp(e[5], e[3]),
            mpmp(swap(e[6]), e[2]),
            mpmp(e[7], e[1])
        ];
    }

    function radix8_b (a) {
        return [
            pppp(a[0], a[4]),
            mpmp(a[1], a[3]),
            a[2],
            pppp(a[3], a[1]),
            mpmp(a[4], a[0]),
            mpmp(a[5], a[7]),
            a[6],
            pppp(a[7], a[5])
        ];
    }

    function radix8_e (d) {
        return [
            pppp(d[0], d[4]),
            mpmp(d[1], d[3]),
            d[2],
            pppp(d[3], d[1]),
            mpmp(d[4], d[0]),
            mpmp(swap(d[5]), d[7]),
            d[6],
            pppp(d[7], swap(d[5]))
        ];
    }

    function radix8_c (b) {
        return [
            pppp(b[0], b[2]),
            b[1],
            mpmp(b[2], b[0]),
            b[4],
            b[3],
            b[6],
            b[5],
            b[7]
        ];
    }

    function radix8_d (c) {
        return [
            c[0],
            c03(c[1]),
            c[2],
            c[3],
            c[4],
            c[5],
            c[6],
            swap(c03(c[7]))
        ];
    }

    function radix8 (x) {
        return radix8_f(
            radix8_e(
            radix8_d(
            radix8_c(
            radix8_b(
            radix8_a(x)))))
        );
    }

    return radix8;
}

module.exports = genRadix8;
