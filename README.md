# LU Factorization Without Pivoting Calculator
Calculator for performing an LU factorization without pivoting of a matrix.

## Using

* Here, LU factorization refers to the factorization of a matrix *A* into a unit lower triangular matrix *L* and an upper triangular matrix *U*.
* Input a matrix as you would for a 2D array in JavaScript. E.g., to factorize the identity matrix of size 3 input `[[1,0,0],[0,1,0],[0,0,1]]`.
* If a matrix has infinitely many LU factorizations, then elements that can be any complex number will be shown as α<sub>1</sub>, α<sub>2</sub>, ..., α<sub>n</sub>, where *n* is the total number of such elements.
* If a matrix has no possible factorization, then an approximation will be made by performing a factorization on a copy of the matrix with the elements that prevent the factorization from materializing incremented by ε.

## Credits

* [Nerdamer](https://nerdamer.com/) is used to evaluate the math
* [MathJax](https://www.mathjax.org/) is used to display the math
* Approach to obtain all LU factorizations comes from Froilán M. Dopico, Charles R. Johnson, and Juan M. Molera, *Multiple LU factorizations of a singular matrix*, Linear Algebra and its Applications. **419** (2006), no. 1, 24–36, DOI 10.1016/j.laa.2006.03.043.
* Approach to approximate LU comes from Ly Jacky Nhiayi and Tuyetdong Phan-Yamada, *Examining Possible LU Decompositions*, North American GeoGebra Journal. **9** (2021), no. 1, 1–7.
