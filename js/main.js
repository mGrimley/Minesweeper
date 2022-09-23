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
    
    if(!gameOver && !win) {
        const targetCell = evt.target
       
        if(targetCell.classList.contains('cell')) {
            const targetCellIdx = targetCell.classList[4].substring(1)
            const tmpCellState = targetCell.classList[1]

            if(tmpCellState === STATES.HIDDEN) {
                checkForMine(targetCell, targetCellIdx)
                checkWin()
            }
            
        }
    }
}

function checkWin() {
    if(minefield.numNumberCells === minefield.numCells - minefield.numMines) {
        win = true
    }
}

function checkForMine(targetCell, targetCellIdx) {
    if(mineIdxs.some(mineIdx => mineIdx == targetCellIdx)) {
        targetCell.classList.replace(STATES.HIDDEN, STATES.MINE)

        // Reveal all mines 
        // revealAllMines()

        // for(let i = 0; i < minefield.numCells; i++) {
        //     // get 
        // } part of revealAllMines()

        // Game over
        gameOver = true
    } else {
        targetCell.classList.replace(STATES.HIDDEN, STATES.NUMBER)
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
    while(minefieldEl.firstChild) {
        minefieldEl.removeChild(minefieldEl.lastChild)
    }
    minefield.cells = []
    minefield.mineLocations = []
}

function createCells() {
    for(let i = 0; i < minefield.numRows * minefield.numCols; i++) {
        const c = i % minefield.numCols;
        const r = Math.floor(i / minefield.numCols)

        const cellDiv = document.createElement('div')
        cellDiv.classList.add('cell', STATES.HIDDEN, `c${c}`, `r${r}`, `i${i}`)

        const cell = {
            cellDiv,
            c,
            r,
            i,
            state: STATES.HIDDEN,
            mine: false
        }

        minefield.cells.push(cell)
    }

    setMineLocations()
}

function setMineLocations() {
    for(let i = 0; i < minefield.numMines; i++) {
        let tmpMineIdx = randomUntakenCellIdx((minefield.numRows * minefield.numCols) - 1)
        minefield.cells[tmpMineIdx].mine = true
        minefield.mineLocations.push(tmpMineIdx)
    }
    // if(cheatsEnabled) console.log(minefield.mineLocations)
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

    // minefield.cells.forEach(cell => {
    //     minefieldEl.append(minefield.cells[idx].cellDiv)
    // })
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
