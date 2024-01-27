'use strict';

exports.alloc = function (size, base) {
  // allocate space for Real, Imag and Twiddles
  // Assumes Float data

  let byteSize = (1 << base) * size * 13 / 4;
  let i = 0x8000;
  let last = i;
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
  for (let i = 0; i < size; i++) {
    arr[i + offset] = input[i];
  }
};

exports.heap2array = function (arr, output, size, offset) {
  for (let i = 0; i < size; i++) {
    output[i] = arr[i + offset];
  }
};


exports.fft_radix4_f64_16_raw = function (stdlib, foreign, buffer) {

  var sin = stdlib.Math.sin,

    data = new stdlib.Float64Array(buffer),
    twoPiByN = 0.39269908169872414;

  function init () {
    var i = 0,
      tmp = 0.0,
      s0 = 256,
      s1 = 320,
      s2 = 320,
      s3 = 384,
      s4 = 384;

    data[32] = 0.0;
    data[36] = 1.0;
    data[40] = 0.0;
    data[44] = -1.0;
    data[48] = 0.0;

    for (i = 1; (i | 0) < 4; i = (i + 1) | 0) {
      s0 = (s0 + 8) | 0;
      s1 = (s1 - 8) | 0;
      s2 = (s2 + 8) | 0;
      s3 = (s3 - 8) | 0;
      s4 = (s4 + 8) | 0;
      tmp = sin(
        +(
          +(twoPiByN) *
          +((i + 0) | 0)
        )
      );
      data[s0 >> 3] = (tmp);
      data[s1 >> 3] = (tmp);
      data[s4 >> 3] = (tmp);
      data[s2 >> 3] = (-tmp);
      data[s3 >> 3] = (-tmp);
    }
  }

  function transform () {
    var i = 0,
      j = 0,
      k = 0,
      ileg = 0,
      width = 0;

    console.log(data);

    // element permutation
    // for (i = 0; (i | 0) < 128; i = (i + 8) | 0) {
    //     // digit reversal
    //     var x = (i | 0) >> 3;
    //     j = 0;
    //     for (k = 0; (k | 0) < 4; k = (k + 1) | 0) {
    //         j = j << 1;
    //         j = j | (x & 1);
    //         x = x >> 1;
    //     }
    //     j = j << 3;
    //     if ((j | 0) > (i | 0)) {
    //
    //         var tmpReal = (data[i >> 3]);
    //         data[i >> 3] = (data[j >> 3]);
    //         data[j >> 3] = (tmpReal);
    //
    //         var tmpImag = (data[((i + 128) | 0) >> 3]);
    //         data[((i + 128) | 0) >> 3] = (data[((j + 128) | 0) >> 3]);
    //         data[((j + 128) | 0) >> 3] = (tmpImag);
    //     }
    // }


    var step = 32;
    var leg = 8;

    // decimation-in-time
    // data is in normal order

    console.log(data);

    for (width = 32; (width | 0) <= 128; width = (width << 2) | 0) {
      // per layer

      var leg0 = 0 * leg;
      var leg1 = 1 * leg;
      var leg2 = 2 * leg;
      var leg3 = 3 * leg;

      for (i = 0; (i | 0) < 128; i = (i + width) | 0) {
        // per butterfly group
        k = 256;
        ileg = (i + leg) | 0;

        for (j = i; (j | 0) < (ileg | 0); j = (j + 8) | 0) {
          // per butterfly

          // Data address

          var daddr_re0 = j + leg0;
          var daddr_im0 = daddr_re0 + 128;
          var daddr_re1 = j + leg1;
          var daddr_im1 = daddr_re1 + 128;
          var daddr_re2 = j + leg2;
          var daddr_im2 = daddr_re2 + 128;
          var daddr_re3 = j + leg3;
          var daddr_im3 = daddr_re3 + 128;
          // Load Data

          var y_re0 = (data[daddr_re0 >> 3]);
          var y_im0 = (data[daddr_im0 >> 3]);
          var y_re1 = (data[daddr_re1 >> 3]);
          var y_im1 = (data[daddr_im1 >> 3]);
          var y_re2 = (data[daddr_re2 >> 3]);
          var y_im2 = (data[daddr_im2 >> 3]);
          var y_re3 = (data[daddr_re3 >> 3]);
          var y_im3 = (data[daddr_im3 >> 3]);
          // Twiddle addresses

          var taddr_re0 = 0 * k;
          var taddr_im0 = taddr_re0 + 16;
          var taddr_re1 = 1 * k;
          var taddr_im1 = taddr_re1 + 16;
          var taddr_re2 = 2 * k;
          var taddr_im2 = taddr_re2 + 16;
          var taddr_re3 = 3 * k;
          var taddr_im3 = taddr_re3 + 16;
          // Load twiddles

          var sin0 = (data[taddr_re0 >> 3]);
          var cos0 = (data[taddr_im0 >> 3]);
          var sin1 = (data[taddr_re1 >> 3]);
          var cos1 = (data[taddr_im1 >> 3]);
          var sin2 = (data[taddr_re2 >> 3]);
          var cos2 = (data[taddr_im2 >> 3]);
          var sin3 = (data[taddr_re3 >> 3]);
          var cos3 = (data[taddr_im3 >> 3]);
          // complex multiplication

          var x_re0 = (((y_im0) * (sin0)) + ((y_re0) * (sin0)));
          var x_im0 = (((y_im0) * (cos0)) - ((y_re0) * (cos0)));

          var x_re1 = (((y_im1) * (sin1)) + ((y_re1) * (sin1)));
          var x_im1 = (((y_im1) * (cos1)) - ((y_re1) * (cos1)));

          var x_re2 = (((y_im2) * (sin2)) + ((y_re2) * (sin2)));
          var x_im2 = (((y_im2) * (cos2)) - ((y_re2) * (cos2)));

          var x_re3 = (((y_im3) * (sin3)) + ((y_re3) * (sin3)));
          var x_im3 = (((y_im3) * (cos3)) - ((y_re3) * (cos3)));

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

          data[daddr_re0 >> 3] = (z_re0);
          data[daddr_im0 >> 3] = (z_im0);

          data[daddr_re1 >> 3] = (z_re1);
          data[daddr_im1 >> 3] = (z_im1);

          data[daddr_re2 >> 3] = (z_re2);
          data[daddr_im2 >> 3] = (z_im2);

          data[daddr_re3 >> 3] = (z_re3);
          data[daddr_im3 >> 3] = (z_im3);

          k = (k + step) | 0;
        }
      }
      step = step >> 2;
      leg = leg << 2;
    }
    console.log(data);
  }

  return {
    init: init,
    transform: transform
  };
};

