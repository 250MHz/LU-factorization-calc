# LU Factorization Without Pivoting Calculator
Calculator for performing an LU factorization without pivoting of a square matrix.

## Using

* Here, LU factorization refers to the factorization of a square matrix A into a unit lower triangular matrix *L* and an upper triangular matrix *U*.
* Input a matrix as you would for a 2D array in JavaScript. E.g., to factorize the identity matrix of size 3 input `[[1,0,0],[0,1,0],[0,0,1]]`.
* If a matrix has infinitely many LU factorizations, then elements that can be any complex number will be shown as c<sub>1</sub>, c<sub>2</sub>, ..., c<sub>n</sub>, where *n* is the total number of such elements.
* If a matrix has no possible factorization, then an approximation will be made by performing a factorization on a similar matrix with the elements that prevent the factorization from materializing incremented by 1e-8.

## Credits

* [Nerdamer](https://nerdamer.com/) is used to evaluate the math
* [MathJax](https://www.mathjax.org/) is used to display the math
