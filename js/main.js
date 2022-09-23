/*----- constants -----*/ 
const DIFFICULTIES = {
    EASY: {ROWS: 9, COLS: 9, MINES: 10},
    MEDIUM: {ROWS: 16, COLS: 16, MINES: 40},
    HARD: {ROWS: 24, COLS: 24, MINES: 10},
}
const STATES = {
    HIDDEN: 'hidden',
    FLAGGED: 'flagged',
    MINE: 'mine',
    NUMBER: 'number',
}


/*----- app's state (variables) -----*/ 
const minefield = {
    numRows: DIFFICULTIES.EASY.ROWS, 
    numCols: DIFFICULTIES.EASY.COLS,

    numMines: DIFFICULTIES.EASY.MINES,
    currentMines: DIFFICULTIES.EASY.MINES,

    numRevealed: 0,

    cells: [],
    mineLocations: [],
}

let cheatsEnabled = false

let gameOver = false
let winner = false

/*----- cached element references -----*/ 
const minefieldEl = document.querySelector('.minefield')
const mineCountEl = document.querySelector('.mine-count')
const titleEl = document.querySelector('h1')


// Buttons
const quickResetBtnEl = document.querySelector('.quick-reset')
const customResetBtnEl = document.querySelector('.custom-reset')


/*----- event listeners -----*/ 
// Minefield
minefieldEl.addEventListener('click', handleBoardLeftClick)
minefieldEl.addEventListener('contextmenu', handleBoardRightClick)

// Footer buttons
quickResetBtnEl.addEventListener('click', handleResetClick)
customResetBtnEl.addEventListener('click', handleCustomResetClick)


/*----- functions -----*/
function setDifficulty(difficulty) {
    minefield.numRows = DIFFICULTIES[difficulty].ROWS
    minefield.numCols = DIFFICULTIES[difficulty].COLS

    minefield.numMines = DIFFICULTIES[difficulty].MINES
    minefield.currentMines = DIFFICULTIES[difficulty].MINES

    //render new minefield size in DOM
    // get root element
    let r = document.querySelector(':root')

    r.style.setProperty('--row-num', DIFFICULTIES[difficulty].ROWS)
    r.style.setProperty('--col-num', DIFFICULTIES[difficulty].COLS)
}


function handleBoardLeftClick(evt) {
    quickResetBtnEl.disabled = false

    const targetCell = evt.target
    if(!gameOver) {
        if(targetCell.classList.contains('cell')) {
            const targetCellIdx = targetCell.classList[4].substring(1)
            const tmpCellState = targetCell.classList[1]
    
            if(tmpCellState === STATES.HIDDEN) {
                if(!checkForMine(targetCell)) {
                    targetCell.innerText = minefield.cells[targetCellIdx].number
                    
                    if(++minefield.numRevealed === minefield.numCols * minefield.numRows - minefield.numMines) {
                        winner = true
                        gameOver = true
                    }
                } else {
                    gameOver = true
                }
                if(gameOver) {
                    renderGameOver()
                }
            }
        }
    }
}

function checkForMine(targetCell) {
    const cellIdx = targetCell.classList[4].substring(1)

    if(minefield.cells[cellIdx].mine === true) {
        targetCell.classList.replace(STATES.HIDDEN, STATES.MINE)
        return true
    } else {
        targetCell.classList.replace(STATES.HIDDEN, STATES.NUMBER)
        return false
    }
}

function handleBoardRightClick(evt) {
    evt.preventDefault()

    if(!gameOver) {
        quickResetBtnEl.disabled = false
    
        const targetCell = evt.target
    
        if(targetCell.classList.contains('cell')) {
            const tmpCellState = targetCell.classList[1]
    
            if(tmpCellState === STATES.HIDDEN) {
                targetCell.classList.replace(tmpCellState, STATES.FLAGGED)
                minefield.currentMines--
            } else if(tmpCellState === STATES.FLAGGED) {
                targetCell.classList.replace(tmpCellState, STATES.HIDDEN)
                minefield.currentMines++
            }
            
            renderMineCountEl()
    
            mineCountEl.textContent = minefield.currentMines
        }
    }
}

function renderMineCountEl() {
    if(minefield.currentMines === 0) {
        mineCountEl.style.color = 'green'
    } else if(minefield.currentMines < 0) {
        mineCountEl.style.color = 'red'
    } else {
        mineCountEl.style.color = 'black'
    }
}

function handleResetClick(evt) {
    renderMinefield()
}

function handleCustomResetClick(evt) {
    console.log(evt.target)
}

function renderMinefield() {
    resetMinefield()

    createCells()

    renderCells()
}

function resetMinefield() {
    // Reset quick reset button
    quickResetBtnEl.disabled = true
    
    // Reset mineCountEl color
    mineCountEl.style.color = 'black'

    // Reset gameOver
    gameOver = false
    winner = false

    // Remove win/lose message
    titleEl.innerText = 'Minesweeper'

    // set number of revealed cells back to zero
    minefield.numRevealed = 0

    // Set mineIdxs equal to starting amount
    mineCountEl.innerHTML = minefield.numMines
    minefield.currentMines = minefield.numMines

    // Destroy all previous cells, if any
    minefield.cells = []
    minefield.mineLocations = []

    // Remove all previous cell divs
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
}

