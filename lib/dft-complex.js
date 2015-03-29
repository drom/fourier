'use strict';

/**

Complex DFT.
Assumes `inpReal` and `inpImag` arrays have the same size.

*/
module.exports = function (inpReal, inpImag) {
    var n,
        k,
        t,
        angle,
        sina,
        cosa,
        outReal = [],
        outImag = [],
        sumReal,
        sumImag;

    n = inpReal.length;
    for (k = 0; k < n; k++) {
        sumReal = 0;
        sumImag = 0;
        for (t = 0; t < n; t++) {
            angle = 2 * Math.PI * t * k / n;
            sina = Math.sin(angle);
            cosa = Math.cos(angle);
            sumReal +=  inpReal[t] * cosa + inpImag[t] * sina;
            sumImag += -inpReal[t] * sina + inpImag[t] * cosa;
        }
        outReal.push(sumReal);
        outImag.push(sumImag);
    }
    return [outReal, outImag];
};
