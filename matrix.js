
class Matrix {
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.matrix = (new Array(rows).fill(0)).map(x => (new Array(cols).fill(0)));
    }

    static fromArray(a) {
        /**
         * Creates matrix out of an array
         * @return Matrix
         */
        let result = new Matrix(a.length, 1);
        for (let i = 0; i < a.length; i++) {
            result.matrix[i][0] = a[i];
        }
        return result;
    }

    static random(rows, cols) {
        /**
         * Generates random Matrix
         * values between -1 and 1
         * @return Matrix
         */
        let result = new Matrix(rows, cols);
        result.randomize();
        return result;
    }

    static transpose(a) {
        /**
         * Transpose matrix a
         * @return Matrix
         */
         let result = new Matrix(a.cols, a.rows);
         for (let i = 0; i < a.rows; i++) {
             for (let j = 0; j < a.cols; j++) {
                 result.matrix[j][i] = a.matrix[i][j];
             }
         }
         return result;
    }

    static add(a, b) {
        /**
         * Matrix add function
         * @param a     Matrix
         * @param b     Matrix or Number
         * @return Matrix
         */
        let result;
        if ( b instanceof Matrix ) {
            result = new Matrix(a.rows, a.cols);
            for (let i = 0; i < a.rows; i++){
                for (let j = 0; j < a.cols; j++){
                    result.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
                }
            }
        } else {
            result = new Matrix(a.rows, a.cols);
            result.matrix = a.matrix.map(row => row.map(x => x + b));
        } return result;
    }

    static subtract(a, b) {
        // negates array b and uses add function to calculate substraction
        let c = new Matrix(b.rows, b.cols);
        c.matrix = b.matrix.slice();
        c.map(x=>0-x);
        return Matrix.add(a, c);
    }

    static multiply(a, b) {
        /**
         * Multiply a and b
         * @param a     Matrix
         * @param b     Matrix or Number
         * @return Matrix
         */
        let result;
        if ( b instanceof Matrix ) {
            result = new Matrix(a.rows, b.cols);
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < a.cols; k++) {
                        sum += a.matrix[i][k] * b.matrix[k][j];
                    }
                    result.matrix[i][j] = sum;
                }
            }
        } else {
            result = new Matrix(a.rows, a.cols);
            result.matrix = a.matrix.map(x => x.map(y => y *= b));
        } return result;
    }

    static map(m, foo) {
        let result = new Matrix(m.rows, m.cols);
        result.matrix = m.matrix.map(row => row.map(x => foo(x)));
        return result;
    }

    copy() { return this.matrix.map(x => x); }

    map(foo) { this.matrix = this.matrix.map(row => row.map(x => foo(x))); }

    randomize() { this.matrix = this.matrix.map(x => x.map(y => Math.random() * 2 - 1)); }

    print() { console.table(this.matrix); }

    toArray() {
        let arr = [];
        this.matrix.forEach(x => x.forEach(y => arr.push(y)));
        return arr;
    }
}
