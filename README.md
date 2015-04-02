<span><img align="right" src="http://upload.wikimedia.org/wikipedia/commons/4/49/Joseph_Fourier_%28circa_1820%29.jpg"/></span>

### *Fourier*
[![Travis](https://travis-ci.org/drom/fourier.svg)](https://travis-ci.org/drom/fourier)
[![NPM](https://badge.fury.io/js/fourier.svg)](http://badge.fury.io/js/fourier)


JavaScript library of vector transformations.

http://en.wikipedia.org/wiki/Discrete_Fourier_transform

### dft()

```javascript

fourier.dft(realArray, imagArray); // ⇒ [realArray, imagArray]

```
<a href="http://www.codecogs.com/eqnedit.php?latex=X_k=\sum_{n=0}^{N-1}x_n\cdot&space;e^{-i&space;2&space;\pi&space;k&space;n/N}" target="_blank"><img src="http://latex.codecogs.com/svg.latex?X_k=\sum_{n=0}^{N-1}x_n\cdot&space;e^{-i&space;2&space;\pi&space;k&space;n/N}" title="X_k=\sum_{n=0}^{N-1}x_n\cdot e^{-i 2 \pi k n/N}" /></a>

### idft()

```javascript

fourier.idft(realArray, imagArray); // ⇒ [realArray, imagArray]

```
<a href="http://www.codecogs.com/eqnedit.php?latex=\large&space;x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot&space;e^{i&space;2&space;\pi&space;kn/N}" target="_blank"><img src="http://latex.codecogs.com/svg.latex?\large&space;x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot&space;e^{i&space;2&space;\pi&space;kn/N}" title="\large x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot e^{i 2 \pi kn/N}" /></a>

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