exports.fft_radix4_f64_4_raw = function (stdlib, foreign, buffer) {

  var sin = stdlib.Math.sin,

    data = new stdlib.Float64Array(buffer),
    twoPiByN = 1.5707963267948966;

  function init () {
    var i = 0,
      tmp = 0.0,
      s0 = 64,
      s1 = 80,
      s2 = 80,
      s3 = 96,
      s4 = 96;

    data[8] = 0.0;
    data[9] = 1.0;
    data[10] = 0.0;
    data[11] = -1.0;
    data[12] = 0.0;

    for (i = 1; (i | 0) < 1; i = (i + 1) | 0) {
      s0 = (s0 + 8) | 0;
      s1 = (s1 - 8) | 0;
      s2 = (s2 + 8) | 0;
      s3 = (s3 - 8) | 0;
      s4 = (s4 + 8) | 0;
      tmp = sin(
        +(
          +(twoPiByN) *
          +((i + 0) | 0)
        )
      );
      data[s0 >> 3] = (tmp);
      data[s1 >> 3] = (tmp);
      data[s4 >> 3] = (tmp);
      data[s2 >> 3] = (-tmp);
      data[s3 >> 3] = (-tmp);
    }
  }

  function transform () {
    var i = 0,
      j = 0,
      k = 0,
      ileg = 0,
      width = 0;

    console.log(data);

    // element permutation
    // for (i = 0; (i | 0) < 32; i = (i + 8) | 0) {
    //     // digit reversal
    //     var x = (i | 0) >> 3;
    //     j = 0;
    //     for (k = 0; (k | 0) < 2; k = (k + 1) | 0) {
    //         j = j << 1;
    //         j = j | (x & 1);
    //         x = x >> 1;
    //     }
    //     j = j << 3;
    //     if ((j | 0) > (i | 0)) {
    //
    //         var tmpReal = (data[i >> 3]);
    //         data[i >> 3] = (data[j >> 3]);
    //         data[j >> 3] = (tmpReal);
    //
    //         var tmpImag = (data[((i + 32) | 0) >> 3]);
    //         data[((i + 32) | 0) >> 3] = (data[((j + 32) | 0) >> 3]);
    //         data[((j + 32) | 0) >> 3] = (tmpImag);
    //     }
    // }


    var step = 8;
    var leg = 8;

    // decimation-in-time
    // data is in normal order

    console.log(data);

    for (width = 32; (width | 0) <= 32; width = (width << 2) | 0) {
      // per layer

      var leg0 = 0 * leg;
      var leg1 = 1 * leg;
      var leg2 = 2 * leg;
      var leg3 = 3 * leg;

      for (i = 0; (i | 0) < 32; i = (i + width) | 0) {
        // per butterfly group
        k = 64;
        ileg = (i + leg) | 0;

        for (j = i; (j | 0) < (ileg | 0); j = (j + 8) | 0) {
          // per butterfly

          // Data address

          var daddr_re0 = j + leg0;
          var daddr_im0 = daddr_re0 + 32;
          var daddr_re1 = j + leg1;
          var daddr_im1 = daddr_re1 + 32;
          var daddr_re2 = j + leg2;
          var daddr_im2 = daddr_re2 + 32;
          var daddr_re3 = j + leg3;
          var daddr_im3 = daddr_re3 + 32;
          // Load Data

          var y_re0 = (data[daddr_re0 >> 3]);
          var y_im0 = (data[daddr_im0 >> 3]);
          var y_re1 = (data[daddr_re1 >> 3]);
          var y_im1 = (data[daddr_im1 >> 3]);
          var y_re2 = (data[daddr_re2 >> 3]);
          var y_im2 = (data[daddr_im2 >> 3]);
          var y_re3 = (data[daddr_re3 >> 3]);
          var y_im3 = (data[daddr_im3 >> 3]);
          // Twiddle addresses

          var taddr_re0 = 0 * k;
          var taddr_im0 = taddr_re0 + 4;
          var taddr_re1 = 1 * k;
          var taddr_im1 = taddr_re1 + 4;
          var taddr_re2 = 2 * k;
          var taddr_im2 = taddr_re2 + 4;
          var taddr_re3 = 3 * k;
          var taddr_im3 = taddr_re3 + 4;
          // Load twiddles

          var sin0 = (data[taddr_re0 >> 3]);
          var cos0 = (data[taddr_im0 >> 3]);
          var sin1 = (data[taddr_re1 >> 3]);
          var cos1 = (data[taddr_im1 >> 3]);
          var sin2 = (data[taddr_re2 >> 3]);
          var cos2 = (data[taddr_im2 >> 3]);
          var sin3 = (data[taddr_re3 >> 3]);
          var cos3 = (data[taddr_im3 >> 3]);
          // complex multiplication

          var x_re0 = (((y_im0) * (sin0)) + ((y_re0) * (sin0)));
          var x_im0 = (((y_im0) * (cos0)) - ((y_re0) * (cos0)));

          var x_re1 = (((y_im1) * (sin1)) + ((y_re1) * (sin1)));
          var x_im1 = (((y_im1) * (cos1)) - ((y_re1) * (cos1)));

          var x_re2 = (((y_im2) * (sin2)) + ((y_re2) * (sin2)));
          var x_im2 = (((y_im2) * (cos2)) - ((y_re2) * (cos2)));

          var x_re3 = (((y_im3) * (sin3)) + ((y_re3) * (sin3)));
          var x_im3 = (((y_im3) * (cos3)) - ((y_re3) * (cos3)));

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

          data[daddr_re0 >> 3] = (z_re0);
          data[daddr_im0 >> 3] = (z_im0);

          data[daddr_re1 >> 3] = (z_re1);
          data[daddr_im1 >> 3] = (z_im1);

          data[daddr_re2 >> 3] = (z_re2);
          data[daddr_im2 >> 3] = (z_im2);

          data[daddr_re3 >> 3] = (z_re3);
          data[daddr_im3 >> 3] = (z_im3);

          k = (k + step) | 0;
        }
      }
      step = step >> 2;
      leg = leg << 2;
    }
    console.log(data);
  }

  return {
    init: init,
    transform: transform
  };
};

