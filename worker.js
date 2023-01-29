self.importScripts("nerdamer.core.js");

function isZeroRow(M, row) {
  for (let i = 0; i < nerdamer.size(M).symbol[0].multiplier.num.value; i++) {
    if (!nerdamer.matget(M, row, i).eq(0)) {
      return false;
    }
  }
  return true;
}

function RRMCF(A) {
  let U_0 = A;
  let m = nerdamer.size(U_0).symbol[1].multiplier.num.value; // number of rows
  let n = nerdamer.size(U_0).symbol[0].multiplier.num.value; // number of cols
  let L_0 = nerdamer(`imatrix(${m})`);
  let k = 0;
  for (let i = 0; i < m; i++) {
    if (!isZeroRow(U_0, i)) {
      k++;
      let r_k = i;
      let c_k = -1;
      for (let c = 0; c < n; c++) {
        if (!nerdamer.matget(U_0, r_k, c).eq(0)) {
          c_k = c; // column index of leading entry of row r_k
          break;
        }
      }
      for (let j = r_k + 1; j < m; j++) {
        let multiple = nerdamer(`-matget(${U_0}, ${j}, ${c_k}) / matget(${U_0}, ${r_k}, ${c_k})`);
        U_0 = nerdamer(`matset(imatrix(${m}), ${j}, ${r_k}, ${multiple}) * ${U_0}`); // add multiple*U_0[row_k] to U_0[row_j] 
        L_0 = nerdamer(`matset(${L_0}, ${j}, ${r_k}, -${multiple})`); // store multiple in L_0
      }
    }
  }
  return [L_0, U_0];
}

function leadingEntries(M) {
  let res = [];
  for (let r = 0; r < nerdamer.size(M).symbol[1].multiplier.num.value; r++) {
    for (let c = 0; c < nerdamer.size(M).symbol[0].multiplier.num.value; c++) {
      if (!nerdamer.matget(M, r, c).eq(0)) {
        res.push([r, c]);
        break;
      }
    }
  }
  return res;
}

function getValidParts(matrixString) {
  let A;
  try {
    A = nerdamer(`matrix(${matrixString.slice(1, -1)})`);
  } catch (e) {
    // improper format for matrixString
    return null;
  }
  let AHasChanged = false;
  let L_0, U_0;
  outer: while (true) {
    [L_0, U_0] = RRMCF(A);
    for ([r, c] of leadingEntries(U_0)) {
      if (r > c) {
        // U_0 from RRMCF is not upper triangular, so no factorization possible
        A = nerdamer(`matset(${A}, ${c}, ${c}, matget(${A}, ${c}, ${c}) + ε)`);
        AHasChanged = true;
        continue outer;
      }
    }
    break;
  }
  return [A, L_0, U_0, AHasChanged];
}

function buildLStar(L_0, leadingEntries) {
  let L_star = L_0;
  let r = [];
  let c = [];
  for ([r_k, c_k] of leadingEntries) {
    r.push(r_k);
    c.push(c_k);
  }
  let m = nerdamer.size(L_star).symbol[0].multiplier.num.value; // num of cols (same as num of rows b/c L_0 is square)
  let arbCount = 0;
  for (let j = 0; j < m; j++) {
    if (r.includes(j) && j > c[r.indexOf(j)]) {
      continue;
    } else if (!r.includes(j) || (r.includes(j) && c[r.indexOf(j) >= m])) {
      for (let i = j + 1; i < m; i++) {
        L_star = nerdamer(`matset(${L_star}, ${i}, ${j}, α_${++arbCount})`);
      }
    } else { // r.includes(j) && c[r.indexOf(j)] < m
      let conditionNum = c[r.indexOf(j)] + 1;
      for (let i = j + 1; i < conditionNum; i++) {
        L_star = nerdamer(`matset(${L_star}, ${i}, ${j}, α_${++arbCount})`);
      }
      for (let i = conditionNum; i < m; i++) {
        L_star = nerdamer(`matset(${L_star}, ${i}, ${j}, 0)`);
      }
    }
  }
  return L_star;
}

function getResults(matrixString) {
  let A, L_0, U_0, AHasChanged;
  let x = getValidParts(matrixString);
  if (x === null) {
    return null;
  } else {
    [A, L_0, U_0, AHasChanged] = x;
  }
  L_star = buildLStar(L_0, leadingEntries(U_0));
  L_starInverse = nerdamer.invert(L_star);
  let L = L_0.multiply(L_starInverse);
  let U = L_star.multiply(U_0);
  return {
    AString: `\\begin{b${A.toTeX().slice(8, -8)}bmatrix}`,
    LString: `\\begin{b${L.toTeX().slice(8, -8)}bmatrix}`,
    UString: `\\begin{b${U.toTeX().slice(8, -8)}bmatrix}`,
    L_0String: `\\begin{b${L_0.toTeX().slice(8, -8)}bmatrix}`,
    L_starInverseString: `\\begin{b${L_starInverse.toTeX().slice(8, -8)}bmatrix}`,
    L_starString: `\\begin{b${L_star.toTeX().slice(8, -8)}bmatrix}`,
    U_0String: `\\begin{b${U_0.toTeX().slice(8, -8)}bmatrix}`,
    APlaintext: `[${A.toString().slice(7, -1)}]`,
    LPlaintext: `[${L.toString().slice(7, -1)}]`,
    UPlaintext: `[${U.toString().slice(7, -1)}]`,
    L_0Plaintext: `[${L_0.toString().slice(7, -1)}]`,
    L_starInversePlaintext: `[${L_starInverse.toString().slice(7, -1)}]`,
    L_starPlaintext: `[${L_star.toString().slice(7, -1)}]`,
    U_0Plaintext: `[${U_0.toString().slice(7, -1)}]`,
    OriginalAString: AHasChanged ? `\\begin{b${nerdamer(`matrix(${matrixString.slice(1, -1)})`).toTeX().slice(8, -8)}bmatrix}`: null
  }
}

onmessage = async (e) => {
  console.log("Message received from main script");
  let results = getResults(e.data);
  console.log("Posting message back to main script");
  postMessage(results);
}
