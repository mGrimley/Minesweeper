/*----- constants -----*/ 
const MAX_WIDTH = 40
const MAX_HEIGHT = 40
const MAX_MINES = 99
const DIFFICULTIES = ['easy', 'medium', 'hard', 'custom']

/*----- app's state (variables) -----*/ 
let numMines = currentMines = 10

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
    
    // Create specified number of cells 
    for(let r = 1; r <= minefield.rowNum; r++) {
        const row = []
        for(let c = 1; c <= minefield.colNum; c++) {
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell', 'hidden', `r${r}`, `c${c}`)
            document.querySelector('.minefield').appendChild(cellDiv)

            const cell = {
                x: r,
                y: c,
            }

            row.push(cell)
        }
        minefield.cells.push(row)
    }
    

}

const minefield = {    
    rowNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--rowNum')), 
    colNum: parseInt(getComputedStyle(minefieldEl).getPropertyValue('--colNum')),
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