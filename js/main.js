/*----- constants -----*/ 
const MAX_WIDTH = 40
const MAX_HEIGHT = 40
const MAX_MINES = 99
const DIFFICULTIES = {
    EASY: {ROWS: 9, COLS: 9, MINES: 10},
    MEDIUM: {ROWS: 16, COLS: 16, MINES: 40},
    HARD: {ROWS: 24, COLS: 24, MINES: 10},
    CUSTOM: 'custom'
}
const STATES = {
    HIDDEN: 'hidden',
    FLAGGED: 'flagged',
    MINE: 'mine',
    NUMBER: 'number',
    UNCOVERED: 'uncovered',
}


/*----- app's state (variables) -----*/ 
const minefield = {
    numRows: DIFFICULTIES.EASY.ROWS, 
    numCols: DIFFICULTIES.EASY.COLS,
    numCells: DIFFICULTIES.EASY.ROWS * DIFFICULTIES.EASY.COLS,

    numMines: DIFFICULTIES.EASY.MINES,
    currentMines: DIFFICULTIES.EASY.MINES,

    cells: [],
}

let mineIdxs = numberIdxs = []

gameOver = false

let cheatsEnabled = true // Flip this for 


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

    if(!gameOver) {
        const targetCell = evt.target
        const targetCellIdx = targetCell.classList[4].substring(1)
        
        if(targetCell.classList.contains('cell')) {
        const tmpCellState = targetCell.classList[1]
            if(tmpCellState === STATES.HIDDEN) {
    
                //checkWin()?
                checkForMine(targetCell, targetCellIdx)
            }
            
        }
    }
}

function checkForMine(targetCell, targetCellIdx) {
    if(mineIdxs.some(mineIdx => mineIdx == targetCellIdx)) {
        console.log(`targetCellIdx: ${targetCellIdx}`)
        console.log('boom')
        targetCell.classList.replace(STATES.HIDDEN, STATES.MINE)

        // Reveal all mines

        for(let i = 0; i < minefield.numCells; i++) {
            // get 
        }

        // Game over
        gameOver = true
    } else {
        targetCell.classList.replace(STATES.HIDDEN, STATES.NUMBER)
        console.log(`targetCellIdc: ${targetCellIdx}`)
        console.log('no boom')
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

    setMines()
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
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
    minefield.cells = []

    // Destroy all previous mineIdxs and numberIdxs, if any
    mineIdxs = []
    numberIdxs = []
}

function createCells() {
    let tmpIdx = 0;
    
    for(let r = 0; r < minefield.numRows; r++) {
        const tmpRow = []

        for(let c = 0; c < minefield.numCols; c++) {
            // Create div  element
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell', STATES.HIDDEN, `r${r}`, `c${c}`, `i${tmpIdx++}`)

            // Create corresponding cell object
            const cell = {
                cellDiv,
                r: r,
                c: c,
                state: STATES.HIDDEN,
                mine: false,
                number: null,
            }

            // Add the cell to the column
            tmpRow.push(cell)
        }

        // Add the column to the minefield.cells array
        minefield.cells.push(tmpRow)
    }
}

function renderCells() {
    minefield.cells.forEach(col => {
        col.forEach(cell => {
            minefieldEl.append(cell.cellDiv)
        })
    })
    // minefieldEl.style.setProperty('--row-num', DIFFICULTIES.EASY.ROWS)
    // minefieldEl.style.setProperty('--col-num', DIFFICULTIES.EASY.COLS)
}

function setMines() {
    for(let i = 0; i < minefield.numMines; i++) {
        let tmpIdx = randomUntakenCellIdx((minefield.numRows * minefield.numCols) - 1)

        mineIdxs.push(tmpIdx)
    }
    if(cheatsEnabled) console.log(mineIdxs)
}

function randomCellIdx(max) {
    return Math.floor(Math.random() * max)
}

function randomUntakenCellIdx(max) {
    let tmpIdx = randomCellIdx(max)

    while(mineIdxs.some(mineIdx => mineIdx === tmpIdx)) {
        tmpIdx = randomCellIdx(max)
    }

    return tmpIdx
}

function checkMine(evt) {
    if(evt.target.mine === true) {
        return 'boom'
    }
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