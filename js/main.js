/*----- constants -----*/ 
const MAX_WIDTH = 40
const MAX_HEIGHT = 40
const MAX_MINES = 99
const DIFFICULTIES = {
    //difficulty: [rows, cols, mines]
    EASY: [9, 9, 10],
    MEDIUM: [16, 16, 40],
    HARD: [24, 24, 99],
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
let numMines = currentMines = DIFFICULTIES.EASY[2]

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

        if(tmpCellState === 'flagged') {

        } else if(tmpCellState === 'hidden') {
            targetCell.classList.replace(tmpCellState, 'uncovered')
        }
    }
}

function handleBoardRightClick(evt) {
    evt.preventDefault()
    quickResetBtnEl.disabled = false

    const targetCell = evt.target

    if(targetCell.classList.contains('cell')) {
        const tmpCellState = targetCell.classList[1]

        if(tmpCellState === 'hidden') {
            targetCell.classList.replace(tmpCellState, 'flagged')
            currentMines--
            //currentMines-- ?
        } else if(tmpCellState === 'flagged') {
            targetCell.classList.replace(tmpCellState, 'hidden')
            currentMines++
        }

        
        if(currentMines === 0) {
            mineCountEl.style.color = 'green'
            // set number green
        } else if(currentMines < 0) {
            mineCountEl.style.color = 'red'
            // set number red
        } else {
            mineCountEl.style.color = 'black'
            // set number black
        }

        mineCountEl.textContent = currentMines
        
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
    
    // Create specified number of cells 
    // let tmpIdx = 0;
    // for(let r = 1; r <= minefield.rowNum; r++) {
    //     const row = []
    //     for(let c = 1; c <= minefield.colNum; c++) {
    //         const cellDiv = document.createElement('div')
    //         cellDiv.classList.add('cell', 'hidden', `r${r}`, `c${c}`, `i${++tmpIdx}`)
    //         // document.querySelector('.minefield').appendChild(cellDiv)

    //         const cell = {
    //             cellDiv,
    //             r: r,
    //             c: c,
    //             mine: false,
    //         }

    //         row.push(cell)
    //     }
    //     minefield.cells.push(row)
    // }

    let tmpIdx = 0;
    for(let c = 1; c <= minefield.colNum; c++) {
        const col = []
        for(let r = 1; r <= minefield.rowNum; r++) {
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell', 'hidden', `c${c}`, `r${r}`, `i${++tmpIdx}`)
            // document.querySelector('.minefield').appendChild(cellDiv)

            const cell = {
                cellDiv,
                r: r,
                c: c,
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

    // minefieldEl.style.setProperty('--row-num', DIFFICULTIES.EASY[0])
    // minefieldEl.style.setProperty('--col-num', DIFFICULTIES.EASY[1])
}

const minefield = {    
    rowNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--row-num')), 
    colNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--col-num')),
    cells: [],
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