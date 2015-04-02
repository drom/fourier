![Fourier](http://upload.wikimedia.org/wikipedia/commons/4/49/Joseph_Fourier_%28circa_1820%29.jpg)

[![Travis](https://travis-ci.org/drom/fourier.svg)](https://travis-ci.org/drom/fourier)
[![NPM](https://badge.fury.io/js/fourier.svg)](http://badge.fury.io/js/fourier)

## Discrete Fourier Transform

http://en.wikipedia.org/wiki/Discrete_Fourier_transform

### dft()

```javascript

fourier.dft(realArray, imagArray); // ⇒ [realArray, imagArray]

```

![X_k=\sum_{n=0}^{N-1}x_n\cdot e^{-i 2 \pi k n/N}](http://latex.codecogs.com/svg.latex?%5Clarge%20X_k%3D%5Csum_%7Bn%3D0%7D%5E%7BN-1%7Dx_n%5Ccdot%20e%5E%7B-i%202%20%5Cpi%20k%20n/N%7D)

### idft()

```javascript

fourier.idft(realArray, imagArray); // ⇒ [realArray, imagArray]

```

![x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot e^{i 2 \pi k n/N}](http://latex.codecogs.com/svg.latex?%5Clarge%20x_n%3D%5Cfrac%7B1%7D%7BN%7D%5Csum_%7Bk%3D0%7D%5E%7BN-1%7DX_k%5Ccdot%20e%5E%7Bi%202%20%5Cpi%20k%20n/N%7D)

### fft()

Fast Fourier transform (FFT). Cooley–Tukey algorithm. in-place.

```javascript

fourier.fft(realArray, imagArray); // in-place

```

### Install

```
npm i fourier --save
```

### Usage

```javascript
var fourier = require('fourier');

var y = fourier.dft([0, 1, 2, 3], [0, 0, 0, 0]);
var z = fourier.idft(y[0], y[1]);
```

### Testing

`grunt mocha`

## License

MIT [LICENSE](https://github.com/drom/fourier/blob/master/LICENSE).
