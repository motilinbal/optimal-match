// A simple, clean, and reliable implementation of the Hungarian Algorithm.
// This version is designed for clarity and robustness.
export function hungarian(matrix) {
    const R = matrix.length;
    const C = matrix[0].length;
    
    // Ensure the matrix is square by padding, as this algorithm requires it.
    const dim = Math.max(R, C);
    const cost = Array.from({ length: dim }, () => new Array(dim).fill(Infinity));
    for (let i = 0; i < R; i++) {
        for (let j = 0; j < C; j++) {
            cost[i][j] = matrix[i][j];
        }
    }

    let u = new Array(dim).fill(0);
    let v = new Array(dim).fill(0);
    let p = new Array(dim).fill(0);
    let way = new Array(dim).fill(0);

    for (let i = 1; i <= dim; i++) {
        p[0] = i;
        let j0 = 0;
        let minv = Array(dim + 1).fill(Infinity);
        let used = new Array(dim + 1).fill(false);
        do {
            used[j0] = true;
            let i0 = p[j0], delta = Infinity, j1;
            for (let j = 1; j <= dim; j++) {
                if (!used[j]) {
                    let cur = cost[i0 - 1][j - 1] - u[i0 - 1] - v[j - 1];
                    if (cur < minv[j]) {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if (minv[j] < delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            for (let j = 0; j <= dim; j++) {
                if (used[j]) {
                    u[p[j0] - 1] += delta;
                    v[j - 1] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (p[j0] !== 0);
        do {
            let j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }

    let assignments = [];
    for (let j = 1; j <= dim; j++) {
        if (p[j]) {
            // Filter out pairs that were part of the padding
            if (p[j] - 1 < R && j - 1 < C) {
                 assignments.push([p[j] - 1, j - 1]);
            }
        }
    }
    return assignments;
}