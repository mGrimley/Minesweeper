/*----- constants -----*/ 
const MAX_WIDTH = 40
const MAX_HEIGHT = 40
const MAX_MINES = 99
const DIFFICULTIES = {
    EASY: {COLS: 9, ROWS: 9, MINES: 10},
    MEDIUM: {COLS: 16, ROWS: 16, MINES: 40},
    HARD: {COLS: 24, ROWS: 24, MINES: 10},
    CUSTOM: 'custom'
}
const STATES = {
    HIDDEN: 'hidden',
    FLAGGED: 'flagged',
    MINE: 'mine',
    NUMBER: 'number',
    UNCOVERED: 'uncovered',
}

const minefield = {    
    rowNum: DIFFICULTIES.EASY.ROWS, 
    colNum: DIFFICULTIES.EASY.COLS,
    cells: [],
}


/*----- app's state (variables) -----*/ 
let numMines = currentMines = DIFFICULTIES.EASY.MINES


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
            currentMines--
        } else if(tmpCellState === STATES.FLAGGED) {
            targetCell.classList.replace(tmpCellState, STATES.HIDDEN)
            currentMines++
        }
        
        renderMineCountEl()

        mineCountEl.textContent = currentMines
    }
}
function renderMineCountEl() {
    if(currentMines === 0) {
        mineCountEl.style.color = 'green'
    } else if(currentMines < 0) {
        mineCountEl.style.color = 'red'
    } else {
        mineCountEl.style.color = 'black'
    }
}

function handleResetClick(evt) {
    renderMinefield(minefield.rowNum, minefield.colNum)
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
    mineCountEl.innerHTML = numMines
    currentMines = numMines

    // Destroy all previous cells, if any
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
     minefield.cells = []

    let tmpIdx = 0;
    for(let c = 0; c < minefield.colNum; c++) {
        const col = []
        for(let r = 0; r < minefield.rowNum; r++) {
            // Create div element
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell', STATES.HIDDEN, `c${r}`, `r${c}`, `i${tmpIdx++}`)

            // Create corresponding cell object
            const cell = {
                cellDiv,
                c: c,
                r: r,
                mine: false,
            }

            col.push(cell)
         }
         minefield.cells.push(col)
    }

    drawCells()
}

function drawCells() {
    minefield.cells.forEach(row => {
        row.forEach(cell => {
            minefieldEl.appendChild(cell.cellDiv)
        })
    })
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