class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.__initialize__();
    }

    __initialize__() {
        this.value = [];
        for (let i = 0; i < this.rows; i++) {
            this.value[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.value[i][j] = 0;
            }
        }
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let randomVal = Math.random();
                this.value[i][j] = randomVal - 0.5;
            }
        }
    }

    static transpose(matrix) {
        let newMatrix = new Matrix(matrix.cols, matrix.rows);
        for (let i = 0; i < newMatrix.rows; i++) {
            for (let j = 0; j < newMatrix.cols; j++) {
                newMatrix.value[i][j] = matrix.value[j][i];
            }
        }
        return newMatrix;
    }

    add(val) {
        if (val instanceof Matrix) {
            if (val.rows !== this.rows && val.cols !== this.cols) {
                console.error("Dimensions of both matrices must be same");
                return undefined;
            }
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.value[i][j] += val.value[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.value[i][j] += val;
                }
            }
        }
    }

    static add(a, b) {
        if (a.rows !== b.rows && a.cols !== b.cols) {
            console.error("Dimensions of both matrices must be same");
            return undefined;
        }

        let resMatrix = new Matrix(a.rows, a.cols);
        for (let i = 0; i < resMatrix.rows; i++) {
            for (let j = 0; j < resMatrix.cols; j++) {
                resMatrix.value[i][j] = a.value[i][j] + b.value[i][j];
            }
        }
        return resMatrix;
    }

    multiply(val) {
        if (val instanceof Matrix) {
            if (val.rows !== this.rows && val.cols !== this.cols) {
                console.error("Dimensions of both matrices must be same");
                return undefined;
            }
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.value[i][j] *= val.value[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.value[i][j] *= val;
                }
            }
        }
    }

    static multiply(a, b) {
        if (a.cols != b.rows) {
            console.error("Columns of 1st Matrix must be equal to Rows of 2nd Matrix");
            return undefined;
        }

        let resMatrix = new Matrix(a.rows, b.cols);
        for (let i = 0; i < resMatrix.rows; i++) {
            for (let j = 0; j < resMatrix.cols; j++) {
                let sum = 0;
                for (let k = 0; k < b.rows; k++) {
                    sum += a.value[i][k] * b.value[k][j];
                }
                resMatrix.value[i][j] = sum;
            }
        }
        return resMatrix;
    }

    map(func, params) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.value[i][j] = func(this.value[i][j], params);
            }
        }
    }

    static map(matrix, func, params) {
        let mapMatrix = new Matrix(matrix.rows, matrix.cols)
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                mapMatrix.value[i][j] = func(matrix.value[i][j], params);
            }
        }

        return mapMatrix;
    }

    addRow(initialValue) {
        for (let i = 0; i < this.cols; i++) {
            this.value[this.rows] = [];
            this.value[this.rows][i] = 1;
            this.rows++;
        }
    }

    copy(){
        let dupMatrix = new Matrix(this.rows, this.cols);
        for (let i = 0; i < dupMatrix.rows; i++) {
            for (let j = 0; j < dupMatrix.cols; j++) {
                dupMatrix.value[i][j] = this.value[i][j];
            }
        }
        return dupMatrix;
    }

    static toMatrix(array) {
        let matrix = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            matrix.value[i][0] = array[i];
        }
        return matrix;
    }

    static toArray(matrix) {
        let array = [];
        for (let i = 0; i < matrix.rows; i++) {
            array[i] = matrix.value[i][0];
        }
        return array;
    }
}