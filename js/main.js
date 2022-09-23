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

    cells: [],
    mineLocations: [],
}

let cheatsEnabled = true

/*----- cached element references -----*/ 
const minefieldEl = document.querySelector('.minefield')
const mineCountEl = document.querySelector('.mine-count')


// Buttons
const quickResetBtnEl = document.querySelector('.quick-reset')
const customResetBtnEl = document.querySelector('.custom-reset')
const rulesBtnEl = document.querySelector('.rules')


/*----- event listeners -----*/ 
// Minefield
minefieldEl.addEventListener('click', handleBoardLeftClick)
minefieldEl.addEventListener('contextmenu', handleBoardRightClick)

// Footer buttons
quickResetBtnEl.addEventListener('click', handleResetClick)
customResetBtnEl.addEventListener('click', handleCustomResetClick)
rulesBtnEl.addEventListener('click', handleRulesClick)


/*----- functions -----*/
function handleBoardLeftClick(evt) {
    quickResetBtnEl.disabled = false

    const targetCell = evt.target
    const targetCellIdx = targetCell.classList[4].substring(1)
    
    if(targetCell.classList.contains('cell')) {
        const tmpCellState = targetCell.classList[1]

        if(tmpCellState === STATES.HIDDEN) {
            if(!checkForMine(targetCell)) {
                targetCell.innerText = minefield.cells[targetCellIdx].number
            }
        }
        
    }
}

// function checkWin() {
//     if(minefield.numNumberCells === minefield.numCells - minefield.numMines) {
//         win = true
//     }
// }

function checkForMine(targetCell) {
    const cellIdx = targetCell.classList[4].substring(1)

    if(minefield.cells[cellIdx].mine === true) {
        targetCell.classList.replace(STATES.HIDDEN, STATES.MINE)
        console.log('boom')
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

function handleRulesClick(evt) {
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

    // Set mineIdxs equal to starting amount
    mineCountEl.innerHTML = minefield.numMines
    minefield.currentMines = minefield.numMines

    cleanUpPreviousGame()
}

function cleanUpPreviousGame() {
    // Destroy all previous cells, if any
    minefield.cells = []
    minefield.mineLocations = []
}

function createCells() {
    for(let i = 0; i < minefield.numRows * minefield.numCols; i++) {
        const c = i % minefield.numCols
        const r = Math.floor(i / minefield.numCols)

        const cellDiv = document.createElement('div')
        cellDiv.classList.add('cell', STATES.HIDDEN, `c${c}`, `r${r}`, `i${i}`)

        const cell = {
            cellDiv,
            c,
            r,
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

function setNumbers() {
    // loop through all cells
    for(let c = 0; c < minefield.numCols; c++) {
        for(let r = 0; r < minefield.numRows; r++) {
            let mineCount = 0;
            const tmpIdx = convertToIndex(c, r)
            
            // reduce function? Tally up the mines? Yeah................
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

function setNeighbors() {
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

function convertToIndex(x, y) {
    return (minefield.numCols * (y + 1)) - (minefield.numCols - x)
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
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }

    for(let i = 0; i < minefield.cells.length; i++) {
        minefieldEl.appendChild(minefield.cells[i].cellDiv)
    }

    // minefieldEl.style.setProperty('--row-num', DIFFICULTIES.EASY.ROWS)
    // minefieldEl.style.setProperty('--col-num', DIFFICULTIES.EASY.COLS)
}

function init() {
    renderMinefield()
}

init()


// const card = {
//     suit: 'c',
//     value: 'A'
// }
// document.querySelector('div').classList.add(card.suit + card.value)