exports.fft_radix4_f64_1024_raw = function (stdlib, foreign, buffer) {

  var sin = stdlib.Math.sin,

    data = new stdlib.Float64Array(buffer),
    twoPiByN = 0.006135923151542565;

  function init () {
    var i = 0,
      tmp = 0.0,
      s0 = 16384,
      s1 = 20480,
      s2 = 20480,
      s3 = 24576,
      s4 = 24576;

    data[2048] = 0.0;
    data[2304] = 1.0;
    data[2560] = 0.0;
    data[2816] = -1.0;
    data[3072] = 0.0;

    for (i = 1; (i | 0) < 256; i = (i + 1) | 0) {
      s0 = (s0 + 8) | 0;
      s1 = (s1 - 8) | 0;
      s2 = (s2 + 8) | 0;
      s3 = (s3 - 8) | 0;
      s4 = (s4 + 8) | 0;
      tmp = sin(
        +(
          +(twoPiByN) *
          +((i + 0) | 0)
        )
      );
      data[s0 >> 3] = (tmp);
      data[s1 >> 3] = (tmp);
      data[s4 >> 3] = (tmp);
      data[s2 >> 3] = (-tmp);
      data[s3 >> 3] = (-tmp);
    }
  }

  function transform () {
    var i = 0,
      j = 0,
      k = 0,
      ileg = 0,
      width = 0;

    console.log(data);

    // element permutation
    // for (i = 0; (i | 0) < 8192; i = (i + 8) | 0) {
    //     // digit reversal
    //     var x = (i | 0) >> 3;
    //     j = 0;
    //     for (k = 0; (k | 0) < 10; k = (k + 1) | 0) {
    //         j = j << 1;
    //         j = j | (x & 1);
    //         x = x >> 1;
    //     }
    //     j = j << 3;
    //     if ((j | 0) > (i | 0)) {
    //
    //         var tmpReal = (data[i >> 3]);
    //         data[i >> 3] = (data[j >> 3]);
    //         data[j >> 3] = (tmpReal);
    //
    //         var tmpImag = (data[((i + 8192) | 0) >> 3]);
    //         data[((i + 8192) | 0) >> 3] = (data[((j + 8192) | 0) >> 3]);
    //         data[((j + 8192) | 0) >> 3] = (tmpImag);
    //     }
    // }


    var step = 2048;
    var leg = 8;

    // decimation-in-time
    // data is in normal order

    console.log(data);

    for (width = 32; (width | 0) <= 8192; width = (width << 2) | 0) {
      // per layer

      var leg0 = 0 * leg;
      var leg1 = 1 * leg;
      var leg2 = 2 * leg;
      var leg3 = 3 * leg;

      for (i = 0; (i | 0) < 8192; i = (i + width) | 0) {
        // per butterfly group
        k = 16384;
        ileg = (i + leg) | 0;

        for (j = i; (j | 0) < (ileg | 0); j = (j + 8) | 0) {
          // per butterfly

          // Data address

          var daddr_re0 = j + leg0;
          var daddr_im0 = daddr_re0 + 8192;
          var daddr_re1 = j + leg1;
          var daddr_im1 = daddr_re1 + 8192;
          var daddr_re2 = j + leg2;
          var daddr_im2 = daddr_re2 + 8192;
          var daddr_re3 = j + leg3;
          var daddr_im3 = daddr_re3 + 8192;
          // Load Data

          var y_re0 = (data[daddr_re0 >> 3]);
          var y_im0 = (data[daddr_im0 >> 3]);
          var y_re1 = (data[daddr_re1 >> 3]);
          var y_im1 = (data[daddr_im1 >> 3]);
          var y_re2 = (data[daddr_re2 >> 3]);
          var y_im2 = (data[daddr_im2 >> 3]);
          var y_re3 = (data[daddr_re3 >> 3]);
          var y_im3 = (data[daddr_im3 >> 3]);
          // Twiddle addresses

          var taddr_re0 = 0 * k;
          var taddr_im0 = taddr_re0 + 1024;
          var taddr_re1 = 1 * k;
          var taddr_im1 = taddr_re1 + 1024;
          var taddr_re2 = 2 * k;
          var taddr_im2 = taddr_re2 + 1024;
          var taddr_re3 = 3 * k;
          var taddr_im3 = taddr_re3 + 1024;
          // Load twiddles

          var sin0 = (data[taddr_re0 >> 3]);
          var cos0 = (data[taddr_im0 >> 3]);
          var sin1 = (data[taddr_re1 >> 3]);
          var cos1 = (data[taddr_im1 >> 3]);
          var sin2 = (data[taddr_re2 >> 3]);
          var cos2 = (data[taddr_im2 >> 3]);
          var sin3 = (data[taddr_re3 >> 3]);
          var cos3 = (data[taddr_im3 >> 3]);
          // complex multiplication

          var x_re0 = (((y_im0) * (sin0)) + ((y_re0) * (sin0)));
          var x_im0 = (((y_im0) * (cos0)) - ((y_re0) * (cos0)));

          var x_re1 = (((y_im1) * (sin1)) + ((y_re1) * (sin1)));
          var x_im1 = (((y_im1) * (cos1)) - ((y_re1) * (cos1)));

          var x_re2 = (((y_im2) * (sin2)) + ((y_re2) * (sin2)));
          var x_im2 = (((y_im2) * (cos2)) - ((y_re2) * (cos2)));

          var x_re3 = (((y_im3) * (sin3)) + ((y_re3) * (sin3)));
          var x_im3 = (((y_im3) * (cos3)) - ((y_re3) * (cos3)));

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

          data[daddr_re0 >> 3] = (z_re0);
          data[daddr_im0 >> 3] = (z_im0);

          data[daddr_re1 >> 3] = (z_re1);
          data[daddr_im1 >> 3] = (z_im1);

          data[daddr_re2 >> 3] = (z_re2);
          data[daddr_im2 >> 3] = (z_im2);

          data[daddr_re3 >> 3] = (z_re3);
          data[daddr_im3 >> 3] = (z_im3);

          k = (k + step) | 0;
        }
      }
      step = step >> 2;
      leg = leg << 2;
    }
    console.log(data);
  }

  return {
    init: init,
    transform: transform
  };
};

