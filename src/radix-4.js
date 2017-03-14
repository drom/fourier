'use strict';

function genRadix4 (ops) {

    var pppp = ops.pppp,
        mpmp = ops.mpmp,
        pppm = ops.pppm,
        mppp = ops.mppp,
        swap = ops.swap;

    function radix4_a (x) {
        return [
            pppp(x[0], x[2]),
            pppp(x[1], x[3]),
            mpmp(x[2], x[0]),
            mpmp(x[3], x[1])
        ];
    }

    function radix4_b (x) {
        return [
            x[0],
            x[2],
            x[1],
            swap(x[3]) // first part of conj.
        ];
    }

    function radix4_c (x) {
        return [
            pppp(x[0], x[2]),
            pppm(x[1], x[3]), // second part of conj.
            mpmp(x[2], x[0]),
            mppp(x[3], x[1])  // second part of conj.
        ];
    }

    function radix4 (x) {
        return radix4_c(
            radix4_b(
            radix4_a(x))
        );
    }

    return radix4;

}

module.exports = genRadix4;