function createCells() {
    for(let i = 0; i < minefield.numRows * minefield.numCols; i++) {
        const tmpCoord = convertToCoord(i)
        // const c = i % minefield.numCols
        // const r = Math.floor(i / minefield.numCols)

        const cellDiv = document.createElement('div')
        cellDiv.classList.add('cell', STATES.HIDDEN, `c${tmpCoord.x}`, `r${tmpCoord.y}`, `i${i}`)

        const cell = {
            cellDiv,
            c: tmpCoord.x,
            r: tmpCoord.y,
            i,
            state: STATES.HIDDEN,
            mine: false,
            neighbors: {
                nw: null, 
                n: null, 
                ne: null, 
                w: null, 
                e: null, 
                sw: null, 
                s: null, 
                se: null
            },
            number: null,
        }

        minefield.cells.push(cell)
    }

    setMineLocations()

    setNeighbors()

    setNumbers()
}

function setNeighbors() {

    // flip this from x, y -> i to i -> x, y. Might solve the wrapping neighbor bug

    for(let c = 0; c < minefield.numCols; c++) {
        for(let r = 0; r < minefield.numRows; r++) {
            const tmpIdx = convertToIndex(c, r)

            const imaginaryNeighbor = {mine: false}

            // nw neighbor
            let tmpCell = minefield.cells[convertToIndex(c - 1, r - 1)]
            minefield.cells[tmpIdx].neighbors.nw = tmpCell ? tmpCell : imaginaryNeighbor
            // n neighbor
            tmpCell = minefield.cells[convertToIndex(c, r - 1)]
            minefield.cells[tmpIdx].neighbors.n = tmpCell ? tmpCell : imaginaryNeighbor
            // ne neighbor
            tmpCell = minefield.cells[convertToIndex(c + 1, r - 1)]
            minefield.cells[tmpIdx].neighbors.ne = tmpCell ? tmpCell : imaginaryNeighbor
            // w neighbor
            tmpCell = minefield.cells[convertToIndex(c - 1, r)]
            minefield.cells[tmpIdx].neighbors.w = tmpCell ? tmpCell : imaginaryNeighbor
            // e neighbor
            tmpCell = minefield.cells[convertToIndex(c + 1, r)]
            minefield.cells[tmpIdx].neighbors.e = tmpCell ? tmpCell : imaginaryNeighbor
            // sw neighbor
            tmpCell = minefield.cells[convertToIndex(c - 1, r + 1)]
            minefield.cells[tmpIdx].neighbors.sw = tmpCell ? tmpCell : imaginaryNeighbor
            // s neighbor
            tmpCell = minefield.cells[convertToIndex(c, r + 1)]
            minefield.cells[tmpIdx].neighbors.s = tmpCell ? tmpCell : imaginaryNeighbor
            // se neighbor
            tmpCell = minefield.cells[convertToIndex(c + 1, r + 1)]
            minefield.cells[tmpIdx].neighbors.se = tmpCell ? tmpCell : imaginaryNeighbor
        }
    }
}

function setNumbers() {
    // loop through all cells
    for(let c = 0; c < minefield.numCols; c++) {
        for(let r = 0; r < minefield.numRows; r++) {
            let mineCount = 0;
            const tmpIdx = convertToIndex(c, r)
            
            mineCount += minefield.cells[tmpIdx].neighbors.nw.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.n.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.ne.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.w.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.e.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.sw.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.s.mine ? 1 : 0
            mineCount += minefield.cells[tmpIdx].neighbors.se.mine ? 1 : 0

            minefield.cells[tmpIdx].number = mineCount
        }
    }
}

function convertToIndex(x, y) {
    return (minefield.numCols * (y + 1)) - (minefield.numCols - x)
}
function convertToCoord(i) {
    const y = Math.floor(i / minefield.numCols)
    const x = i - (minefield.numCols * y)

    return {x, y}
}

function setMineLocations() {
    for(let i = 0; i < minefield.numMines; i++) {
        let tmpMineIdx = randomUntakenCellIdx((minefield.numRows * minefield.numCols) - 1)
        minefield.cells[tmpMineIdx].mine = true
        minefield.mineLocations.push(tmpMineIdx)
    }
    if(cheatsEnabled) console.log(minefield.mineLocations)
}

function randomUntakenCellIdx(max) {
    let tmpIdx = Math.floor(Math.random() * max)

    while(minefield.mineLocations.some(mineIdx => mineIdx === tmpIdx)) {
        tmpIdx = Math.floor(Math.random() * max)
    }

    return tmpIdx
}

function renderCells() {
    for(let i = 0; i < minefield.cells.length; i++) {
        minefieldEl.appendChild(minefield.cells[i].cellDiv)
    }
}

function renderGameOver() {
    if(winner) {
        titleEl.innerText = 'Winner!'
    } else {
        titleEl.innerText = 'Try again...'
    }
}

function init() {
    renderMinefield()
}


// GAME START

init()