exports.fft_radix4_f64_64_raw = function (stdlib, foreign, buffer) {

  var sin = stdlib.Math.sin,

    data = new stdlib.Float64Array(buffer),
    twoPiByN = 0.09817477042468103;

  function init () {
    var i = 0,
      tmp = 0.0,
      s0 = 1024,
      s1 = 1280,
      s2 = 1280,
      s3 = 1536,
      s4 = 1536;

    data[128] = 0.0;
    data[144] = 1.0;
    data[160] = 0.0;
    data[176] = -1.0;
    data[192] = 0.0;

    for (i = 1; (i | 0) < 16; i = (i + 1) | 0) {
      s0 = (s0 + 8) | 0;
      s1 = (s1 - 8) | 0;
      s2 = (s2 + 8) | 0;
      s3 = (s3 - 8) | 0;
      s4 = (s4 + 8) | 0;
      tmp = sin(
        +(
          +(twoPiByN) *
          +((i + 0) | 0)
        )
      );
      data[s0 >> 3] = (tmp);
      data[s1 >> 3] = (tmp);
      data[s4 >> 3] = (tmp);
      data[s2 >> 3] = (-tmp);
      data[s3 >> 3] = (-tmp);
    }
  }

  function transform () {
    var i = 0,
      j = 0,
      k = 0,
      ileg = 0,
      width = 0;

    console.log(data);

    // element permutation
    // for (i = 0; (i | 0) < 512; i = (i + 8) | 0) {
    //     // digit reversal
    //     var x = (i | 0) >> 3;
    //     j = 0;
    //     for (k = 0; (k | 0) < 6; k = (k + 1) | 0) {
    //         j = j << 1;
    //         j = j | (x & 1);
    //         x = x >> 1;
    //     }
    //     j = j << 3;
    //     if ((j | 0) > (i | 0)) {
    //
    //         var tmpReal = (data[i >> 3]);
    //         data[i >> 3] = (data[j >> 3]);
    //         data[j >> 3] = (tmpReal);
    //
    //         var tmpImag = (data[((i + 512) | 0) >> 3]);
    //         data[((i + 512) | 0) >> 3] = (data[((j + 512) | 0) >> 3]);
    //         data[((j + 512) | 0) >> 3] = (tmpImag);
    //     }
    // }


    var step = 128;
    var leg = 8;

    // decimation-in-time
    // data is in normal order

    console.log(data);

    for (width = 32; (width | 0) <= 512; width = (width << 2) | 0) {
      // per layer

      var leg0 = 0 * leg;
      var leg1 = 1 * leg;
      var leg2 = 2 * leg;
      var leg3 = 3 * leg;

      for (i = 0; (i | 0) < 512; i = (i + width) | 0) {
        // per butterfly group
        k = 1024;
        ileg = (i + leg) | 0;

        for (j = i; (j | 0) < (ileg | 0); j = (j + 8) | 0) {
          // per butterfly

          // Data address

          var daddr_re0 = j + leg0;
          var daddr_im0 = daddr_re0 + 512;
          var daddr_re1 = j + leg1;
          var daddr_im1 = daddr_re1 + 512;
          var daddr_re2 = j + leg2;
          var daddr_im2 = daddr_re2 + 512;
          var daddr_re3 = j + leg3;
          var daddr_im3 = daddr_re3 + 512;
          // Load Data

          var y_re0 = (data[daddr_re0 >> 3]);
          var y_im0 = (data[daddr_im0 >> 3]);
          var y_re1 = (data[daddr_re1 >> 3]);
          var y_im1 = (data[daddr_im1 >> 3]);
          var y_re2 = (data[daddr_re2 >> 3]);
          var y_im2 = (data[daddr_im2 >> 3]);
          var y_re3 = (data[daddr_re3 >> 3]);
          var y_im3 = (data[daddr_im3 >> 3]);
          // Twiddle addresses

          var taddr_re0 = 0 * k;
          var taddr_im0 = taddr_re0 + 64;
          var taddr_re1 = 1 * k;
          var taddr_im1 = taddr_re1 + 64;
          var taddr_re2 = 2 * k;
          var taddr_im2 = taddr_re2 + 64;
          var taddr_re3 = 3 * k;
          var taddr_im3 = taddr_re3 + 64;
          // Load twiddles

          var sin0 = (data[taddr_re0 >> 3]);
          var cos0 = (data[taddr_im0 >> 3]);
          var sin1 = (data[taddr_re1 >> 3]);
          var cos1 = (data[taddr_im1 >> 3]);
          var sin2 = (data[taddr_re2 >> 3]);
          var cos2 = (data[taddr_im2 >> 3]);
          var sin3 = (data[taddr_re3 >> 3]);
          var cos3 = (data[taddr_im3 >> 3]);
          // complex multiplication

          var x_re0 = (((y_im0) * (sin0)) + ((y_re0) * (sin0)));
          var x_im0 = (((y_im0) * (cos0)) - ((y_re0) * (cos0)));

          var x_re1 = (((y_im1) * (sin1)) + ((y_re1) * (sin1)));
          var x_im1 = (((y_im1) * (cos1)) - ((y_re1) * (cos1)));

          var x_re2 = (((y_im2) * (sin2)) + ((y_re2) * (sin2)));
          var x_im2 = (((y_im2) * (cos2)) - ((y_re2) * (cos2)));

          var x_re3 = (((y_im3) * (sin3)) + ((y_re3) * (sin3)));
          var x_im3 = (((y_im3) * (cos3)) - ((y_re3) * (cos3)));

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

          data[daddr_re0 >> 3] = (z_re0);
          data[daddr_im0 >> 3] = (z_im0);

          data[daddr_re1 >> 3] = (z_re1);
          data[daddr_im1 >> 3] = (z_im1);

          data[daddr_re2 >> 3] = (z_re2);
          data[daddr_im2 >> 3] = (z_im2);

          data[daddr_re3 >> 3] = (z_re3);
          data[daddr_im3 >> 3] = (z_im3);

          k = (k + step) | 0;
        }
      }
      step = step >> 2;
      leg = leg << 2;
    }
    console.log(data);
  }

  return {
    init: init,
    transform: transform
  };
};


/* eslint camelcase:0 no-console:0 */

