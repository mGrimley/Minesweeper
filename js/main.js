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

    numMines: DIFFICULTIES.EASY.MINES,
    currentMines: DIFFICULTIES.EASY.MINES,

    cells: [],
}

let mines = []


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
    
    if(targetCell.classList.contains('cell')) {
    const tmpCellState = targetCell.classList[1]
        if(tmpCellState === STATES.HIDDEN) {
            targetCell.classList.replace(tmpCellState, STATES.UNCOVERED)
            // update corresponding cell's state to uncovered
        }
    }
}

function handleBoardRightClick(evt) {
    evt.preventDefault()

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
    // Reset quick reset button
    quickResetBtnEl.disabled = true
    
    // Reset mineCountEl color
    mineCountEl.style.color = 'black'

    // Set mines equal to starting amount
    mineCountEl.innerHTML = minefield.numMines
    minefield.currentMines = minefield.numMines

    // Destroy all previous cells, if any
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
    minefield.cells = []

    createCells()

    renderCells()

    setMines()
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
                mine: false,
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
        let tmpIdx = randomCellIdx((minefield.numRows * minefield.numCols) - 1)

        mines.push(tmpIdx)
    }
    console.log(mines)
}

function randomCellIdx(max) {
    return Math.floor(Math.random() * max)
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