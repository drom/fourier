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

fourier.dft([0, 1, 2, 3], [0, 0, 0, 0]);

=> [
     [ 6, -2.0000000000000004, -2, -1.9999999999999984 ],
     [ 0, 1.9999999999999998, -7.34788079488412e-16, -2.000000000000001 ]
   ]
```

### Testing

`grunt mocha`
