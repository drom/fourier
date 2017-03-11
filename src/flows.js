'use strict';

function cmul (cnst) {
    return function (a) {
        return { re: a.re * cnst, im: a.im * cnst };
    };
}

var fi = Math.PI / 8;

var c01 = cmul(Math.cos(fi) - Math.cos(3 * fi));
var c03 = cmul(Math.cos(2 * fi));
var c05 = cmul(Math.cos(fi) + Math.cos(3 * fi));
var c00 = cmul(Math.cos(3 * fi));
var c06 = cmul(Math.sin(3 * fi));

function swap (a) { return { re: a.im, im: a.re }; }

function pppp (a, b) { return { re:  a.re + b.re, im:  a.im + b.im }; }
function pmmp (a, b) { return { re:  a.re - b.re, im: -a.im + b.im }; }
function mpmp (a, b) { return { re: -a.re + b.re, im: -a.im + b.im }; }
function pppm (a, b) { return { re:  a.re + b.re, im:  a.im - b.im }; }
function mppp (a, b) { return { re: -a.re + b.re, im:  a.im + b.im }; }

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
        swap(x[3])
    ];
}

function radix4_c (x) {
    return [
        pppp(x[0], x[2]),
        pppm(x[1], x[3]),
        mpmp(x[2], x[0]),
        mppp(x[3], x[1])
    ];
}

function radix4 (x) {
    return radix4_c(
        radix4_b(
        radix4_a(x))
    );
}

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

function radix16_a (x) {
    return [
        x[0],
        pppp(x[1],  x[15]),
        pppp(x[2],  x[14]),
        pppp(x[3],  x[13]),
        pppp(x[4],  x[12]),
        pppp(x[5],  x[11]),
        pppp(x[6],  x[10]),
        pppp(x[7],  x[9]),
        x[8],
        pmmp(x[9],  x[7]),
        pmmp(x[10], x[6]),
        pmmp(x[11], x[5]),
        pmmp(x[12], x[4]),
        pmmp(x[13], x[3]),
        pmmp(x[14], x[2]),
        pmmp(x[15], x[1])
    ];
}

function radix16_b (x) {
    return [
        pppp(x[0],  x[8]),
        mpmp(x[1],  x[7]),
        pppp(x[2],  x[6]),
        mpmp(x[3],  x[5]),
        x[4],
        pppp(x[5],  x[3]),
        mpmp(x[6],  x[2]),
        pppp(x[7],  x[1]),
        mpmp(x[8],  x[0]),

        mpmp(x[9],  x[15]),
        pppp(x[10], x[14]),
        mpmp(x[11], x[13]),
        x[12],
        pppp(x[13], x[11]),
        mpmp(x[14], x[10]),
        pppp(x[15], x[9])
    ];
}

function radix16_c (x) {
    return [
        pppp(x[0],  x[4]),
        x[1],
        x[2],
        x[3],
        mpmp(x[4],  x[0]),
        mpmp(x[5],  x[7]),
        x[6],
        pppp(x[7],  x[5]),
        x[8],
        pppp(x[9],  x[11]),
        x[10],
        mpmp(x[11], x[9]),
        x[12],
        x[13],
        x[14],
        x[15]
    ];
}

function radix16_d (x) {
    return [
        x[0],
        x[1],
        x[4],
        x[3],
        x[2],
        x[6],
        x[5],
        x[8],
        x[7],
        x[10],
        x[9],
        x[12],
        x[11],
        x[13],
        x[14],
        x[15],
        pppp(x[1], x[3]),
        pppp(x[13], x[15])
    ];
}

function radix16_e (x) {
    return [
        x[0],
        c01(x[1]),
        x[2],
        c05(x[3]),
        x[4],
        c03(x[5]),
        c03(x[6]),
        x[7],
        x[8],
        swap(c03(x[9])),
        swap(c03(x[10])),
        x[11],
        x[12],
        swap(c05(x[13])),
        x[14],
        swap(c01(x[15])),

        c00(x[16]),
        swap(c06(x[17]))
    ];
}

function radix16_f (x) {
    return [
        x[0],
        pppp(x[1], x[16]),
        x[2],
        mpmp(x[3], x[16]),
        x[4],
        x[5],
        x[6],
        x[7],
        x[8],
        x[9],
        x[10],
        x[11],
        x[12],
        mpmp(x[13], x[17]),
        x[14],
        mpmp(x[15], x[17])
    ];
}

function radix16_g (x) {
    return [
        pppp(x[0], x[4]),
        x[1],
        x[2],
        x[3],
        mpmp(x[4], x[0]),
        mpmp(x[5], x[7]),
        x[6],
        pppp(x[7], x[5]),
        x[8],
        pppp(x[9], swap(x[11])),
        x[10],
        mpmp(swap(x[11]), x[9]),
        x[12],
        x[13],
        x[14],
        x[15]
    ];
}

function radix16_h (x) {
    return [
        pppp(x[0],  x[8]),
        mpmp(x[1],  x[7]),
        pppp(x[2],  x[6]),
        mpmp(x[3],  x[5]),
        x[4],
        pppp(x[5],  x[3]),
        mpmp(x[6],  x[2]),
        pppp(x[7],  x[1]),
        mpmp(x[8],  x[0]),

        mpmp(x[9],  x[15]),
        pppp(x[10], swap(x[14])),
        mpmp(x[11], x[13]),
        x[12],
        pppp(x[13], x[11]),
        mpmp(swap(x[14]), x[10]),
        pppp(x[15], x[9])
    ];
}

function radix16_k (x) {
    return [
        x[0],
        pppp(x[1],  x[15]),
        pppp(x[2],  x[14]),
        pppp(x[3],  x[13]),
        pppp(x[4], swap(x[12])),
        pppp(x[5],  x[11]),
        pppp(x[6],  x[10]),
        pppp(x[7],  x[9]),
        x[8],
        mpmp(x[9],  x[7]),
        mpmp(x[10], x[6]),
        mpmp(x[11], x[5]),
        mpmp(swap(x[12]), x[4]),
        mpmp(x[13], x[3]),
        mpmp(x[14], x[2]),
        mpmp(x[15], x[1])
    ];
}

function radix16 (x) {
    return radix16_k(
        radix16_h(
            radix16_g(
                radix16_f(
                    radix16_e(
                        radix16_d(
                            radix16_c(
                                radix16_b(
                                    radix16_a(x)
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}

module.exports = {
    radix16: radix16,
    radix8: radix8,
    radix4: radix4
};
