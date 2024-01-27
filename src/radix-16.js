'use strict';

module.exports = function (ops) {

  var pppp = ops.pppp,
    mpmp = ops.mpmp,
    pmmp = ops.pmmp,
    swap = ops.swap,
    c01 = ops.c01,
    c03 = ops.c03,
    c05 = ops.c05,
    c00 = ops.c00,
    c06 = ops.c06;

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
      swap(x[11]),
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
      pppp(x[9], x[11]),
      x[10],
      mpmp(x[11], x[9]),
      x[12],
      x[13],
      swap(x[14]),
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
      pppp(x[10], x[14]),
      mpmp(x[11], x[13]),
      swap(x[12]),
      pppp(x[13], x[11]),
      mpmp(x[14], x[10]),
      pppp(x[15], x[9])
    ];
  }

  function radix16_k (x) {
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
      mpmp(x[9],  x[7]),
      mpmp(x[10], x[6]),
      mpmp(x[11], x[5]),
      mpmp(x[12], x[4]),
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

  return radix16;
};
