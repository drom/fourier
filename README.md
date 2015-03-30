[![Build Status](https://travis-ci.org/drom/fourier.svg)](https://travis-ci.org/drom/fourier)

## Fourier transform

http://en.wikipedia.org/wiki/Discrete_Fourier_transform

### Install

```
npm i fourier --save
```

### Usage

```javascript
var fourier = require('fourier');

var y = fourier.dft([0, 1, 2, 3], [0, 0, 0, 0]);

=>  [
      [
        6,
        -2.0000000000000004,
        -2,
        -1.9999999999999984
      ],
      [
        0,
        1.9999999999999998,
        -7.34788079488412e-16,
        -2.000000000000001
      ]
    ]

var z = fourier.idft(y[0], y[1]);

=>  [
      [
        2.7755575615628914e-16,
        0.9999999999999999,
        1.9999999999999998,
        3
      ],
      [
        -4.440892098500626e-16,
        -2.7755575615628914e-16,
        -1.1102230246251565e-16,
        1.1102230246251565e-16
      ]
    ]

```

### Testing

`grunt mocha`
