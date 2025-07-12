// This is a robust, single-file implementation of the Hungarian Algorithm.
// It is self-contained and has no external dependencies.
export function hungarian(matrix) {
    const R = matrix.length;
    const C = matrix[0].length;
    const G = Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => matrix[r][c]));

    let u = new Array(R).fill(0);
    let v = new Array(C).fill(0);
    let p = new Array(C).fill(0);
    let ind = new Array(C).fill(-1);

    for (let i = 0; i < R; i++) {
        let j0 = 0;
        let i0 = i;
        let minv = Array(C).fill(Infinity);
        let used = new Array(C).fill(false);
        do {
            used[j0] = true;
            let i0 = p[j0], delta = Infinity, j1;
            for (let j = 0; j < C; j++) {
                if (!used[j]) {
                    let cur = G[i0][j] - u[i0] - v[j];
                    if (cur < minv[j]) {
                        minv[j] = cur;
                        p[j] = i0;
                    }
                    if (minv[j] < delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            for (let j = 0; j < C; j++) {
                if (used[j]) {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (ind[j0] !== -1);
        do {
            let j1 = ind[p[j0]];
            ind[j0] = p[j0];
            j0 = j1;
        } while (j0 !== -1);
    }

    const assignments = [];
    for (let j = 0; j < C; j++) {
        if (ind[j] !== -1) {
            assignments.push([ind[j], j]);
        }
    }
    return assignments;
}