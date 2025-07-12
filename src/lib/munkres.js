// This file is a manual bundle of the @munkres/munkres library,
// designed to work as a single ES module in the browser.

function bigMunkres(matrix) {
  const G = matrix.map((row) => [...row]);
  const R = G.length;
  const C = G[0].length;

  const u = new Array(R).fill(0n);
  const v = new Array(C).fill(0n);
  const ind = new Array(C).fill(-1);

  for (let i = 0; i < R; ++i) {
    const p = new Array(C).fill(i);
    const w = new Array(C).fill(Infinity);

    let j = 0;
    let l = 0;
    let s = 0;

    do {
      s = j;
      const i0 = p[s];
      let j1 = -1;
      let min = Infinity;

      for (j = l; j < C; ++j) {
        const h = G[i0][j] - u[i0] - v[j];
        if (h < w[j]) {
          w[j] = h;
          p[j] = i0;
        }

        if (w[j] < min) {
          min = w[j];
          j1 = j;
        }
      }

      for (j = 0; j < l; ++j) {
        if (w[j] < min) {
          min = w[j];
          j1 = j;
        }
      }

      const h = min;
      for (let s = 0; s < C; ++s) {
        if (ind[s] < 0) w[s] -= h;
      }
      u[i] += h;

      let j2;
      for (j = l; j < C; ++j) {
        if (w[j] === 0n) {
          j2 = ind[j];
          if (j2 < 0) {
            l = j;
            do {
              ind[l] = p[l];
              j2 = l;
              l = ind[j2];
              ind[j2] = j2;
            } while (p[l] !== i);
            j = C;
          } else {
            for (let s = 0; s < C; ++s) {
              if (ind[s] === j2) {
                w[s] += h;
              }
            }
            w[j] = Infinity;
            p[j] = -1;
          }
        }
      }
    } while (ind[l] >= 0);
  }

  const res = [];
  for (let j = 0; j < C; ++j) {
    if (ind[j] >= 0) res.push([ind[j], j]);
  }
  return res;
}

function munkres(matrix) {
  const isBig = matrix.some((r) => r.some((c) => typeof c === 'bigint'));
  if (isBig) return bigMunkres(matrix);

  const G = matrix.map((row) => [...row]);
  const R = G.length;
  const C = G[0].length;

  const u = new Array(R).fill(0);
  const v = new Array(C).fill(0);
  const ind = new Array(C).fill(-1);

  for (let i = 0; i < R; ++i) {
    const p = new Array(C).fill(i);
    const w = new Array(C).fill(Infinity);

    let j = 0;
    let l = 0;
    let s = 0;

    do {
      s = j;
      const i0 = p[s];
      let j1 = -1;
      let min = Infinity;

      for (j = l; j < C; ++j) {
        const h = G[i0][j] - u[i0] - v[j];
        if (h < w[j]) {
          w[j] = h;
          p[j] = i0;
        }

        if (w[j] < min) {
          min = w[j];
          j1 = j;
        }
      }

      for (j = 0; j < l; ++j) {
        if (w[j] < min) {
          min = w[j];
          j1 = j;
        }
      }

      const h = min;
      for (let s = 0; s < C; ++s) {
        if (ind[s] < 0) w[s] -= h;
      }
      u[i] += h;

      let j2;
      for (j = l; j < C; ++j) {
        if (Math.abs(w[j]) < 1e-9) {
          j2 = ind[j];
          if (j2 < 0) {
            l = j;
            do {
              const i1 = p[l];
              ind[l] = i1;
              const j1 = l;
              l = ind[i1];
              ind[i1] = j1;
            } while (i1 !== i);
            j = C;
          } else {
            for (let s = 0; s < C; ++s) {
              if (ind[s] === j2) {
                w[s] += h;
              }
            }
            w[j] = Infinity;
            p[j] = -1;
          }
        }
      }
    } while (ind[l] >= 0);
  }

  const res = [];
  for (let j = 0; j < C; ++j) {
    if (ind[j] >= 0) res.push([ind[j], j]);
  }
  return res;
}

export { munkres as default, munkres };