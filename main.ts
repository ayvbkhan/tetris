import {shapes} from "./shapes.js"

function drawTetrisPlayground(x: number, y: number, target: HTMLElement) {
    if (x <= 0 || y <= 0) throw new Error('x and y cannot be negative')

    if (target.children.length) throw new Error('Aborted: target element should be empty')

    for (let rowsCount = 0; rowsCount < y; rowsCount++) {
        const row = document.createElement('div')
        row.className = 'row'
        row.dataset['row'] = rowsCount.toString()
        row.style.transform = `translateY(${-rowsCount}px)`


        for (let cellsCount = 0; cellsCount < x; cellsCount++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            cell.dataset['cell'] = cellsCount.toString()
            cell.style.transform = `translateX(${-cellsCount}px)`
            row.append(cell)
        }

        target.append(row)
    }
}

const tetrisPlaygroundTarget = document.querySelector('.tetris-playground') as HTMLElement | null;

try {
    drawTetrisPlayground(10, 20, tetrisPlaygroundTarget)
} catch (e) {
    console.log(e.message)
}

const shapeKeys = Object.keys(shapes)

const shapeKeyIndex = Math.floor(Math.random() * shapeKeys.length)

const shapeKey = shapeKeys[shapeKeyIndex] as keyof typeof shapes;

const currentShape = shapes[shapeKey]

function renderShape() {
    const rowsToColor = currentShape.shape.length
    const cellsToColor = currentShape.shape[0].length

    for (let rowIndex = 0; rowIndex < rowsToColor; rowIndex++) {
        const row = tetrisPlaygroundTarget?.children[rowIndex] as HTMLElement | undefined;

        for (let cellIndex = 0; cellIndex < cellsToColor; cellIndex++) {
            const cell = row.children[cellIndex] as HTMLElement | undefined;
            if (currentShape.shape[rowIndex][cellIndex]) {
                cell.style.backgroundColor = currentShape.color
            }
        }
    }
}


function rotateShape(shape: number[][]): number[][] {
    if (shape.length === 2 && shape[0].length === 2) return shape;

    const rotatedShape: number[][] = Array.from({ length: shape[0].length }, () => []);

    for (let i = shape.length - 1, k = 0; i >= 0; i--, k++) {
        for (let j = 0; j < shape[0].length; j++) {
            rotatedShape[j][k] = shape[i][j];
        }
    }

    return rotatedShape;
}

function removePreviousShape(): void {
    const rowsToClear = tetrisPlaygroundTarget.children.length;
    const cellsToClear = (tetrisPlaygroundTarget.children[0] as HTMLElement).children.length;

    for (let rowIndex = 0; rowIndex < rowsToClear; rowIndex++) {
        const row = tetrisPlaygroundTarget.children[rowIndex] as HTMLElement;

        for (let cellIndex = 0; cellIndex < cellsToClear; cellIndex++) {
            const cell = row.children[cellIndex] as HTMLElement;
            cell.style.backgroundColor = ''; 
        }
    }
}
 

renderShape()

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        currentShape.shape = rotateShape(currentShape.shape)
        removePreviousShape()
        renderShape()
    }
})