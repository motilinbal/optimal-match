// A simple, robust, and readable implementation of the Hungarian Algorithm.
// It correctly handles rectangular matrices without requiring padding.
export function hungarian(matrix) {
    const R = matrix.length;
    const C = matrix[0].length;
    
    // Create a copy of the matrix
    const cost = matrix.map(row => [...row]);
    
    // Arrays for the algorithm
    const u = new Array(R + 1).fill(0);
    const v = new Array(C + 1).fill(0);
    const p = new Array(C + 1).fill(0);
    const way = new Array(C + 1).fill(0);
    
    for (let i = 1; i <= R; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = new Array(C + 1).fill(Infinity);
        const used = new Array(C + 1).fill(false);
        
        do {
            used[j0] = true;
            const i0 = p[j0];
            let delta = Infinity;
            let j1 = 0;
            
            for (let j = 1; j <= C; j++) {
                if (!used[j]) {
                    const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
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
            
            for (let j = 0; j <= C; j++) {
                if (used[j]) {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            
            j0 = j1;
        } while (p[j0] !== 0);
        
        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }
    
    const result = [];
    for (let j = 1; j <= C; j++) {
        if (p[j] !== 0) {
            result.push([p[j] - 1, j - 1]);
        }
    }
    
    return result;
}