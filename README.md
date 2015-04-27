<span><img align="right" src="http://upload.wikimedia.org/wikipedia/commons/4/49/Joseph_Fourier_%28circa_1820%29.jpg"/></span>

### *Fourier*
[![Travis](https://travis-ci.org/drom/fourier.svg)](https://travis-ci.org/drom/fourier)
[![NPM](https://badge.fury.io/js/fourier.svg)](http://badge.fury.io/js/fourier)


Pure JavaScript library discrete transforms, including [Discrete Fourier Transform](http://en.wikipedia.org/wiki/Discrete_Fourier_transform) (DFT); It's fast, inverse, and special forms.

### Use

#### node

```
npm i fourier --save
```

```javascript
var fourier = require('fourier');
```

#### browser

```html
<script src="https://rawgithub.com/drom/fourier/master/fourier.js"></script>
```


### Functions

#### FFT

Fast Fourier transform (FFT). Cooley–Tukey algorithm. in-place. Radix-2, Decimation in Time (DIT).

```javascript
fourier.custom.fft_<type>_<size>_<mode>
```
 - type: `f32` or `f64`
 - size: `16`, `32`, ... `1048576`
 - mode: 'raw' or `asm`

example:
```javascript
// Init
var stdlib = {
    Math: Math,
    Float32Array: Float32Array,
    Float64Array: Float64Array
};

// Create heap for the fft data and twiddle factors
var heap = fourier.custom.alloc(65536, 3);

// Create instance of FFT runner
var fft_f64_65536_asm_runner = fourier.custom.fft_f64_65536_asm(stdlib, null, heap);

// Init twiddle factors
fft_f64_65536_asm_runner.init();

// Run transformations
fft_f64_65536_asm_runner.transform();
```

#### Other

```javascript
fourier.dft(realArray, imagArray); // ⇒ [realArray, imagArray]
```

<a href="http://www.codecogs.com/eqnedit.php?latex=X_k=\sum_{n=0}^{N-1}x_n\cdot&space;e^{-i&space;2&space;\pi&space;k&space;n/N}" target="_blank"><img src="http://latex.codecogs.com/svg.latex?X_k=\sum_{n=0}^{N-1}x_n\cdot&space;e^{-i&space;2&space;\pi&space;k&space;n/N}" title="X_k=\sum_{n=0}^{N-1}x_n\cdot e^{-i 2 \pi k n/N}" /></a>


```javascript
fourier.idft(realArray, imagArray); // ⇒ [realArray, imagArray]
```
<a href="http://www.codecogs.com/eqnedit.php?latex=\large&space;x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot&space;e^{i&space;2&space;\pi&space;kn/N}" target="_blank"><img src="http://latex.codecogs.com/svg.latex?\large&space;x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot&space;e^{i&space;2&space;\pi&space;kn/N}" title="\large x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k\cdot e^{i 2 \pi kn/N}" /></a>




### Testing

`grunt mocha`

## License

MIT [LICENSE](https://github.com/drom/fourier/blob/master/LICENSE).
