#!/usr/bin/env node

'use strict';

const template = require('lodash.template');
const fs = require('fs');
const path = require('path');

fs.readFile(
  path.resolve(__dirname, '../src/fft-radix4-template.js'),
  { encoding: 'utf8' },
  function (err, data) {
    if (err) { throw err; }
    const t = template(data);
    console.log(t({
      asms: [false],
      bases: [3],
      sizes: [4, 2, 10, 6]
    }));
  }
);
